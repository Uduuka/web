import AdsTable from "@/components/parts/tables/AdsTable";
import { fetchPersonalAds } from "@/lib/actions";
import React from "react";

export default async function AdsPage() {
  const { error, data } = await fetchPersonalAds({});
  return (
    <div className="flex flex-col gap-5">
      <div className="">
        <AdsTable
          data={data ?? []}
          error={error?.message}
          showAdd={false}
          empty="No ads found that could match the applied filters"
        />
      </div>
    </div>
  );
}
