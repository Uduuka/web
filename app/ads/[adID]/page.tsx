import OpenChat from "@/components/parts/buttons/OpenChat";
import PriceMenuItem from "@/components/parts/cards/PriceMenuItem";
import PriceTag from "@/components/parts/cards/PriceTag";
import Carousel from "@/components/parts/layout/Carousel";
import DetailsReviesTabs from "@/components/parts/layout/DetailsReviesTabs";
import Distance from "@/components/parts/maps/Distance";
import Button from "@/components/ui/Button";
import { fetchAd, getProfile, getUser } from "@/lib/actions";
import { Listing, PriceMenu, Pricing } from "@/lib/types";
import { notFound } from "next/navigation";
import { RxShare1 } from "react-icons/rx";
import { SlDislike, SlLike } from "react-icons/sl";
import { VscFeedback } from "react-icons/vsc";

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

  const { pricings, seller_id } = ad;

  const userData = await getUser();
  const sellerProfile = await getProfile(ad.seller_id);
  const isSeller = userData.data?.user?.id === seller_id;

  if (error || !pricings || !ad) {
    return notFound();
  }
  const pricingScheme = pricings[0].scheme;
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
          pricings[0].scheme === "menu" ? "sm:row-span-2 h-full" : ""
        }`}
      >
        <h1 className="text-accent text-2xl font-bold">{ad?.title}</h1>
        <p className="text-accent/90">{ad?.description}</p>

        <div className="flex-1">
          <h1 className="text-accent font-bold text-lg pb-2 capitalize">
            Pricing: {pricingScheme} price
          </h1>
          {pricingScheme === "menu" ? (
            <PriceBoard pricing={pricings[0]} />
          ) : (
            <div className="space-y-2">
              {ad.pricings?.map((pricing, index) => (
                <div
                  className="flex group items-center justify-between gap-5 bg-orange-50 px-5 py-2 rounded-md"
                  key={index}
                >
                  <PriceTag className="" pricing={pricing} />
                  <Button className="bg-primary hidden group-hover:block transition-transform text-xs hover:bg-primary/90 text-background">
                    Add to cart
                  </Button>
                </div>
              ))}
            </div>
          )}
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

      <div className="bg-white flex-1 p-5 rounded-lg col-span-4 sm:col-span-2">
        <h1 className="text-accent border-b ">Seller details</h1>
        <div className="flex-1 flex flex-col h-full py-5 ">
          <h1 className="text-accent/80 pb-2">
            {sellerProfile.data.full_names}
          </h1>
          <p className="text-accent/60 text-xs">{sellerProfile.data.about}</p>
          {!isSeller && userData.data.user && (
            <div className="flex gap-5 py-4">
              <Button
                disabled={isSeller}
                className="bg-secondary w-full hover:bg-secondary/90 text-xs"
              >
                Show contacts
              </Button>
              <OpenChat
                ad={{ ...ad, seller: sellerProfile.data }}
                seller={ad.seller_id}
                buyer={userData.data.user?.id}
                isSeller={isSeller}
              />
            </div>
          )}
          <div className="flex-1"></div>
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

      <div className="col-span-4 bg-white p-5 rounded-lg">
        <DetailsReviesTabs specs={ad.specs} reviews={ad.reviews} />
      </div>
    </div>
  );
}

const PriceBoard = ({ pricing }: { pricing: Pricing<PriceMenu> }) => {
  const items = pricing.details.items;

  return (
    <div className="w-full flex flex-col gap-2">
      {items.map((item, index) => (
        <PriceMenuItem item={item} currency={pricing.currency} key={index} />
      ))}
    </div>
  );
};
