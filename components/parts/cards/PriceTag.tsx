"use client";
import env from "@/lib/env";
import { useAppStore } from "@/lib/store";
import { Pricing, RecurringPrice, UnitPrice } from "@/lib/types";
import { cn, toMoney } from "@/lib/utils";
import React, { ComponentProps } from "react";
import { Timer } from "./FlashSaleCard";

type PriceTagProps<T> = ComponentProps<"div"> & {
  pricing: Pricing<T>;
  loading?: boolean;
  from?: boolean;
};

export default function PriceTag({
  pricing,
  className,
  from,
  loading,
}: PriceTagProps<any>) {
  if (!pricing) {
    return null;
  }
  let { scheme, details, discount, amount, flashSale } = {
    ...pricing,
    amount: pricing.conversion_rate
      ? pricing.amount * pricing.conversion_rate
      : pricing.amount,
    discount: pricing.conversion_rate
      ? pricing.discount
        ? pricing.discount * pricing.conversion_rate
        : 0
      : pricing.discount,
    flashSale: pricing.flashSale
      ? {
          ...pricing.flashSale,
          amount: pricing.flashSale.amount
            ? pricing.conversion_rate
              ? pricing.flashSale.amount * pricing.conversion_rate
              : pricing.flashSale.amount
            : 0,
        }
      : undefined,
  };

  const discountedAmount =
    flashSale && flashSale.amount > 0
      ? flashSale.amount
      : discount && discount > 0
      ? amount - discount
      : 0;
  return (
    <span className={cn("text-primary flex flex-col w-full", className)}>
      {discountedAmount && discountedAmount > 0 ? (
        <span className="flex flex-wrap items-center w-full text-gray-500 text-xs">
          {from && <span className="text-xs line-through pr-1">From</span>}
          <Money amount={amount} crossed loading={loading} className="pr-2" />
          <span className="pr-2">
            {(((amount - discountedAmount) / amount) * 100).toFixed(1)}% off
          </span>
          {flashSale && flashSale.expires_at && (
            <span>
              <Timer
                upto={flashSale.expires_at}
                className="bg-transparent text-primary px-0"
              />
            </span>
          )}
        </span>
      ) : null}
      <span className="w-full flex font-bold gap-1 items-center">
        {from && <span className="text-xs">From</span>}
        <Money
          loading={loading}
          amount={discountedAmount > 0 ? discountedAmount : amount}
        />
        {scheme === "unit" && (details as UnitPrice).units ? (
          <span className="text-xs flex items-center gap-2">
            {" "}
            per {(details as UnitPrice).units}
          </span>
        ) : scheme === "recurring" && (details as RecurringPrice).period ? (
          <span className="text-xs capitalize flex flex-wrap items-center gap-2">
            per {(details as RecurringPrice).period}
          </span>
        ) : null}
      </span>
    </span>
  );
}

export const Money = ({
  amount,
  crossed,
  className,
  loading,
}: {
  amount: number;
  crossed?: boolean;
  className?: string;
  loading?: boolean;
}) => {
  const { currency } = useAppStore();
  return (
    <span
      className={cn(`flex gap-2 w-fit ${crossed && "line-through"}`, className)}
    >
      {currency}{" "}
      {loading ? (
        <span className="w-24 h-4 bg-gray-300 animate-pulse rounded mb-1"></span>
      ) : (
        toMoney(
          Number(amount)?.toFixed(
            env.currencies.find((c: any) => c.code === currency)
              ?.decimal_places || 2
          )
        )
      )}
    </span>
  );
};
