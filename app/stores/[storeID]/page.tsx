import AdsList from "@/components/parts/lists/AdsList";
import { fetchAds, fetchStoreData } from "@/lib/actions";
import { notFound } from "next/navigation";
import React from "react";

export default async function StorePage({
  params,
  searchParams,
}: {
  params: Promise<{ storeID: string }>;
  searchParams: Promise<{ search?: string }>;
}) {
  const { storeID } = await params;
  const { search } = await searchParams;
  const { data: store } = await fetchStoreData(storeID);

  if (!store) {
    return notFound();
  }

  const fetchPromise = fetchAds({ search, storeID });
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
        fetchPromise={fetchPromise}
        errorMessage={`Failed to fetch ads in ${store.name}. Please try again later.`}
        emptyMessage={`No ads found in ${store.name} that match the applied filters. Try adjusting your filters and try again.`}
      />
    </div>
  );
}
