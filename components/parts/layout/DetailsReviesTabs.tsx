"use client";

import Button from "@/components/ui/Button";
import { AdDetail, Review } from "@/lib/types";
import { useEffect, useState } from "react";

export default function DetailsReviesTabs({
  specs,
  reviews,
}: {
  specs?: object;
  reviews?: Review[];
}) {
  const [activeTab, setActiveTab] = useState("details");
  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        <Button
          onClick={() => {
            setActiveTab("details");
          }}
          className={`hover:bg-accent/80 hover:text-background w-full max-w-60 ${
            activeTab === "details"
              ? "bg-accent/80 text-background"
              : "bg-secondary text-accent "
          }`}
        >
          Specifications
        </Button>
        <Button
          onClick={() => {
            setActiveTab("reviews");
          }}
          className={`hover:bg-accent/80 hover:text-background w-full max-w-60 ${
            activeTab === "reviews"
              ? "bg-accent/80 text-background"
              : "bg-secondary text-accent "
          }`}
        >
          Reviews
        </Button>
      </div>
      {activeTab === "details" && specs && <Details specs={specs} />}

      {activeTab === "reviews" && reviews && <Reviews reviews={reviews} />}
    </div>
  );
}

const Details = ({ specs }: { specs: any }) => {
  const [details, setDetails] = useState<AdDetail[]>([]);

  useEffect(() => {
    let l: AdDetail[] = [];

    for (const key in specs) {
      l.push([key, specs[key]]);
    }

    setDetails(l);
  }, [specs]);
  return (
    <div className="bg-background rounded-lg p-5">
      <div className="flex gap-5">
        {details.map((d, i) => (
          <div key={i} className="py-3 w-fit text-xs text-center font-light">
            <p className="border-b-2 text-accent px-2 border-accent/60">
              {d[1]}
            </p>
            <p className="text-accent/80 px-2 lowercase">{d[0]}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Reviews = ({ reviews }: { reviews: Review[] }) => (
  <div className="space-y-5">
    {reviews.map((review) => (
      <div key={review.id} className="flex bg-secondary/50 rounded-lg p-5">
        <div className="h-16 w-16 rounded-full bg-white"></div>
      </div>
    ))}
  </div>
);
