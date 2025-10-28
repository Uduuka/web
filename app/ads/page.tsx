import AdsList from "@/components/parts/lists/AdsList";
import AdsListSkelton from "@/components/parts/lists/AdsListSkelton";
import { fetchAds } from "@/lib/actions";
import React, { Suspense } from "react";

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
  }>;
}) {
  const { search } = await searchParams;
  const fetchPromise = fetchAds({ search });
  return (
    <div className="py-5">
      <Suspense fallback={<AdsListSkelton />}>
        <AdsList fetchPromise={fetchPromise} />
      </Suspense>
    </div>
  );
}
