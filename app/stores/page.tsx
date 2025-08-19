import StoreCard from "@/components/parts/cards/StoreCard";
import { fetchStores } from "@/lib/actions";

import React from "react";

export default async function StoresListPage() {
  const { error, data } = await fetchStores();
  if (error) {
    console.error("Error fetching stores:", error);
    return <div>Error loading stores.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 p-5 gap-5">
      {data?.map((store: any) => (
        <StoreCard nextUrl="/stores" key={store.id} store={store} />
      ))}
      {data.length === 0 && (
        <div className="text-center">No stores available.</div>
      )}
    </div>
  );
}
