"use client";

import Select from "@/components/ui/Select";
import { setCookie } from "@/lib/actions";
import env from "@/lib/env";
import { useAppStore } from "@/lib/store";
import { Currency } from "@/lib/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

export default function CurrencyButton() {
  const { currency, setCurrency } = useAppStore();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  
  const handleCurrencyChange = async (c: Currency) => {
    await setCookie("currency", c);
    setCurrency(c as Currency);
    localStorage.setItem("currency", c);
    const code = env.currencies[c]?.code ?? "UGX";
    const queryString = [
      ...Array.from(searchParams)
        .map(([key, value]) => (key === "currency" ? "" : `${key}=${value}`))
        .filter((s) => s.length > 3),
      `currency=${code}`,
    ].join("&");
    router.push(`${pathname}?${queryString}`);
  };

  useEffect(() => {
    const c = localStorage.getItem("currency");
    if (c) {
      setCookie("currency", c ?? "UGX");
      setCurrency(c as Currency);
    }
  }, []);
  return (
    <Select
      options={env.currencyOptions as { label: string; value: Currency }[]}
      className="bg-background text-primary text-xs"
      triggerStyle="text-sm py-1 gap-1 flex"
      value={currency}
      onChange={handleCurrencyChange}
      placeholder="Currency"
    />
  );
}
