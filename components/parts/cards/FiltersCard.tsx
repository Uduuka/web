"use client";

import { PriceRangeSlider, Slider } from "@/components/ui/Range";
import { useAppStore } from "@/lib/store";
import { ComponentProps, useState } from "react";
import PriceTag from "./PriceTag";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function FilterCard({ className }: ComponentProps<"div">) {
  const { currency, filters, setfilters } = useAppStore();
  const [range, setRange] = useState<{ min?: number; max?: number }>({
    min: undefined,
    max: undefined,
  });
  const [rating, setRating] = useState<number>();
  const [distance, setDistance] = useState<number>();

  const applyFilters = () => {};

  return (
    <div
      className={cn("space-y-2 py-2", className)}
      role="group"
      aria-label="Price range filter"
    >
      <div className="p-4 border rounded-lg border-accent/20">
        <h3 className="font-bold text-accent text-xs">Price Range</h3>
        <PriceRangeSlider
          minPrice={0}
          maxPrice={100}
          onChange={(r) => {
            setRange(r);
          }}
        />
        <div className="text-xs text-accent">
          <div className="flex gap-2"></div>
          <div className="flex gap-2"></div>
        </div>
      </div>
      <div className="p-4 border rounded-lg border-accent/20">
        <h3 className="font-bold text-accent text-xs pb-2">
          Rating: <span className="text-primary">{rating?.toFixed(1)}</span>
        </h3>
        <Slider
          progress={0}
          onProgressChange={(p) => {
            setRating(p / 20);
          }}
        />
      </div>
      <div className="p-4 border rounded-lg border-accent/20">
        <h3 className="font-bold text-accent text-xs pb-2">
          Distance:{" "}
          <span className="text-primary">
            {distance && distance?.toFixed(1) + " Km"}{" "}
          </span>
        </h3>
        <Slider
          progress={0}
          onProgressChange={(p) => {
            setDistance(p);
          }}
        />
      </div>
      <div className="w-full py-5">
        <Button
          onClick={applyFilters}
          className="text-xs font-light w-full bg-primary text-background"
        >
          Apply filters
        </Button>
      </div>
    </div>
  );
}
