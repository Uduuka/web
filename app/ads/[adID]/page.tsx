import PriceTag from "@/components/parts/cards/PriceTag";
import Carousel from "@/components/parts/layout/Carousel";
import DetailsReviesTabs from "@/components/parts/layout/DetailsReviesTabs";
import Button from "@/components/ui/Button";
import { ads } from "@/lib/dev_db/db";
import { RxShare1 } from "react-icons/rx";
import { SlDislike, SlLike } from "react-icons/sl";
import { VscFeedback } from "react-icons/vsc";

export default async function AdDetailsPage({
  params,
}: {
  params: Promise<{ adID: string }>;
}) {
  const { adID } = await params;

  const ad = ads.find((ad) => ad.id === adID);
  return (
    <div className="grid grid-cols-4 p-5 gap-5">
      <div className="p-5 bg-white rounded-lg col-span-4">
        <h1 className="text-accent/90">{ad?.title}</h1>
        <p className="text-accent/60">{ad?.description}</p>
      </div>
      <Carousel
        className="h-96 bg-white col-span-2"
        alt=""
        images={[
          "/images/image-1.jpg",
          "/images/image-2.jpg",
          "/images/image-3.jpg",
          "/images/image-4.jpg",
          "/images/image-5.jpg",
        ]}
      />
      <div className="col-span-2 flex flex-col gap-5">
        <div className="h-fit bg-white p-5 rounded-lg flex flex-col gap-5">
          <h1 className="text-accent/80 border-b pb-2 capitalize">
            Pricing: {ad?.pricingScheme} price
          </h1>
          <div className="flex items-center gap-5">
            <div className="w-full">
              <PriceTag
                scheme={ad?.pricingScheme!}
                price={ad?.price?.toString()}
                originalCurrency={ad?.currency!}
                period={ad?.period}
                minPrice={ad?.minPrice?.toString()}
                maxPrice={ad?.maxPrice?.toString()}
                menuItems={ad?.priceMenu}
                originalPrice={ad?.originalPrice?.toString()}
                className="w-full"
              />
            </div>
            <Button className="bg-primary/80 h-fit hover:bg-primary text-background w-full">
              Add to cart
            </Button>
          </div>
        </div>
        <div className="bg-white flex-1 p-5 rounded-lg flex items-center">
          <div className="h-full w-32 rounded bg-background"></div>
          <div className="flex-1 flex flex-col h-full pl-5">
            <h1 className="text-accent/80 pb-2"> Egessa David Wafula</h1>
            <p className="text-accent/60 text-xs">
              Quick and exellent deals in electronics, tvs, appliances and
              electrical installation. We serve as you deserve
            </p>
            <div className="flex gap-5 py-4">
              <Button className="bg-secondary w-full hover:bg-secondary/90 text-xs">
                Show contacts
              </Button>
              <Button className="bg-accent w-full hover:bg-accent/90 text-background">
                Open live chat
              </Button>
            </div>
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
      </div>
      <div className="col-span-4 bg-white p-5 rounded-lg">
        <DetailsReviesTabs />
      </div>
    </div>
  );
}
