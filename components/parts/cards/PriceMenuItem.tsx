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
          <Button className="bg-primary text-background">Order now</Button>
        </div>
      </div>
    </div>
  );
}
