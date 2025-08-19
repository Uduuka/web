import AdsList from "@/components/parts/lists/AdsList";
import { fetchStoreData } from "@/lib/actions";
import { notFound } from "next/navigation";
import React from "react";

export default async function StorePage({ params }: { params: any }) {
  const storeID = (await params)["storeID"];
  const { data: store } = await fetchStoreData(storeID);

  if (!store) {
    return notFound();
  }

  return (
    <div className="">
      <div className="p-5">
        <div className="bg-white p-5 rounded-lg">
          <h1 className="text-base font-bold w-full flex justify-between">
            {store.name} | Listings ({store.ads} ads)
          </h1>
        </div>
      </div>
      <AdsList
        errorMessage={`Failed to fetch ads in ${store.name}. Please try again later.`}
        emptyMessage={`No ads found in ${store.name} that match the applied filters. Try adjusting your filters and try again.`}
      />
    </div>
  );
}
