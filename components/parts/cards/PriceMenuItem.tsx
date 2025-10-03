import { Listing, PriceMenu, Pricing } from "@/lib/types";
import React from "react";
import { Money } from "./PriceTag";
import { AddToCartButton } from "../buttons/AddToCartButton";

export default function PriceMenuItem({
  item,
  ad,
}: {
  item: PriceMenu;
  ad: Listing;
}) {
  if (!item) {
    return null;
  }
  return (
    <div className="flex gap-2 bg-secondary/70 hover:bg-secondary transition-colors rounded-lg overflow-hidden">
      <div className="w-20"></div>
      <div className="w-full p-2">
        <p className="text-xs font-bold text-foreground">{item.title}</p>
        <p className="text-xs font-light text-accent">{item.description}</p>

        <div className="flex gap-2 justify-between items-center pt-2 border-t border-gray-300">
          <Money price={item.price} className="text-primary font-bold" />
          <AddToCartButton ad={ad} />
        </div>
      </div>
    </div>
  );
}
