import AdsTable from "@/components/parts/tables/AdsTable";
import { fetchStoreAds } from "@/lib/actions";
import React from "react";

export default async function SalesPage({
  params,
}: {
  params: Promise<{ storeID: string }>;
}) {
  const { storeID } = await params;
  const { data, error } = await fetchStoreAds(storeID);

  return (
    <div>
      <AdsTable
        data={data ?? []}
        empty="No ads found matching the filters applied. Add or create ads"
        showAdd
        error={error?.message}
      />
    </div>
  );
}
