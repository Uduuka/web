"use client";

import dynamic from "next/dynamic";
import React, { ComponentProps, useMemo } from "react";
interface MapviewProps extends ComponentProps<"div"> {
  provider: "leaflet" | "mapbox";
}
export default function Mapview({ provider, ...props }: MapviewProps) {
  const map =
    provider === "mapbox"
      ? import("@/components/parts/maps/mapbox/MapboxMap")
      : import("@/components/parts/maps/leaflet/LeafLetMap");
  const Map = useMemo(
    () =>
      dynamic(() => map, {
        loading: () => (
          <div className="w-full rounded-sm border-2 h-full flex justify-center items-center">
            Loading ...
          </div>
        ),
        ssr: false,
      }),
    []
  );
  return (
    <div {...props}>
      <Map />
    </div>
  );
}
