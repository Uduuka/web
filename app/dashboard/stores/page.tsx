import StoreList from "@/components/parts/lists/StoreList";
import { fetchPersonalStores } from "@/lib/actions";
import React from "react";

export default async function page() {
  const fetchPromise = fetchPersonalStores();
  return (
    <div className="space-y-5">
      <div className="p-10 rounded-lg bg-white text-accent flex-1">
        <StoreList
          fetchPromise={fetchPromise}
          nextUrl="/dashboard/stores"
          className="w-full grid sm:grid-cols-2 gap-5"
        />
      </div>
    </div>
  );
}
