"use client";

import ScrollArea from "@/components/parts/layout/ScrollArea";
import { ComponentProps, use } from "react";
import { Store } from "@/lib/types";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import StoreCard from "../cards/StoreCard";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

interface ListProps extends ComponentProps<"div"> {
  title?: string;
  className?: string;
  nextUrl: string;
  orientation?: "vertical" | "horizontal";
  fetchPromise: Promise<PostgrestSingleResponse<Store[]>>;
}

export default function StoreList({
  title,
  orientation = "vertical",
  nextUrl,
  fetchPromise,
  className,
}: ListProps) {
  const { data: stores, error } = use(fetchPromise);
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

      <ScrollArea
        maxHeight={orientation === "vertical" ? "100%" : "fit-content"}
        ariaLabel="Listings scroll area"
      >
        <div
          className={
            orientation === "horizontal" ? "flex w-max gap-5" : className
          }
        >
          {stores?.map((item) => (
            <StoreCard
              nextUrl={nextUrl}
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
