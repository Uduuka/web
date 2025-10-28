import AdsList from "@/components/parts/lists/AdsList";
import AdsListSkelton from "@/components/parts/lists/AdsListSkelton";
import FlashSales from "@/components/parts/lists/FlashSales";
import StoreList from "@/components/parts/lists/StoreList";
import { fetchAds, fetchFlashsales, fetchStores } from "@/lib/actions";
import { Suspense } from "react";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
  }>;
}) {
  const { search } = await searchParams;

  const adsFetchPromise = fetchAds({ search });
  const storesFetchPromise = fetchStores();
  const flashSalesFetchPromise = fetchFlashsales();
  return (
    <div className="w-full">
      <FlashSales
        fetchPromise={flashSalesFetchPromise}
        orientation="horizontal"
        className="grid gap-5 grid-cols-3"
      />
      <StoreList
        fetchPromise={storesFetchPromise}
        nextUrl="/stores"
        title="Stores Near You"
        orientation="horizontal"
        className="grid gap-5 grid-cols-3"
      />
      <div className="space-y-3">
        <h1 className="text-lg px-5 font-bold">Trending ads</h1>
        <Suspense fallback={<AdsListSkelton />}>
          <AdsList
            fetchPromise={adsFetchPromise}
            emptyMessage="No ads found"
            errorMessage="Failed to load trending ads"
          />
        </Suspense>
      </div>
    </div>
  );
}
