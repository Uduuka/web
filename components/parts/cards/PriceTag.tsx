"use client";

import Button from "@/components/ui/Button";
import Popup from "@/components/ui/Popup";
import { useAppStore } from "@/lib/store";
import { MenuItem } from "@/lib/types";
import { displayCurrencyAndPrice } from "@/lib/utils";
import Link from "next/link";
import React, { ComponentProps } from "react";

type PriceTagProps = ComponentProps<"div"> & {
  price?: string;
  minPrice?: string;
  maxPrice?: string;
  scheme: string;
  originalPrice?: string;
  originalCurrency: string;
  units?: string;
  period?: string;
  menuItems?: MenuItem[];
};

export default function PriceTag({
  price,
  minPrice,
  maxPrice,
  units,
  scheme,
  originalCurrency,
  originalPrice,
  period,
  menuItems,
}: PriceTagProps) {
  const { currency } = useAppStore();
  const Tag = () => {
    switch (scheme) {
      case "fixed":
        if (!price) return null;
        return (
          <FixedPrice
            originalPrice={
              originalPrice
                ? displayCurrencyAndPrice(
                    originalCurrency,
                    currency,
                    originalPrice
                  )
                : undefined
            }
            price={displayCurrencyAndPrice(originalCurrency, currency, price)}
          />
        );
      case "range":
        if (!minPrice) return null;
        return (
          <PriceRange
            min={displayCurrencyAndPrice(originalCurrency, currency, minPrice)}
            max={
              maxPrice
                ? displayCurrencyAndPrice(originalCurrency, currency, maxPrice)
                : undefined
            }
            original={
              originalPrice
                ? displayCurrencyAndPrice(
                    originalCurrency,
                    currency,
                    originalPrice
                  )
                : undefined
            }
          />
        );

      case "unit":
        if (!price || !units) return null;
        return (
          <UnitPrice
            price={displayCurrencyAndPrice(originalCurrency, currency, price)}
            units={units}
            originalPrice={
              originalPrice
                ? displayCurrencyAndPrice(
                    originalCurrency,
                    currency,
                    originalPrice
                  )
                : undefined
            }
          />
        );
      case "periodic":
        if (!price || !period) return null;
        return (
          <UnitPrice
            price={displayCurrencyAndPrice(originalCurrency, currency, price)}
            units={period}
            originalPrice={
              originalPrice
                ? displayCurrencyAndPrice(
                    originalCurrency,
                    currency,
                    originalPrice
                  )
                : undefined
            }
          />
        );
      case "menu":
        if (!menuItems) return null;
        return <PriceMenu items={menuItems} ad_currency={originalCurrency} />;
      default:
        return null;
    }
  };

  return (
    <div className="text-primary">
      <Tag />
    </div>
  );
}

export const FixedPrice = ({
  price,
  originalPrice,
}: {
  price: string;
  originalPrice?: string;
}) => (
  <div className="flex font-bold gap-1">
    <h1>
      <span className="pr-5">{price}</span>
      {originalPrice && (
        <span className="text-error line-through font-light text-xs">
          {originalPrice}
        </span>
      )}
    </h1>
  </div>
);

const PriceRange = ({
  min,
  max,
  original,
}: {
  min: string;
  max?: string;
  original?: string;
}) => (
  <div className="flex font-bold gap-1 py-1">
    <h1>
      {!max && <span className="">From: </span>}
      {min} {max && ` - ${max}`}
      {original && (
        <span className="text-error line-clamp-1 line-through font-light text-xs">
          {original}
        </span>
      )}{" "}
    </h1>
  </div>
);

const UnitPrice = ({
  price,
  originalPrice,
  units,
}: {
  price: string;
  units: string;
  originalPrice?: string;
}) => (
  <div className="flex font-bold gap-1 py-1">
    <h1>
      {originalPrice && (
        <span className="text-error line-clamp-1 line-through font-light text-xs">
          {`${originalPrice} / ${units}`}
        </span>
      )}{" "}
      {price} {" / "}
      <span className="text-xs capitalize">{units}</span>
    </h1>
  </div>
);

const PriceMenu = ({
  items,
  ad_currency,
}: {
  items: MenuItem[];
  ad_currency: string;
}) => {
  const { currency } = useAppStore();
  return (
    <div className="py-2">
      <Popup
        align="vertical"
        className="w-full"
        contentStyle="bg-gray-100"
        trigger={
          <Button className="bg-orange-500 text-background w-full">
            View price menu
          </Button>
        }
      >
        <div className="w-full min-w-64 flex flex-col gap-1">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex gap-2 bg-gray-200 rounded-lg overflow-hidden"
            >
              <div className="w-20 bg-secondary"></div>
              <div className="w-full">
                <span className="text-xs font-semibold text-accent">
                  {item.title}
                </span>
                <FixedPrice
                  price={displayCurrencyAndPrice(
                    ad_currency,
                    currency,
                    item.price
                  )}
                />
                <span className="text-xs text-gray-500 font-light">
                  {item.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Popup>
    </div>
  );
};
