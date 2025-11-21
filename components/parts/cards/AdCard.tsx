"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import PriceTag from "./PriceTag";
import { Listing } from "@/lib/types";
import { prettyDistance, toNumber } from "@/lib/utils";
import { useParams, usePathname } from "next/navigation";
import Button from "@/components/ui/Button";
import { AddToCartButton } from "../buttons/AddToCartButton";
import { Timer } from "./FlashSaleCard";

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
    store,
    pricings,
    isNew,
    isFeatured,
  } = ad;
  const pathname = usePathname();
  const storeID = useParams()["storeID"];
  const url = image?.url ?? "/placeholder.svg";

  const flashPricings = pricings?.filter((p) => p.flashSale !== null) ?? [];
  const minPrice = Math.min(...flashPricings.map((p) => p.amount));
  const pricing = flashPricings.find((p) => {
    return Number(p.amount) === Number(minPrice);
  });

  return (
    <div className="bg-white border border-gray-300 rounded-md overflow-hidden transition-all hover:shadow-lg">
      <div className="p-0">
        <Link
          href={pathname === "/map" ? `/map/${id}` : `/ads/${id}`}
          className="block"
        >
          <div className="relative bg-secondary h-fit w-full overflow-hidden">
            <Image
              src={url}
              alt={title}
              height={1000}
              width={1000}
              className="w-full h-auto object-cover transition-transform hover:scale-105"
            />
            {flashPricings.length > 0 && (
              <Timer
                upto={pricing?.flashSale?.expires_at ?? ""}
                className="absolute top-0 left-0"
              />
            )}
          </div>
          <div className="p-3 pb-0">
            <h3 className="line-clamp-2 text-xs font-light">{title}</h3>
            <span className="flex gap-1 line-clamp-1 items-center text-xs text-gray-500 mt-1">
              <Star className="mr-1 h-3 w-3 fill-yellow-500 text-yellow-500" />
              <span className="text-center items-center">
                {(rating ?? 0).toFixed(1)} ({ratings})
              </span>
            </span>
          </div>
          <div className="pt-2 px-3">
            {pricings && pricings.length > 0 ? (
              <RenderPricings pricings={pricings} />
            ) : (
              <p>No pricing</p>
            )}
          </div>
        </Link>
        <div className="px-3">
          <div className="py-3 text-xs text-accent/90 gap-1 flex flex-wrap items-center">
            {distance && (
              <Link href={`/map/${ad.id}`} className="w-fit flex-1">
                <Button className="gap-1 rounded w-full hover:bg-accent/20">
                  <MapPin size={15} />
                  <span className="text-xs line-clamp-1">
                    {prettyDistance(toNumber(distance))}
                  </span>
                </Button>
              </Link>
            )}

            {store && (
              <>
                {storeID ? (
                  pricings?.[0] ? (
                    <AddToCartButton ad={ad} />
                  ) : null
                ) : (
                  <Link
                    href={`/stores/${store?.id}`}
                    className="w-fit"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button className="w-full px-4 text-gray-600 rounded hover:bg-gray-300">
                      Visit store
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const RenderPricings = ({
  pricings,
}: {
  pricings: Listing["pricings"];
}) => {
  if (!pricings || pricings.length === 0)
    return <p className="text-gray-400">No pricing</p>;
  if (pricings.length === 1) {
    return <PriceTag pricing={pricings[0]} className="w-fit" />;
  }

  // console.log(pricings);
  const minPrice = Math.min(...pricings.map((p) => p.amount));
  const pricing = pricings.find((p) => {
    return Number(p.amount) === Number(minPrice);
  });
  return <PriceTag pricing={pricing!} className="w-fit" from />;
};
