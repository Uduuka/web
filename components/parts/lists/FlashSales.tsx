"use client";

import ScrollArea from "@/components/parts/layout/ScrollArea";
import { useState, useTransition } from "react";
import { Error, FlashSale } from "@/lib/types";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { ArrowRight, FlaskConical } from "lucide-react";
import { ads } from "@/lib/dev_db/db";
import FlashSaleCard from "../cards/FlashSaleCard";
import { IoMdFlash } from "react-icons/io";

export default function FlashSales({
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

  const stores: FlashSale[] = [
    {
      id: "1",
      ad: ads.find((ad) => ad.id === "1")!,
      start: new Date(),
      duration: 30,
      flashPrice: 20,
      info: "Buy quick",
    },
    {
      id: "2",
      ad: ads.find((ad) => ad.id === "2")!,
      start: new Date(),
      duration: 120,
      flashPrice: 420,
      info: "Buy quick",
    },
    {
      id: "3",
      ad: ads.find((ad) => ad.id === "3")!,
      start: new Date(),
      duration: 120,
      flashPrice: 14,
      info: "Buy quick",
    },
  ];

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
            <FlashSaleCard key={item.id} item={item} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
