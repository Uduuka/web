"use client";

import dynamic from "next/dynamic";
import React, { useMemo } from "react";

export default function page() {
  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/parts/maps/mapbox/MapboxMap"), {
        loading: () => (
          <div className="w-full rounded-sm  h-full flex justify-center items-center">
            Loading ...
          </div>
        ),
        ssr: false,
      }),
    []
  );
  return (
    <div className="h-[90vh] bg-accent">
      <Map />
    </div>
  );
}
