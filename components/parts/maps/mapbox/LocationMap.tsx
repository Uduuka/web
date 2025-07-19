"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { LngLat, LngLatLike, Map, Marker } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAppStore } from "@/lib/store";

interface MapProps {
  onLocationChange: (location: string, address: string) => void;
}

// Set your Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function MapboxMap({ onLocationChange }: MapProps) {
  const { location } = useAppStore();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const marker = useRef<Marker | null>(null);

  const [address, setAddress] = useState<string>("Fetching address...");

  // Function to fetch address from coordinates using Mapbox Geocoding API
  const fetchAddress = async (lng: number, lat: number): Promise<void> => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${lng}&latitude=${lat}&access_token=${mapboxgl.accessToken}`
      );
      const data: { features: { properties: { full_address: string } }[] } =
        await response.json();
      const placeName: string =
        data.features[0]?.properties?.full_address || "Unknown address";
      setAddress(placeName);
      onLocationChange(`POINT(${lng} ${lat})`, placeName);
    } catch (error: unknown) {
      console.error("Error fetching address:", error);
      setAddress("Unable to fetch address");
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

    const center: LngLatLike = [location.longitude, location.latitude];

    map.current = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLDivElement,
      style: "mapbox://styles/mapbox/standard",
      center, // Example coordinates
      zoom: 12,
      attributionControl: false,
    });

    // Add controls
    map.current.addControl(new mapboxgl.NavigationControl());

    // Add user location marker
    marker.current = new mapboxgl.Marker({ color: "#f97316", draggable: true })
      .setLngLat(center)
      .setPopup(new mapboxgl.Popup().addTo(map.current!))
      .addTo(map.current);

    marker.current?.on("dragend", async () => {
      const { lng, lat } = marker.current!.getLngLat();
      map.current!.flyTo({ center: [lng, lat], duration: 1000, zoom: 14 });
      await fetchAddress(lng, lat);
    });

    map.current.on("load", async () => {
      fetchAddress(center[0], center[1]);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [location]);

  useEffect(() => {
    marker.current
      ?.getPopup()
      ?.setHTML(`<h1 class="text-primary">${address}</h1>`);
  }, [address]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full rounded-lg overflow-hidden"
    />
  );
}
