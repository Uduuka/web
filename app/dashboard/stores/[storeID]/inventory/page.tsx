import AdsTable from "@/components/parts/tables/AdsTable";
import { fetchCategories, fetchStoreAds, fetchUnits } from "@/lib/actions";
import React, { Suspense } from "react";

export default async function SalesPage() {
  const dataPromise = fetchStoreAds();
  const categoriresPromise = fetchCategories();
  const unitsPromise = fetchUnits();

  return (
    <Suspense fallback={<div>Loading ads...</div>}>
      <AdsTable
        dataPromise={dataPromise}
        categoriresPromise={categoriresPromise}
        unitsPromise={unitsPromise}
        empty="No ads found matching the filters applied. Add or create ads"
        showAdd
      />
    </Suspense>
  );
}
