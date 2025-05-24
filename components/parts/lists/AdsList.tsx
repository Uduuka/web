"use client";

import { useEffect, useState, useTransition } from "react";
import { Error, Listing } from "@/lib/types";
import { cn, responsiveColumns } from "@/lib/utils";
import Link from "next/link";
import AdCard from "../cards/AdCard";
import Button from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import { ads } from "@/lib/dev_db/db";
import AppliedFiltersCard from "../cards/AppliedFiltersCard";
import { usePathname } from "next/navigation";

export default function AdsList({
  title,
  className,
}: {
  title?: string;
  className?: string;
}) {
  const [isLoading, startLoading] = useTransition();
  const [error, setError] = useState<Error | null>(null);
  const [columns, setColumns] = useState<Listing[][] | null>(null);
  const pathname = usePathname();
  const listings = ads;
  useEffect(() => {
    const organise = () => {
      setColumns(responsiveColumns(listings));
    };
    organise();
    window.addEventListener("resize", organise);

    return () => {
      window.removeEventListener("resize", organise);
    };
  }, []);
  return (
    <div className={cn("px-5 py-3", className)}>
      {pathname !== "/" && <AppliedFiltersCard />}
      {title && (
        <h1 className="text-base font-bold w-full flex pb-2 justify-between">
          {title}
          <Link className="" href="/search">
            <Button className="py-2 px-5 gap-2 group text-xs font-light bg-transparent hover:bg-secondary transition-all rounded">
              View all
              <ArrowRight className="" size={15} />
            </Button>
          </Link>
        </h1>
      )}
      {isLoading && <p className="text-uduuka-gray">Loading...</p>}
      {error && <p className="text-uduuka-red">Error: {error.message}</p>}
      <div className="flex gap-5">
        {columns?.map((items, index) => (
          <div key={index} className="flex flex-col gap-5 w-full">
            {items.map((item) => (
              <AdCard key={item.id} ad={item} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
