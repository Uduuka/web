"use client";

import Button from "@/components/ui/Button";
import { useAppStore } from "@/lib/store";
import {
  FixedPrice,
  PriceMenu,
  PriceRange,
  Pricing,
  RecurringPrice,
  UnitPrice,
} from "@/lib/types";
import { cn, displayCurrencyAndPrice } from "@/lib/utils";
import React, { ComponentProps } from "react";
import Link from "next/link";

type PriceTagProps<T> = ComponentProps<"div"> & {
  pricing: Pricing<T>;
};

export default function PriceTag({ pricing, className }: PriceTagProps<any>) {
  if (!pricing) {
    return null;
  }
  const { scheme } = pricing;
  const Tag = () => {
    switch (scheme) {
      case "fixed":
        return <FixedPriceTag pricing={pricing} />;

      case "range":
        return <PriceRangeTag pricing={pricing} />;

      case "unit":
        return <UnitPriceTag pricing={pricing} />;

      case "recurring":
        return <RecurringTag pricing={pricing} />;

      case "menu":
        return <PriceMenuTag pricing={pricing} />;

      default:
        return null;
    }
  };

  return (
    <div className={cn("text-primary", className)}>
      <Tag />
    </div>
  );
}

export const FixedPriceTag = ({
  pricing,
}: {
  pricing: Pricing<FixedPrice>;
}) => {
  const { currency, details } = pricing;
  return (
    <div className="flex font-bold gap-1">
      <h1 className="flex gap-2 items-center">
        <span className="pr-5">
          <Money price={details.price} defaultCurrency={currency} />
        </span>
        {details.initialPrice && (
          <span className="text-error font-light text-xs">
            <Money
              price={details.initialPrice}
              defaultCurrency={currency}
              crossed
            />
          </span>
        )}
      </h1>
    </div>
  );
};

const PriceRangeTag = ({ pricing }: { pricing: Pricing<PriceRange> }) => {
  const {
    maxPrice: max,
    minPrice: min,
    initialMaxPrice,
    initialMinPrice,
  } = pricing.details;
  return (
    <div className="flex font-bold gap-1 py-1">
      <h1 className="flex gap-2 items-center flex-wrap">
        {!max && <span className="w-fit">From: </span>}
        <Money price={min} defaultCurrency={pricing.currency} />{" "}
        {max && (
          <>
            {" "}
            - <Money price={max} defaultCurrency={pricing.currency} />
          </>
        )}
        {initialMinPrice && (
          <span className="text-error line-clamp-1 font-light text-xs">
            <Money
              price={initialMinPrice}
              crossed
              defaultCurrency={pricing.currency}
            />
          </span>
        )}{" "}
      </h1>
    </div>
  );
};

const UnitPriceTag = ({ pricing }: { pricing: Pricing<UnitPrice> }) => {
  const { price, initialPrice, units } = pricing.details;
  return (
    <div className="flex font-bold gap-1 py-1">
      <h1 className="flex items-center flex-wrap">
        {initialPrice && (
          <span className="text-error line-clamp-1 flex font-light text-xs pr-2">
            <Money
              price={initialPrice}
              defaultCurrency={pricing.currency}
              crossed
            />
            <span className="line-through"> / {units}</span>
          </span>
        )}{" "}
        <Money price={price} defaultCurrency={pricing.currency} />
        <span className="text-xs capitalize flex items-center gap-2">
          {" "}
          / {units}
        </span>
      </h1>
    </div>
  );
};

const RecurringTag = ({ pricing }: { pricing: Pricing<RecurringPrice> }) => {
  const { price, initialPrice, period } = pricing.details;
  return (
    <div className="flex font-bold gap-1 py-1">
      <h1 className="flex items-center flex-wrap">
        {initialPrice && (
          <span className="text-error line-clamp-1 flex font-light text-xs pr-2">
            <Money
              price={initialPrice}
              defaultCurrency={pricing.currency}
              crossed
            />
            <span className="line-through"> / {period}</span>
          </span>
        )}{" "}
        <Money price={price} defaultCurrency={pricing.currency} />
        <span className="text-xs capitalize flex flex-wrap items-center gap-2">
          {" "}
          / {period}
        </span>
      </h1>
    </div>
  );
};

const PriceMenuTag = ({ pricing }: { pricing: Pricing<PriceMenu> }) => {
  const item = pricing.details.items[0];
  if (!item) {
    return null;
  }
  return (
    <div className="">
      <h1 className="flex gap-2 items-center flex-wrap">
        <span>From</span>
        <Money defaultCurrency={pricing.currency} price={item.price} />
        <Button className="hover:bg-gray-200 text-xs">See full menu</Button>
      </h1>
    </div>
  );
};

export const Money = ({
  price,
  defaultCurrency,
  crossed,
  className,
}: {
  price: string;
  defaultCurrency: string;
  crossed?: boolean;
  className?: string;
}) => {
  const { currency } = useAppStore();
  return (
    <span
      className={cn(`flex gap-2 w-fit ${crossed && "line-through"}`, className)}
    >
      {displayCurrencyAndPrice(defaultCurrency, currency, price)}
    </span>
  );
};
