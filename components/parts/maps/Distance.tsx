"use client";

import Button from "@/components/ui/Button";
import { useAppStore } from "@/lib/store";
import { fetchDrivingDistance } from "@/lib/utils";
import { MapPin } from "lucide-react";
import mapboxgl from "mapbox-gl";
import Link from "next/link";
import { ComponentProps, useEffect, useState, useTransition } from "react";
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface DistanceProps extends ComponentProps<typeof Link> {
  destination: [number, number];
}

export default function Distance({ destination, href }: DistanceProps) {
  const { location } = useAppStore();
  const [dist, setDist] = useState<string>();
  const [calculating, startCalculating] = useTransition();

  useEffect(() => {
    startCalculating(async () => {
      const latitude = destination[1];
      const longitude = destination[0];
      if (!location) return;
      const d = await fetchDrivingDistance(
        location,
        { coordinates: [latitude, longitude], latitude, longitude },
        mapboxgl.accessToken
      );

      setDist(d);
    });
  }, [destination, location]);

  if (!dist) {
    return null;
  }
  return (
    <Link href={href}>
      <Button className="text-xs font-thin text-accent hover:bg-secondary">
        <MapPin className="mr-2 h-4 w-4" />
        {dist} Km away
      </Button>
    </Link>
  );
}
