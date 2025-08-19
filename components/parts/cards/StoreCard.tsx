import { Store } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ShoppingBag, Star } from "lucide-react";
import Link from "next/link";
import React, { ComponentProps } from "react";

type StoreCardProps = ComponentProps<"div"> & {
  store: Store;
  nextUrl: string;
};

export default function StoreCard({
  store,
  className,
  nextUrl,
  ...props
}: StoreCardProps) {
  return (
    <Link href={`${nextUrl}/${store.id}`}>
      <div
        className={cn(
          "w-full border bg-white border-secondary flex flex-col rounded-lg h-40 overflow-hidden hover:shadow-lg transition-all  ",
          className
        )}
        {...props}
      >
        <div className="flex gap-2 flex-1 px-3 py-2 items-center">
          <div className="rounded-full h-20 w-20 bg-secondary"></div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="">
              <h1 className="text-gray-600 font-semibold line-clamp-1">
                {store.name}
              </h1>
              <p className="text-xs text-gray-500 line-clamp-2">
                {store.description}
              </p>
            </div>
            <div className="flex gap-3 justify-between pt-2">
              <p className="flex text-xs text-gray-500 gap-1 items-center">
                <Star className="text-yellow-300 fill-yellow-300" size={15} />
                <span>4.5 (83)</span>
              </p>
            </div>
          </div>
        </div>
        <div className="h-10 bg-secondary px-3 py-2 flex items-center">
          <ShoppingBag className="mr-1 h-3.5 w-3.5" />
          <p className="text-xs pl-2 mt-0.5">{store.ads} Ads</p>
        </div>
      </div>
    </Link>
  );
}
