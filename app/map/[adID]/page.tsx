"use client";

import { fetchAd } from "@/lib/actions";
import { Listing } from "@/lib/types";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState, useTransition } from "react";

export default function AdMapPage() {
  const adID = useParams()["adID"] as string | undefined;

  const [ad, setAd] = useState<Listing>();
  const [fetching, startFetching] = useTransition();

  useEffect(() => {
    startFetching(async () => {
      if (!adID) {
        return;
      }
      const { data } = await fetchAd(adID);

      if (data) {
        setAd({
          ...data,
          latitude: data.location.coordinates[1],
          longitude: data.location.coordinates[0],
          image: data.images[0],
        });
      }
    });
  }, [adID]);
  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/parts/maps/mapbox/AdMapView"), {
        loading: () => (
          <div className="w-full rounded-sm  h-full flex justify-center items-center">
            Loading ...
          </div>
        ),
        ssr: false,
      }),
    []
  );
  return <div className="h-[90vh] bg-accent">{ad && <Map ad={ad} />}</div>;
}
