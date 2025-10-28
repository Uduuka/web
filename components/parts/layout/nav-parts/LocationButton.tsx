"use client";

import React from "react";
import Button from "@/components/ui/Button";
import Dropdown from "@/components/ui/Dropdown";
import { setCookie } from "@/lib/actions";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Check, MapPin, ShieldQuestion } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function LocationButton() {
  const { setLocation, location } = useAppStore();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (loc) => {
        await setCookie(
          "location",
          JSON.stringify({
            lat: loc.coords.latitude,
            lon: loc.coords.longitude,
          })
        );
        setLocation({
          coordinates: [loc.coords.latitude, loc.coords.longitude],
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });

        const queryString = [
          ...Array.from(searchParams)
            .map(([key, value]) =>
              key === "current-location" ? "" : `${key}=${value}`
            )
            .filter((s) => s.length > 3),
          `current-location=true`,
        ].join("&");
        router.push(`${pathname}?${queryString}`);
      });
    }
  };
  return (
    <Dropdown
      align="right"
      className=""
      trigger={
        <Button
          className={cn(
            "bg-transparent p-0 flex",
            location ? "" : "text-yellow-400 border-yellow-400"
          )}
        >
          <MapPin className="" size={30} />
        </Button>
      }
    >
      <div className="p-4 w-60 shadow-md rounded-md bg-white">
        <div className="text-gray-500">
          {location ? (
            <>
              <p className="w-full flex items-center justify-center pr-2 gap-1 text-green-500 text-xs">
                <Check size={15} /> Your precise location is in use
              </p>
              <p className="py-2 text-xs">
                This means that all ads are filtered based on your location.
              </p>

              <Button className="w-fit gap-1 mx-auto rounded text-xs bg-red-50 text-red-400 hover:bg-red-100">
                <ShieldQuestion size={15} />
                Hide location
              </Button>
            </>
          ) : (
            <>
              <p className="w-full flex items-center justify-center pr-2 gap-1 text-yellow-500 text-xs">
                <ShieldQuestion size={15} /> Your location is not being used
              </p>
              <p className="py-2 text-xs">
                This means that ads are{" "}
                <strong className="font-bold text-foreground">not</strong>{" "}
                filtered based on your location.
              </p>

              <Button
                onClick={getCurrentLocation}
                className="w-fit gap-1 mx-auto rounded text-xs bg-green-50 text-green-400 hover:bg-green-100"
              >
                <Check size={15} /> Use location
              </Button>
            </>
          )}
        </div>
      </div>
    </Dropdown>
  );
}
