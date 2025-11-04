"use client";
import env from "@/lib/env";
import { useAppStore } from "@/lib/store";
import { Pricing, RecurringPrice, UnitPrice } from "@/lib/types";
import { cn, toMoney } from "@/lib/utils";
import React, { ComponentProps } from "react";

type PriceTagProps<T> = ComponentProps<"div"> & {
  pricing: Pricing<T>;
  loading?: boolean;
};

export default function PriceTag({
  pricing,
  className,
  loading,
}: PriceTagProps<any>) {
  if (!pricing) {
    return null;
  }
  const { scheme, details, discount, amount } = pricing;
  return (
    <span className={cn("text-primary flex gap-2 items-center", className)}>
      {discount && discount > 0 && (
        <Money amount={amount} crossed loading={loading} />
      )}
      <Money loading={loading} amount={amount - (discount ?? 0)} />
      {scheme === "unit" && (details as UnitPrice).units ? (
        <span className="text-xs flex items-center gap-2">
          {" "}
          per{" "}
          {(details as UnitPrice).units.slice(
            0,
            (details?.units?.length ?? 1) - 1
          )}
        </span>
      ) : scheme === "recurring" && (details as RecurringPrice).period ? (
        <span className="text-xs capitalize flex flex-wrap items-center gap-2">
          per {(details as RecurringPrice).period}
        </span>
      ) : null}
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
        <span className="w-24 h-6 bg-gray-300 animate-pulse rounded-lg"></span>
      ) : (
        toMoney(amount.toFixed(env.currencies[currency]?.decimal_digits))
      )}
    </span>
  );
};
