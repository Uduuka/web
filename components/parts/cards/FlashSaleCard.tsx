import { FlashSale, Time } from "@/lib/types";
import React, { useEffect, useState } from "react";
import PriceTag from "./PriceTag";
import { displayCurrencyAndPrice } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { IoMdFlash } from "react-icons/io";
import Link from "next/link";

export default function FlashSaleCard({ item }: { item: FlashSale }) {
  const { currency } = useAppStore();

  const calculateTimeLeft = () => {
    const end = item.start.getTime() + item.duration * 60 * 1000;
    const now = Date.now();
    const diff = Math.max(0, end - now);

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
      total: diff,
    };
  };

  const [remaining, setRemaining] = useState<Time>(calculateTimeLeft());

  useEffect(() => {
    if (remaining.total <= 0) {
      return;
    }

    const timer = setInterval(() => {
      const newTime = calculateTimeLeft();
      setRemaining(newTime);
      if (newTime.total <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  const calcSavings = () => {
    const scheme = item.ad.pricingScheme;
    if (scheme === "fixed") {
      if (!item.ad.price) {
        return;
      }
      return {
        pacentage: ((item.ad.price - item.flashPrice) / item.ad.price) * 100,
        money: item.ad.price - item.flashPrice,
      };
    }
  };
  const savings = calcSavings();
  return (
    <Link href={`/flash-sales/${item.id}`}>
      <div className="w-full max-w-96 h-40 flex rounded-lg bg-white overflow-hidden border border-orange-500 hover:shadow-lg transition-all">
        <div className="w-32 h-full bg-secondary relative"></div>
        <div className="flex-1 flex flex-col">
          <div className="h-8 flex items-center justify-center bg-orange-500">
            <p className="text-background font-bold">
              <span className="text-xs font-light pr-5">Time left:</span>
              {remaining.hours} <span className="text-xs font-light">Hrs:</span>{" "}
              {remaining.minutes}{" "}
              <span className="text-xs font-light">Mins:</span>{" "}
              {remaining.seconds} <span className="text-xs font-light">S</span>
            </p>
          </div>
          <div className="flex-1 pl-3">
            <h1 className="py-2 text-xs text-accent">{item.ad.title}</h1>
            <div className="">
              <PriceTag
                price={item.flashPrice.toString()}
                originalPrice={item.ad.price?.toString()}
                originalCurrency={item.ad.currency}
                scheme={item.ad.pricingScheme ?? ""}
              />
              {savings && (
                <p className="text-green-500 text-xs font-light">
                  Save up to{" "}
                  <span className="font-bold">
                    {displayCurrencyAndPrice(
                      item.ad.currency,
                      currency,
                      savings.money.toString()
                    )}
                  </span>{" "}
                  ({savings.pacentage}% off)
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
