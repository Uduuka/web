import AdCardSkelton from "@/components/skeltons/AdCardSkelton";
import React from "react";

export default function AdsListSkelton() {
  return (
    <div className="px-5 pb-5">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12]?.map((i) => (
          <AdCardSkelton key={i} />
        ))}
      </div>
    </div>
  );
}
