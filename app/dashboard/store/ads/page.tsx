import CreateAd from "@/components/parts/sidePanels/CreateAd";
import AdsTable from "@/components/parts/tables/AdsTable";
import React from "react";

export default function AdsPage() {
  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="p-5 bg-white rounded-lg flex justify-between">
        <h1 className="text-accent">My ads</h1>
        <div className="w-fit">
          <CreateAd />
        </div>
      </div>
      <div className="p-5 bg-white rounded-lg">
        <AdsTable />
      </div>
    </div>
  );
}
