"use client";

import ScrollArea from "@/components/parts/layout/ScrollArea";
import { FlashSale } from "@/lib/types";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import FlashSaleCard from "../cards/FlashSaleCard";
import { IoMdFlash } from "react-icons/io";
import { use, useEffect } from "react";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

export default function FlashSales({
  orientation = "vertical",
  className,
  fetchPromise,
}: {
  className?: string;
  ads?: FlashSale[];
  fetchPromise: Promise<PostgrestSingleResponse<FlashSale[]>>;
  orientation?: "vertical" | "horizontal";
}) {
  const { data: ads, error } = use(fetchPromise);

  console.log({ ads, error });

  if (!ads || ads.length < 1) {
    return null;
  }

  return (
    <div className="px-5 pt-3">
      <div className="pb-2 text-base font-bold w-full flex justify-between">
        <div className="flex gap-1 items-center w-fit">
          <h1 className="w-fit">Flash sales</h1>
          <div className="p-0.5 animate-pulse border text-primary flex justify-center items-center bg-transparent w-fit h-fit rounded-full m-1">
            <IoMdFlash className="h-4 w-4" />
          </div>
        </div>
        <Link className="" href="/flash-sales">
          <Button className="py-2 px-5 gap-2 group text-xs font-light bg-transparent hover:bg-secondary transition-all rounded">
            View all
            <ArrowRight className="" size={15} />
          </Button>
        </Link>
      </div>
      <ScrollArea
        maxHeight={orientation === "vertical" ? "100%" : "fit-content"}
        ariaLabel="Listings scroll area"
        className="p-0"
      >
        <div
          className={
            orientation === "horizontal" ? "flex w-max gap-5" : className
          }
        >
          {ads?.map((item: FlashSale) => (
            <FlashSaleCard key={item.id} item={item} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
