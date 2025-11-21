import React from "react";
import { fetchStoreAds } from "@/lib/actions";
import StoreStock from "./parts/StockTable";
import StoreCart from "@/components/parts/cards/StoreCart";

export default function SalesPage() {
  const dataPromise = fetchStoreAds();

  return (
    <div className="flex gap-5 flex-col-reverse sm:flex-row md:flex-col-reverse lg:flex-row">
      <div className="w-full">
        <StoreStock dataPromise={dataPromise} />
      </div>
      <div className="w-full sm:max-w-[24rem] md:max-w-full lg:max-w-[24rem] h-[80vh] bg-white rounded-lg flex flex-col">
        <StoreCart />
      </div>
    </div>
  );
}
