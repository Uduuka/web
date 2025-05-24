"use client";

import Button from "@/components/ui/Button";
import { AdDetail, Review } from "@/lib/types";
import { useState } from "react";

export default function DetailsReviesTabs() {
  const [activeTab, setActiveTab] = useState("details");
  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        <Button
          onClick={() => {
            setActiveTab("details");
          }}
          className={`hover:bg-accent/80 hover:text-background min-w-60 ${
            activeTab === "details"
              ? "bg-accent/80 text-background"
              : "bg-secondary text-accent "
          }`}
        >
          Details
        </Button>
        <Button
          onClick={() => {
            setActiveTab("reviews");
          }}
          className={`hover:bg-accent/80 hover:text-background min-w-60 ${
            activeTab === "reviews"
              ? "bg-accent/80 text-background"
              : "bg-secondary text-accent "
          }`}
        >
          Reviews
        </Button>
      </div>
      {activeTab === "details" && (
        <Details
          details={[
            ["brand", "Nokia"],
            ["ram", "4GB"],
            ["rom", "128GB"],
            ["screen", `2.5"`],
          ]}
        />
      )}

      {activeTab === "reviews" && (
        <Reviews
          reviews={[
            {
              id: "1",
              ad_id: "2",
              reviewer: { id: "46", email: "", phone: "", avarta: "" },
              message: "A verry good product",
              replies: [
                {
                  id: "35",
                  review_id: "1",
                  replier_id: "67",
                  message: "Thanks for the appreciation",
                },
              ],
            },
            {
              id: "2",
              ad_id: "2",
              reviewer: { id: "46", email: "", phone: "", avarta: "" },
              message: "A verry good product",
              replies: [
                {
                  id: "35",
                  review_id: "1",
                  replier_id: "67",
                  message: "Thanks for the appreciation",
                },
              ],
            },
            {
              id: "3",
              ad_id: "2",
              reviewer: { id: "46", email: "", phone: "", avarta: "" },
              message: "A verry good product",
              replies: [
                {
                  id: "35",
                  review_id: "1",
                  replier_id: "67",
                  message: "Thanks for the appreciation",
                },
              ],
            },
          ]}
        />
      )}
    </div>
  );
}

const Details = ({ details }: { details: AdDetail[] }) => (
  <div className="bg-background rounded-lg p-5">
    <h1 className="text-accent border-b w-full">Ad specifications</h1>
    <div className="flex gap-5">
      {details.map((d, i) => (
        <div key={i} className="py-3 w-fit text-xs text-center font-light">
          <p className="border-b-2 text-accent px-2 border-accent/60">{d[1]}</p>
          <p className="text-accent/80 px-2 lowercase">{d[0]}</p>
        </div>
      ))}
    </div>
  </div>
);

const Reviews = ({ reviews }: { reviews: Review[] }) => (
  <div className="space-y-5">
    {reviews.map((review) => (
      <div key={review.id} className="flex bg-secondary/50 rounded-lg p-5">
        <div className="h-16 w-16 rounded-full bg-white"></div>
      </div>
    ))}
  </div>
);
