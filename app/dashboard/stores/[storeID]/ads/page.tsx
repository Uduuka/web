import AdsTable from "@/components/parts/tables/AdsTable";
import {
  fetchCategories,
  fetchStoreAds,
  fetchUnits,
} from "@/lib/actions";
import React from "react";

export default async function SalesPage({
  params,
}: {
  params: Promise<{ storeID: string }>;
}) {
  const { storeID } = await params;
  const { data, error } = await fetchStoreAds(storeID);
  const categoriresPromise = fetchCategories();
  const unitsPromise = fetchUnits();

  // console.log(data);
  return (
    <div>
      <AdsTable
        data={data ?? []}
        categoriresPromise={categoriresPromise}
        unitsPromise={unitsPromise}
        empty="No ads found matching the filters applied. Add or create ads"
        showAdd
        error={error?.message}
      />
    </div>
  );
}
