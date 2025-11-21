"use client";

import { AddToCartButton } from "@/components/parts/buttons/AddToCartButton";
import PriceTag from "@/components/parts/cards/PriceTag";
import { useAppStore } from "@/lib/store";
import { Listing, PriceMenu, Pricing } from "@/lib/types";
import { cn, forex } from "@/lib/utils";

import Image from "next/image";
import { useEffect, useState, useTransition } from "react";

const PriceBoard = ({ ad }: { ad: Listing }) => {
  const [pricings, setPricngs] = useState(ad.pricings || []);
  const [fetchingRates, startFetchingRates] = useTransition();
  const { currency } = useAppStore();

  useEffect(() => {
    startFetchingRates(async () => {
      const convertedPricings = await forex(ad.pricings ?? [], currency);
      setPricngs(convertedPricings ?? []);
    });
  }, [currency, ad.pricings]);

  if (!ad.pricings || ad.pricings.length === 0) {
    return null;
  }
  return (
    <div className="space-y-2">
      {pricings.map((pricing, index) => (
        <div
          className="flex group items-center justify-between gap-5 bg-orange-50 p-2 pr-0 rounded-md"
          key={index}
        >
          {pricing.scheme === "menu" ? (
            <MenuItem item={pricing} loading={fetchingRates} />
          ) : (
            <div className="w-full">
              {pricing.details.specs && (
                <div className="flex flex-wrap gap-2 w-full text-gray-500 text-xs mb-2">
                  {Array.from(Object.entries(pricing.details.specs || {})).map(
                    ([key, value]) => (
                      <span
                        key={key}
                        className="text-xs capitalize even:border-x even:px-2 last:border-r-0 font-thin"
                      >
                        {key}: {value as string}
                      </span>
                    )
                  )}
                </div>
              )}
              <PriceTag
                className=""
                pricing={pricing}
                loading={fetchingRates}
              />
            </div>
          )}
        </div>
      ))}
      {ad.store_id && (
        <div className="w-full flex justify-end mt-2">
          <AddToCartButton ad={ad} />
        </div>
      )}
    </div>
  );
};

export const MenuItem = ({
  item,
  loading,
  className,
}: {
  item: Pricing<PriceMenu>;
  loading?: boolean;
  className?: string;
}) => {
  const { title, description, image } = item.details;
  return (
    <div className={cn("w-full flex", className)}>
      {image && <Image src={image} alt={title} height={100} width={100} />}
      <div className="w-full">
        <h1 className="text-gray-500 font-bold">{title}</h1>
        <p className="text-gray-500 text-xs">{description}</p>
        <PriceTag className="" pricing={item} loading={loading} />
      </div>
    </div>
  );
};

export default PriceBoard;
