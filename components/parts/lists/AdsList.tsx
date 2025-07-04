"use client";

import { useEffect, useState } from "react";
import { Listing } from "@/lib/types";
import { cn, responsiveColumns } from "@/lib/utils";
import AdCard from "../cards/AdCard";
import { useFilteredAds } from "@/lib/hooks/use_filtered_ads";

export default function AdsList({
  title,
  className,
}: {
  title?: string;
  className?: string;
}) {
  const [columns, setColumns] = useState<Listing[][] | null>(null);
  const { ads, fetching, error } = useFilteredAds();

  // Organise ads in columns based on the device width
  useEffect(() => {
    if (!ads) {
      return;
    }

    const organise = () => {
      setColumns(responsiveColumns(ads));
    };
    organise();
    window.addEventListener("resize", organise);

    return () => {
      window.removeEventListener("resize", organise);
    };
  }, [ads]);

  return (
    <div className={cn("px-5 py-3", className)}>
      {fetching && <p className="text-uduuka-gray">Loading...</p>}
      {error && <p className="text-error text-center w-full">Error: {error}</p>}
      <div className="flex gap-5">
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
