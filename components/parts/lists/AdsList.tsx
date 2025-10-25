"use client";

import { useEffect, useRef, useState } from "react";
import { Listing } from "@/lib/types";
import { cn, responsiveColumns } from "@/lib/utils";
import AdCard from "../cards/AdCard";
import { useFilteredAds } from "@/lib/hooks/use_filtered_ads";
import AdCardSkelton from "@/components/skeltons/AdCardSkelton";
import Button from "@/components/ui/Button";
import { Info } from "lucide-react";
import { useParams } from "next/navigation";

export default function AdsList({
  className,
  errorMessage,
  emptyMessage,
}: {
  className?: string;
  errorMessage?: string;
  emptyMessage?: string;
}) {
  const [columns, setColumns] = useState<Listing[][] | null>(null);
  const store_id = useParams()["storeID"] as string;
  const { ads, fetching, error } = useFilteredAds(store_id);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ads) {
      return;
    }

    const organise = () => {
      const width = containerRef.current?.clientWidth || window.innerWidth;
      setColumns(responsiveColumns(ads, width));
    };
    organise();
    window.addEventListener("resize", organise);

    return () => {
      window.removeEventListener("resize", organise);
    };
  }, [ads]);

  if (fetching) {
    const loadingColumns = responsiveColumns(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      containerRef.current?.clientWidth || window.innerWidth
    );
    return (
      <div className={cn("px-5 py-3", className)}>
        <div className="flex gap-5" ref={containerRef}>
          {loadingColumns?.map((items, index) => (
            <div
              key={index}
              className="flex flex-col gap-5 w-full"
              style={{ minWidth: `${(1 / loadingColumns.length) * 90}%` }}
            >
              {items.map((item, i) => (
                <AdCardSkelton key={item} />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("px-5 py-3", className)}>
        <div className="flex flex-col  gap-3 bg-red-50 p-5 max-w-lg mx-auto text-error">
          <div className="flex gap-2">
            <Info />
            <p className="text-sm">
              Error: {errorMessage} {error}
            </p>
          </div>
          <Button
            onClick={() => {
              window.location.reload();
            }}
            className="bg-primary w-full max-w-40 text-background"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (ads?.length === 0) {
    return (
      <div className={cn("px-5 py-3", className)}>
        <div className="bg-gray-200 text-gray-500 p-5 rounded-lg max-w-lg mx-auto">
          <div className="flex  gap-2 justify-center mb-3">
            <Info className="w-8 h-8" />
            <p className="text-sm">
              {emptyMessage ||
                "No ads available that could match with the apllied filters. Please adjust the filters and try again"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("px-5 pb-5", className)}>
      <div className="flex gap-5" ref={containerRef}>
        {columns?.map((items, index) => (
          <div
            key={index}
            className="flex flex-col gap-5 w-full"
            style={{ minWidth: `${(1 / columns.length) * 90}%` }}
          >
            {items.map((item, i) => (
              <AdCard key={i} ad={item} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
