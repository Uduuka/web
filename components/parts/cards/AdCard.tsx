"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import Badge from "@/components/ui/Badge";
import PriceTag from "./PriceTag";
import { Listing } from "@/lib/types";

interface ListingCardProps {
  ad: Listing;
}

export default function AdCard({ ad }: ListingCardProps) {
  const {
    id,
    title,
    image,
    price,
    minPrice,
    maxPrice,
    originalPrice,
    pricingScheme,
    currency,
    rating,
    ratings,
    store,
    isNew = false,
    units,
    period,
    isFeatured = false,
    priceMenu,
  } = ad;

  // Calculate distance if user location is available and coordinates are provided
  const distance = "5KM form you!";

  const handleClick = () => {
    // Record this item as viewed
  };

  return (
    <div className="bg-white border border-gray-300 rounded-md transition-all hover:shadow-lg">
      <div className="p-0">
        <Link href={`/ads/${id}`} className="block" onClick={handleClick}>
          <div className="relative bg-secondary h-fit w-full overflow-hidden">
            {image ? (
              <Image
                src={image || "/placeholder.svg"}
                alt={title}
                height={100}
                width={100}
                className="w-full h-auto transition-transform hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                No image
              </div>
            )}
            {isNew && <Badge className="absolute left-2 top-2">New</Badge>}
            {isFeatured && (
              <Badge variant="secondary" className="absolute right-2 top-2">
                Featured
              </Badge>
            )}
          </div>
          <div className="p-3 pb-0">
            <h3 className="line-clamp-2 text-xs font-light">{title}</h3>
          </div>
        </Link>
        <div className="px-3">
          <div className="pt-2">
            <PriceTag
              className=""
              price={price?.toString()}
              minPrice={minPrice?.toString()}
              maxPrice={maxPrice?.toString()}
              originalCurrency={currency}
              originalPrice={originalPrice?.toString()}
              scheme={pricingScheme ?? ""}
              units={units}
              period={period}
              menuItems={priceMenu}
            />
          </div>
          <div className="flex flex-wrap gap-2 pt-2 items-center text-gray-500 justify-between text-xs text-muted-foreground">
            <Link
              href={`/stores/${store?.id}`}
              className="hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {store?.name}
            </Link>
            <div className="flex gap-1 items-center">
              <MapPin size={15} />
              <span className="text-xs">{distance}</span>
            </div>
          </div>
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center text-xs text-muted-foreground">
              <Star className="mr-1 h-3 w-3 fill-yellow-500 text-yellow-500" />
              <span>{rating?.toFixed(1)}</span>
              <span className="ml-1">({ratings} ratings)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
