import AdsTable from "@/components/parts/tables/AdsTable";
import { fetchCategories, fetchPersonalAds, fetchUnits } from "@/lib/actions";
import React from "react";

export default async function AdsPage() {
  const adsPRomise = fetchPersonalAds({});
  const categoriresPromise = fetchCategories();
  const unitsPromise = fetchUnits();
  return (
    <div className="flex flex-col gap-5">
      <div className="">
        <AdsTable
          dataPromise={adsPRomise}
          categoriresPromise={categoriresPromise}
          unitsPromise={unitsPromise}
          showAdd={false}
          empty="No ads found that could match the applied filters"
        />
      </div>
    </div>
  );
}
