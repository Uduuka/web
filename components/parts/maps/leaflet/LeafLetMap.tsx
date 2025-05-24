"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { MapContainer, TileLayer } from "react-leaflet";
import { useContext, useEffect, useState } from "react";
import { Listing, Location } from "@/lib/types";
import { useAppStore } from "@/lib/store";

type Props = {
  ads?: Listing[];
  ad?: Listing;
  loading?: boolean;
};
export default function LeafletMap({ ads, ad, loading }: Props) {
  const [center, setCenter] = useState<Location | null>(null);
  const { location } = useAppStore();

  useEffect(() => {
    setCenter(location);
  }, [location]);

  if (!center || loading) {
    return (
      <div className="w-full rounded-sm h-[75vh] border-2 flex justify-center items-center">
        loading ...
      </div>
    );
  }

  return (
    <div className="w-full h-full z-0">
      <MapContainer
        className="h-full w-full"
        center={[center.latitude!, center.longitude!]}
        zoom={8}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
}
