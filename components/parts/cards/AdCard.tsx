"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import Badge from "@/components/ui/Badge";
import PriceTag from "./PriceTag";
import { Listing } from "@/lib/types";
import { prettyDistance, toNumber } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Button from "@/components/ui/Button";
import { useContext } from "react";
import { StoreContext } from "@/contexts/store-context/StoreContext";

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
    pricings,
    isNew,
    isFeatured,
  } = ad;

  const pathname = usePathname();
  const url = image?.url ?? "/placeholder.svg";

  const { store: storeContext, loading } = useContext(StoreContext);

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
            <span className="flex gap-1 line-clamp-1 items-center text-xs text-gray-500 mt-1">
              <Star className="mr-1 h-3 w-3 fill-yellow-500 text-yellow-500" />
              <span className="text-center items-center">
                {(rating ?? 0).toFixed(1)} ({ratings})
              </span>
            </span>
          </div>
          <div className="pt-2 px-3">
            {pricings && pricings.length > 1 ? (
              <div className="flex flex-wrap items-center space-x-4">
                <PriceTag
                  pricing={pricings[0]}
                  className="w-fit hover:underline"
                />

                <PriceTag
                  pricing={pricings[1]}
                  className="w-fit hover:underline"
                />
                {pricings.length > 2 && (
                  <Button className="p-1 text-xs px-2 ml-auto bg-primary text-background w-fit">
                    + {pricings.length - 2} more
                  </Button>
                )}
              </div>
            ) : (
              <PriceTag pricing={pricing} />
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

            {storeContext ? (
              <>
                {loading ? (
                  <div className="flex gap-1 animate-pulse">
                    <div className="w-full bg-gray-500"></div>
                    <div className="w-full bg-gray-500"></div>
                  </div>
                ) : (
                  <>
                    {storeContext.is_member && (
                      <div className="flex space-x-1 w-full pt-3">
                        <Button className="bg-primary hover:bg-primary/80 text-xs px-1 line-clamp-1 py-1 w-full text-background">
                          Place oreder
                        </Button>
                        <Button className="bg-transparent border border-primary text-xs px-1 line-clamp-1 py-1 w-full text-primary hover:bg-primary hover:text-background">
                          Add to cart
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                {store && (
                  <Link
                    href={`/stores/${store.id}`}
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
