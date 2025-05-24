"use client";

import ScrollArea from "@/components/parts/layout/ScrollArea";
import { useState, useTransition } from "react";
import { Error, Listing, Store } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
import StoreCard from "../cards/StoreCard";
import { stores } from "@/lib/dev_db/db";

export default function StoreList({
  title,
  orientation = "vertical",
  className,
}: {
  title?: string;
  className?: string;
  orientation?: "vertical" | "horizontal";
}) {
  const [isLoading, startLoading] = useTransition();
  const [error, setError] = useState<Error | null>(null);

  return (
    <div className="px-5 pt-3">
      {title && (
        <h1 className="pb-2 text-base font-bold w-full flex justify-between">
          {title}
          <Link className="" href="/stores">
            <Button className="py-2 px-5 gap-2 group text-xs font-light bg-transparent hover:bg-secondary transition-all rounded">
              View all
              <ArrowRight className="" size={15} />
            </Button>
          </Link>
        </h1>
      )}
      {isLoading && <p className="text-uduuka-gray">Loading...</p>}
      {error && <p className="text-uduuka-red">Error: {error.message}</p>}
      <ScrollArea
        maxHeight={orientation === "vertical" ? "100%" : "fit-content"}
        ariaLabel="Listings scroll area"
      >
        <div
          className={
            orientation === "horizontal" ? "flex w-max gap-5" : className
          }
        >
          {stores.map((item) => (
            <StoreCard
              key={item.id}
              store={item}
              className={`${orientation === "vertical" ? "w-full" : "w-80"}`}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
