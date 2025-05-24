"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAppStore } from "@/lib/store";

const MapboxMap = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { location } = useAppStore();

  useEffect(() => {
    // Set your Mapbox access token
    mapboxgl.accessToken =
      "pk.eyJ1IjoiZWR3YWZ1bGEiLCJhIjoiY21haTdmMzF6MGloOTJsczNxZjJyZXZlNCJ9.2y9bWsfweWfSLg5Fii7MvQ";

    const map = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLDivElement,
      style: "mapbox://styles/mapbox/standard",
      center: [location?.longitude ?? 0, location?.latitude ?? 0], // Example coordinates
      zoom: 12,
      attributionControl: false,
    });

    // Hide the point point of interest.
    map.on("style.load", () => {
      map.setConfigProperty("basemap", "showPointOfInterestLabels", false);
    });

    // Add a marker
    new mapboxgl.Marker({ color: "#f97316" })
      .setLngLat([location?.longitude ?? 0, location?.latitude ?? 0])
      .setPopup(
        new mapboxgl.Popup().setHTML(`
          <div class="rounded-lg h-16">
            <h1>You are here.</h1>
          </div>
        `)
      )
      .addTo(map);

    // Reload the map
    map.resize();

    return () => map.remove();
  }, []);

  return <div ref={mapContainerRef} className="h-full w-full" />;
};

export default MapboxMap;
