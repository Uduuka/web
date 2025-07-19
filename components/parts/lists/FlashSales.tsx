"use client";

import ScrollArea from "@/components/parts/layout/ScrollArea";
import { Filters, FlashSale } from "@/lib/types";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import FlashSaleCard from "../cards/FlashSaleCard";
import { IoMdFlash } from "react-icons/io";
import { useFilteredFlashSales } from "@/lib/hooks/use_filtered_flash_sales";

export default function FlashSales({
  title,
  orientation = "vertical",
  className,
}: {
  title?: string;
  className?: string;
  orientation?: "vertical" | "horizontal";
}) {
  const { flashSales, error, fetching } = useFilteredFlashSales();

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
      {fetching && <p className="text-uduuka-gray">Loading...</p>}
      {error && <p className="text-uduuka-red">Error: {error}</p>}
      <ScrollArea
        maxHeight={orientation === "vertical" ? "100%" : "fit-content"}
        ariaLabel="Listings scroll area"
      >
        <div
          className={
            orientation === "horizontal" ? "flex w-max gap-5" : className
          }
        >
          {flashSales.map((item: FlashSale) => (
            <FlashSaleCard key={item.id} item={item} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
