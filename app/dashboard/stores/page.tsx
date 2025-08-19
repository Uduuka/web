import StoreList from "@/components/parts/lists/StoreList";
import CreateStore from "@/components/parts/sidePanels/CreateStore";
import { fetchPersonalStores } from "@/lib/actions";
import { Info } from "lucide-react";
import React from "react";

export default async function page() {
  const { data, error } = await fetchPersonalStores();

  if (error || !data) {
    return (
      <div className="bg-red-50 p-10 rounded-lg max-w-md text-error">
        <p className="text-center">
          An error occured while fetching your stores.
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-5">
      <div className="p-10 rounded-lg bg-white text-accent flex-1">
        {data.length ? (
          <StoreList
            stores={data}
            nextUrl="/dashboard/stores"
            className="w-full grid sm:grid-cols-2 gap-5"
          />
        ) : (
          <div className="flex max-w-md mx-auto gap-3">
            <Info className="h-10 w-20 opacity-65" />
            <p className="font-light text-gray-500">
              Stores help to organise your ads, manage your stcok and so much
              more. Create at least one store to start selling your products and
              services.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
