"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Listing } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { renderToString } from "react-dom/server";
import AdCard from "../../cards/AdCard";
import AdPopup from "../AdPopup";
import { fetchDrivingDistance } from "@/lib/utils";

// Define types for coordinates
interface Coordinates {
  longitude: number;
  latitude: number;
}

// Set your Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const SingleAdMap: React.FC<{ ad: Listing }> = ({ ad }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const adPopup = useRef<mapboxgl.Popup | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { location } = useAppStore();

  // Fetch route from Mapbox Directions API
  const fetchRoute = async (
    start: Coordinates,
    end: Coordinates
  ): Promise<GeoJSON.Feature<GeoJSON.LineString> | null> => {
    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        return {
          type: "Feature",
          geometry: data.routes[0].geometry,
          properties: {},
        };
      }
      return null;
    } catch (err) {
      console.error("Error fetching route:", err);
      return null;
    }
  };

  // Initialize map and add markers, route
  useEffect(() => {
    if (!location) return;

    // Calculate midpoint
    const midpoint: Coordinates = {
      longitude: (location.longitude + (ad?.longitude ? ad.longitude : 0)) / 2,
      latitude: (location.latitude + (ad?.latitude ? ad.latitude : 0)) / 2,
    };

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/standard",
      center: [midpoint.longitude, midpoint.latitude],
      zoom: 10, // Initial zoom, will adjust later
    });

    // Hide the point point of interest.
    map.current.on("style.load", () => {
      map.current?.setConfigProperty(
        "basemap",
        "showPointOfInterestLabels",
        false
      );
    });

    map.current.addControl(new mapboxgl.NavigationControl());

    // Add markers when map loads
    map.current.on("load", async () => {
      const { latitude, longitude } = ad;
      if (!latitude || !longitude) {
        return;
      }

      ad.distance = await fetchDrivingDistance(
        location,
        { latitude, longitude },
        mapboxgl.accessToken
      );

      // Add user location marker
      new mapboxgl.Marker({ color: "#f97316" })
        .setLngLat([location.longitude, location.latitude])
        .setPopup(new mapboxgl.Popup().setHTML("<h3>Your Location</h3>"))
        .addTo(map.current!);

      // Add ad location as a GeoJSON source for circular marker
      map.current!.addSource("ad-point", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [longitude, latitude],
              },
              properties: ad,
            },
          ],
        },
      });

      // Add layer for ad marker (circular, like unclustered points in MapView)
      map.current!.addLayer({
        id: "ad-point",
        type: "circle",
        source: "ad-point",
        paint: {
          "circle-color": "#10b981",
          "circle-radius": 8,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
        },
      });

      // Create and open popup for ad marker
      adPopup.current = new mapboxgl.Popup()
        .setLngLat([longitude, latitude])
        .setHTML(renderToString(<AdPopup ad={ad} single />))
        .addTo(map.current!);

      // Handle click on ad point to show popup
      map.current!.on("click", "ad-point", (e) => {
        const coordinates = (
          e.features![0].geometry as any
        ).coordinates.slice();

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(
            renderToString(
              <AdPopup ad={e.features![0].properties as Listing} single />
            )
          )
          .addTo(map.current!);
      });

      // Fetch and add route
      const route = await fetchRoute(location, {
        latitude,
        longitude,
      });
      if (route) {
        map.current!.addSource("route", {
          type: "geojson",
          data: route,
        });
        map.current!.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#f97316",
            "line-width": 5,
            "line-opacity": 0.75,
          },
        });
      }

      // Adjust zoom to fit both points
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend([location.longitude, location.latitude]);
      bounds.extend([ad?.longitude ?? 0, ad?.latitude ?? 0]);
      map.current!.fitBounds(bounds, {
        padding: 100, // Padding in pixels to ensure points are fully visible
        maxZoom: 15, // Prevent excessive zoom
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [location, ad]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {error && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#ffcccc",
            padding: "10px",
            zIndex: 1,
          }}
        >
          {error}
        </div>
      )}
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default SingleAdMap;
