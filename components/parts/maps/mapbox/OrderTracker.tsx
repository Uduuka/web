"use client";

import React, { use, useEffect, useRef } from "react";
import mapboxgl, { LngLatLike, Map, Marker } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapProps {
  orderLocation: { longitude: number; latitude: number };
  destinationLocation: { longitude: number; latitude: number };
}

// Set your Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function TrackerMap({
  orderLocation,
  destinationLocation,
}: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const buyerMarker = useRef<Marker | null>(null);
  const orderMarker = useRef<Marker | null>(null);

  useEffect(() => {
    if (map.current) {
      console.log("Map already loaded!");
      return;
    }

    const center: LngLatLike = [
      destinationLocation.longitude,
      destinationLocation.latitude,
    ];

    map.current = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLDivElement,
      style: "mapbox://styles/mapbox/standard",
      zoom: 12,
      attributionControl: false,
    });

    // Add buyer location marker
    // map.current!.addSource("destination", {
    //   type: "geojson",
    //   data: {
    //     type: "FeatureCollection",
    //     features: [
    //       {
    //         type: "Feature",
    //         geometry: {
    //           type: "Point",
    //           coordinates: center,
    //         },
    //         properties: {},
    //       },
    //     ],
    //   },
    // });
    buyerMarker.current = new mapboxgl.Marker({ color: "#f97316" })
      .setLngLat(center)
      .setPopup(new mapboxgl.Popup().addTo(map.current!))
      .addTo(map.current);

    const orderLngLat: LngLatLike = [
      orderLocation.longitude,
      orderLocation.latitude,
    ];

    map.current.on("load", () => {
      // Add transporter current location as a source
      map.current!.addSource("transporter", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: center,
              },
              properties: {},
            },
          ],
        },
      });

      // Add layer for the transporter location
      map.current!.addLayer({
        id: "transporter",
        type: "circle",
        source: "transporter",
        paint: {
          "circle-color": "#10b981",
          "circle-radius": 8,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
        },
      });
    });

    // Add order location marker
    orderMarker.current = new mapboxgl.Marker({ color: "#3b82f6" })
      .setLngLat(orderLngLat)
      .setPopup(new mapboxgl.Popup().addTo(map.current!))
      .addTo(map.current);

    // Fit map to show both markers
    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend(center);
    bounds.extend(orderLngLat);
    map.current.fitBounds(bounds, { padding: 30 });

    // Show directions from order location to buyer location using Mapbox Directions API
    const directionsRequest = `https://api.mapbox.com/directions/v5/mapbox/driving/${orderLocation.longitude},${orderLocation.latitude};${destinationLocation.longitude},${destinationLocation.latitude}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

    if (map.current) {
      fetch(directionsRequest)
        .then((response) => response.json())
        .then((data) => {
          if (!data.routes || data.routes.length === 0) {
            console.error("No routes found");
            return;
          }
          const route = data.routes[0].geometry;

          if (map.current!.getSource("route")) {
            map.current!.removeLayer("route");
            map.current!.removeSource("route");
          }

          // Add the route as a layer on the map
          map.current!.addSource("route", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: route,
            },
          });

          map.current!.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: { "line-color": "#3b82f6", "line-width": 5 },
          });
        })
        .catch((error) => {
          console.error("Error fetching directions:", error);
        });
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [location]);

  return <div ref={mapContainerRef} className="w-full rounded-lg h-full" />;
}
