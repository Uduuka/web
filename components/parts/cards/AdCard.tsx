"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import Badge from "@/components/ui/Badge";
import PriceTag from "./PriceTag";
import { Listing, Pricing } from "@/lib/types";
import { prettyDistance, toNumber } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Button from "@/components/ui/Button";

interface ListingCardProps {
  ad: Listing;
}

export default function AdCard({ ad }: ListingCardProps) {
  const {
    id,
    title,
    image,
    rating,
    ratings,
    distance,
    pricing,
    store,
    views,
    isNew,
    isFeatured,
  } = ad;

  const handleClick = () => {
    // Record this item as viewed
  };

  const pathname = usePathname();

  const url = image?.url ?? "/placeholder.svg";
  return (
    <div className="bg-white border border-gray-300 rounded-md overflow-hidden transition-all hover:shadow-lg">
      <div className="p-0">
        <Link
          href={pathname === "/map" ? `/map/${id}` : `/ads/${id}`}
          className="block"
          onClick={handleClick}
        >
          <div className="relative bg-secondary h-fit w-full overflow-hidden">
            <Image
              src={url}
              alt={title}
              height={100}
              width={100}
              className="w-full h-auto transition-transform hover:scale-105"
            />

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
            <PriceTag pricing={pricing} />
          </div>
          <div className="py-3 text-xs text-accent/90 space-y-1">
            {distance && (
              <Link href={`/map/${ad.id}`}>
                <Button className="gap-1 mb-1 w-full hover:bg-accent/20">
                  <MapPin size={15} />
                  <span className="text-xs line-clamp-1">
                    {prettyDistance(toNumber(distance))}
                  </span>
                </Button>
              </Link>
            )}
            <div className="flex gap-2 pt-2 items-center">
              <span className="flex gap-1 line-clamp-1">
                <Star className="mr-1 h-3 w-3 fill-yellow-500 text-yellow-500" />
                <span>{(rating ?? 0).toFixed(1)}</span>
              </span>
              <span className="line-clamp-1">{ratings} ratings</span>
              <span className="line-clamp-1">{views} views</span>
            </div>
            {store && (
              <Link
                href={`/stores/${store?.id}`}
                className="hover:underline text-xs text-accent/90 line-clamp-1"
                onClick={(e) => e.stopPropagation()}
              >
                {store?.name}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
