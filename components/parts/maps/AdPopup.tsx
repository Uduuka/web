"use client";

import Image from "next/image";
import Link from "next/link";
import { Listing, Location } from "@/lib/types";
import PriceTag from "../cards/PriceTag";
import Button from "@/components/ui/Button";

interface ListingCardProps {
  ad: Listing;
  single?: boolean;
}

export default function AdPopup({ ad, single }: ListingCardProps) {
  const { id, title, image, pricing, distance } = ad;
  const handleClick = () => {
    // Record this item as viewed
  };

  const ad_pricing =
    typeof pricing === "string" ? JSON.parse(pricing) : pricing;
  const url =
    (typeof image === "string" ? JSON.parse(image) : image)?.url ??
    "/placeholder.svg";
  return (
    <div className="rounded-md w-40 overflow-hidden transition-all">
      <div className="p-0">
        <div className="relative bg-secondary h-fit w-full overflow-hidden">
          <Image
            src={url}
            alt={title}
            height={100}
            width={100}
            className="w-full h-auto transition-transform hover:scale-105"
          />
        </div>
        <div className="py-3 pb-0">
          <h3 className="line-clamp-2 text-xs font-light">{title}</h3>
        </div>

        {/* <div className="pt-2">
          {ad_pricing?.scheme !== "menu" && <PriceTag pricing={ad_pricing} />}
        </div> */}

        <div className="">
          <p className="text-xs font-thin">{distance} Km</p>
        </div>

        <div className="flex gap-2 pt-2">
          {!single && (
            <Link
              onClick={handleClick}
              href={`/map/${id}`}
              className="block w-full outline-0 focus:outline-0"
            >
              <Button className="w-full  outline-0 focus:outline-0">
                Direction
              </Button>
            </Link>
          )}
          <Link
            onClick={handleClick}
            href={`/ads/${id}`}
            className="block w-full outline-0 focus:outline-0"
          >
            <Button className="w-full outline-0 focus:outline-0">
              Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
