import OpenChat from "@/components/parts/buttons/OpenChat";
import Carousel from "@/components/parts/layout/Carousel";
import DetailsReviesTabs from "@/components/parts/layout/DetailsReviesTabs";
import Distance from "@/components/parts/maps/Distance";
import Button from "@/components/ui/Button";
import { fetchAd, fetchMessages, getProfile, getUser } from "@/lib/actions";
import { Listing } from "@/lib/types";
import { notFound } from "next/navigation";
import { RxShare1 } from "react-icons/rx";
import { SlDislike, SlLike } from "react-icons/sl";
import { VscFeedback } from "react-icons/vsc";
import PriceBoard from "./(pricing)/Pricing";
import { Store } from "lucide-react";
import Link from "next/link";
import SellerCard from "./(pricing)/SellerCard";

export default async function AdDetailsPage({
  params,
}: {
  params: Promise<{ adID: string }>;
}) {
  const { adID } = await params;

  if (!adID || typeof adID !== "string") {
    return notFound();
  }
  const { error, data } = await fetchAd(adID);
  const ad = data as Listing;

  const { pricings, seller_id, store } = ad;

  const userPromise = getProfile();
  const sellerPromise = getProfile(seller_id);
  const messagesPromise = fetchMessages(seller_id);

  if (error || !pricings || !ad) {
    return notFound();
  }
  const pricingScheme = pricings?.[0]?.scheme;
  return (
    <div className="grid grid-cols-4 p-5 gap-5">
      <div
        className={`bg-white p-5 justify-center items-center rounded-lg overflow-hidden col-span-4 sm:col-span-2 ${
          pricingScheme === "menu" ? "" : "sm:row-span-2"
        }`}
      >
        <Carousel
          className="h-96"
          alt=""
          images={ad.images?.map((img) => img.url) ?? []}
        />
      </div>

      <div
        className={`h-fit bg-white p-5 rounded-lg flex flex-col gap-2 col-span-4 sm:col-span-2 ${
          pricingScheme === "menu" || pricingScheme === "range"
            ? "sm:row-span-2 h-full"
            : ""
        }`}
      >
        {store && (
          <div className="w-full flex gap-2 justify-end items-center">
            <Link
              href={`/stores/${store.id}`}
              className="w-fit flex gap-2 items-center text-primary"
            >
              <Store />
              {store.name}
            </Link>
          </div>
        )}
        <h1 className="text-accent text-2xl font-bold">{ad?.title}</h1>
        <p className="text-accent/90">{ad?.description}</p>

        <div className="flex-1">
          <h1 className="text-accent font-bold text-lg pb-2 capitalize">
            Pricing: {pricingScheme} price
          </h1>
          {ad.pricings && ad.pricings.length > 0 && <PriceBoard ad={ad} />}
        </div>

        <div className="flex justify-between items-center">
          <Distance
            destination={ad.location.coordinates}
            href={`/map/${ad.id}`}
          />
          <div className="flex gap-2 justify-end">
            <Button className="bg-transparent hover:bg-accent/50 text-accent/80 hover:text-background  h-6 w-6 p-0 rounded-sm">
              <RxShare1 size={18} />
            </Button>{" "}
            <Button className="bg-transparent hover:bg-accent/50 text-accent/80 hover:text-background  h-6 w-6 p-0 rounded-sm">
              <SlLike size={18} />
            </Button>{" "}
            <Button className="bg-transparent hover:bg-accent/50 text-accent/80 hover:text-background  h-6 w-6 p-0 rounded-sm">
              <SlDislike size={18} />
            </Button>{" "}
            <Button className="bg-transparent hover:bg-accent/50 text-accent/80 hover:text-background  h-6 w-6 p-0 rounded-sm">
              <VscFeedback size={18} />
            </Button>
          </div>
        </div>
      </div>

      {/* Seller card */}
      <SellerCard
        userPromise={userPromise}
        sellerPromise={sellerPromise}
        messagesPromise={messagesPromise}
      />
      <div className="col-span-4 bg-white p-5 rounded-lg">
        <DetailsReviesTabs specs={ad.specs} reviews={ad.reviews} />
      </div>
    </div>
  );
}
