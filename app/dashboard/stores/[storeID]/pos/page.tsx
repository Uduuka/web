import React from "react";
import { fetchStoreAds } from "@/lib/actions";
import StoreStock from "./parts/StockTable";
import StoreCart from "@/components/parts/cards/StoreCart";
import { Listing } from "@/lib/types";
import { notFound } from "next/navigation";

export default async function SalesPage({
  params,
}: {
  params: Promise<{ storeID: string }>;
}) {
  const { storeID } = await params;
  const { data, error } = await fetchStoreAds(storeID);

  if (!data || error) {
    return notFound()
  }

  return (
    <div className="flex gap-5 flex-col-reverse sm:flex-row md:flex-col-reverse lg:flex-row">
      <div className="w-full">
        <StoreStock data={data ?? []} />
      </div>
      <div className="w-full sm:max-w-[24rem] md:max-w-full lg:max-w-[24rem] h-[80vh] bg-white rounded-lg flex flex-col">
        <div className="w-full px-5 pt-2 pb-1 border-b-2 border-gray-200">
          <h1 className="text-gray-500 text-lg">
            {data.length > 0
              ? (data as Listing[])[0].store?.name
              : "No store name"}
          </h1>
          <p className="text-gray-400 flex justify-between items-center">
            <span>{new Date().toDateString()}</span>
            <span>{new Date().toLocaleTimeString()}</span>
          </p>
        </div>
        <StoreCart />
      </div>
    </div>
  );
}
