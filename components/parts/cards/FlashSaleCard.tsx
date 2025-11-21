import { FlashSale, Time } from "@/lib/types";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { RenderPricings } from "./AdCard";
import { cn } from "@/lib/utils";

export default function FlashSaleCard({ item }: { item: FlashSale }) {
  return (
    <div className="border overflow-hidden rounded-lg relative border-orange-500 hover:shadow-lg text-gray-600 transition-all">
      <Link href={`/ads/${item.id}`}>
        <div className="p-0 h-32 flex">
          <Image
            height={100}
            width={100}
            alt="ad image"
            src={item.image?.url ?? "/placeholder.svg"}
            className="h-full w-auto rounded-l-lg"
          />
          <div className="p-2 w-40 h-full flex flex-col">
            <div className="flex-1">
              <h1 className="font-bold">{item.title}</h1>
              <p className="text-xs">{item.description}</p>
            </div>
            <div className="w-full">
              <RenderPricings pricings={item.pricings} />
            </div>
          </div>
          <Timer
            upto={item.pricings![0].flashSale!.expires_at}
            className="absolute top-0 left-0"
          />
        </div>
      </Link>
    </div>
  );
}

export const Timer = ({
  upto,
  className,
}: {
  upto: string;
  className?: string;
}) => {
  const [time, setTime] = useState<{
    hours: string;
    minutes: string;
    seconds: string;
  }>();
  const calculateTimeLeft = () => {
    const end = new Date(upto).getTime();
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

  useEffect(() => {
    setInterval(() => {
      const { hours, minutes, seconds } = calculateTimeLeft();
      setTime({ hours, minutes, seconds });
    }, 1000);

    return clearInterval(1000);
  }, []);
  return (
    <p
      className={cn(
        "p-2 w-20 py-1 bg-primary/80 text-xs text-white font-bold",
        className
      )}
    >
      {time?.hours ?? "00"} : {time?.minutes ?? "00"} : {time?.seconds ?? "00"}
    </p>
  );
};
