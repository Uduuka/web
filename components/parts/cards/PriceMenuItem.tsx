import { Currency, MenuItem } from "@/lib/types";
import React from "react";
import { Money } from "./PriceTag";
import Button from "@/components/ui/Button";

export default function PriceMenuItem({
  item,
  currency,
}: {
  item: MenuItem;
  currency: Currency;
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
        <div className="flex flex-wrap justify-between pt-2">
          <Money
            price={item.price}
            defaultCurrency={currency}
            className="text-primary font-bold"
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button className="bg-primary text-xs hover:bg-primary/90 text-background">
            Place order
          </Button>
          <Button className="text-primary text-xs hover:bg-primary border border-primary hover:text-background">
            Add to cart
          </Button>
        </div>
      </div>
    </div>
  );
}
