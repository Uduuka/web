import { FlashSale, Time } from "@/lib/types";
import React, { useEffect, useMemo, useState } from "react";
import PriceTag, { Money } from "./PriceTag";
import Link from "next/link";
import Image from "next/image";

export default function FlashSaleCard({ item }: { item: FlashSale }) {
  const calculateTimeLeft = () => {
    const end = new Date(item.start).getTime() + item.duration * 60 * 1000;
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

  const savings = useMemo(() => {
    console.log({ item });
    const scheme = item.ad.pricing.scheme;
    if (scheme === "fixed") {
      const { price, initialPrice } = item.pricing.details;
      if (!price) {
        return;
      }
      const money = Number(initialPrice) - Number(price);
      return {
        pacentage: ((money / Number(initialPrice)) * 100).toFixed(0),
        money,
      };
    }
  }, []);

  return (
    <Link href={`/flash-sales/${item.id}`}>
      <div className="w-full max-w-96 h-40 flex rounded-lg bg-white overflow-hidden border border-orange-500 hover:shadow-lg transition-all">
        <div className="h-full bg-secondary flex items-center justify-center relative">
          {item.ad.images && (
            <Image
              src={item.ad.images[0].url || "/placeholder.svg"}
              alt={item.ad.title}
              height={100}
              width={100}
              className="w-full bg-cover object-cover transition-transform hover:scale-105"
            />
          )}
        </div>
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
              <PriceTag pricing={item.pricing} />
              {savings && (
                <p className="text-green-500 text-xs flex gap-2 font-thin">
                  Save up to{" "}
                  <span className="font-bold">
                    <Money
                      price={savings.money.toString()}
                      defaultCurrency={item.ad.pricing.currency}
                    />
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
