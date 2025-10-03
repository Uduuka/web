"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAppStore } from "@/lib/store";
import { Listing } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { fetchAdsInView } from "@/lib/actions";
import { renderToString } from "react-dom/server";
import AdPopup from "../AdPopup";
import { fetchDrivingDistance } from "@/lib/utils";

// GeoJSON feature type for Mapbox clustering
interface GeoJSONFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: Listing;
}

interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

// Set your Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function MapboxMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);

  const search = useSearchParams().get("search") as string | undefined;
  const catSlug = useSearchParams().get("cs");
  const subCatSlug = useSearchParams().get("scs");

  const { location } = useAppStore();

  // Fetch ads
  const fetchAds = async (): Promise<GeoJSONFeatureCollection> => {
    if (!map.current) {
      return {
        type: "FeatureCollection",
        features: [],
      };
    }
    const boundings = map.current.getBounds();
    if (boundings) {
      const bounds = {
        min_lat: boundings.getSouthEast().lat,
        max_lat: boundings.getNorthWest().lat,
        min_lon: boundings.getNorthWest().lng,
        max_lon: boundings.getSouthEast().lng,
      };

      const { data, error } = await fetchAdsInView({
        bounds,
        search,
        category: catSlug,
        subCategory: subCatSlug,
      });

      if (!data) {
        console.log(error);
        return {
          type: "FeatureCollection",
          features: [],
        };
      }

      return {
        type: "FeatureCollection",
        features: (data as Listing[]).map((ad) => ({
          type: "Feature" as const,
          geometry: {
            type: "Point" as const,
            coordinates: [ad.longitude!, ad.latitude!],
          },
          properties: ad,
        })),
      };
    }

    return {
      type: "FeatureCollection",
      features: [],
    };
  };

  // Update map with clustered data
  const updateMapSource = async (): Promise<void> => {
    if (!map.current) return;

    const geojsonData = await fetchAds();
    const source = map.current.getSource("listings") as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData(geojsonData);
    }
  };

  useEffect(() => {
    if (!location) {
      console.log("location is missing");
      return;
    }

    if (map.current) {
      console.log("Map already loaded!");
      return;
    }

    map.current = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLDivElement,
      style: "mapbox://styles/mapbox/standard",
      center: [location.longitude, location.latitude], // Example coordinates
      zoom: 12,
      attributionControl: false,
    });

    // Add controls
    map.current.addControl(new mapboxgl.NavigationControl());

    // Hide the point point of interest.
    map.current.on("style.load", () => {
      map.current?.setConfigProperty(
        "basemap",
        "showPointOfInterestLabels",
        false
      );
    });

    // Add user location marker
    new mapboxgl.Marker({ color: "#f97316" })
      .setLngLat([location?.longitude ?? 0, location?.latitude ?? 0])
      .setPopup(
        new mapboxgl.Popup().setHTML(`
            <h1>You are here.</h1>
        `)
      )
      .addTo(map.current);

    // Add clustering when map loads
    map.current.on("load", async () => {
      // Add GeoJSON source with clustering enabled
      map.current!.addSource("listings", {
        type: "geojson",
        data: await fetchAds(),
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster at
        clusterRadius: 50, // Radius of each cluster in pixels
      });

      // Add layer for clustered points
      map.current!.addLayer({
        id: "clusters",
        type: "circle",
        source: "listings",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#fee2e2", // Color for clusters with < 10 points
            10,
            "#fed7aa", // 10-50 points
            50,
            "#fb923c", // > 50 points
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            15, // Radius for < 10 points
            10,
            20, // 10-50 points
            50,
            25, // > 50 points
          ],
        },
      });

      // Add layer for cluster count labels
      map.current!.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "listings",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
      });

      // Add layer for individual (unclustered) points
      map.current!.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "listings",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#f97316",
          "circle-radius": 8,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
        },
      });

      // Handle click on clusters to zoom in
      map.current!.on("click", "clusters", (e) => {
        const features = map.current!.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });
        const clusterId = features[0]?.properties?.cluster_id;
        (
          map.current!.getSource("listings") as mapboxgl.GeoJSONSource
        ).getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;
          map.current!.easeTo({
            center: (features[0].geometry as any).coordinates,
            zoom: zoom as number | undefined,
          });
        });
      });

      // Handle click on unclustered points to show popup
      map.current!.on("click", "unclustered-point", async (e) => {
        const coordinates = (
          e.features![0].geometry as any
        ).coordinates.slice();

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        const ad = e.features![0].properties as Listing;
        ad.distance = await fetchDrivingDistance(
          location,
          { latitude: coordinates[1], longitude: coordinates[0], coordinates },
          mapboxgl.accessToken
        );

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(renderToString(<AdPopup ad={ad} />))
          .addTo(map.current!);
      });

      // Change cursor to pointer on hover
      map.current!.on("mouseenter", "clusters", () => {
        map.current!.getCanvas().style.cursor = "pointer";
      });
      map.current!.on("mouseleave", "clusters", () => {
        map.current!.getCanvas().style.cursor = "";
      });
      map.current!.on("mouseenter", "unclustered-point", () => {
        map.current!.getCanvas().style.cursor = "pointer";
      });
      map.current!.on("mouseleave", "unclustered-point", () => {
        map.current!.getCanvas().style.cursor = "";
      });
    });

    // Fetch on zoom
    map.current.on("zoomend", async () => {
      await updateMapSource();
    });

    // Fetch on move
    map.current.on("moveend", async () => {
      await updateMapSource();
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [location]);

  useEffect(() => {
    if (!map.current) {
      return;
    }
    updateMapSource();
  }, [search, catSlug, subCatSlug]);

  return <div ref={mapContainerRef} className="h-full w-full" />;
}
