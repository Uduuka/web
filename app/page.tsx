import AdsList from "@/components/parts/lists/AdsList";
import FlashSales from "@/components/parts/lists/FlashSales";
import StoreList from "@/components/parts/lists/StoreList";
import { fetchStores } from "@/lib/actions";

export default async function Home() {
  const { data: stores } = await fetchStores();
  return (
    <div className="w-full">
      <FlashSales orientation="horizontal" className="grid gap-5 grid-cols-3" />
      <StoreList
        stores={stores ?? []}
        nextUrl="/stores"
        title="Stores Near You"
        orientation="horizontal"
        className="grid gap-5 grid-cols-3"
      />
      <div className="space-y-3">
        <h1 className="text-lg px-5 font-bold">Trending ads</h1>
        <AdsList
          emptyMessage="No ads found"
          errorMessage="Failed to load trending ads"
        />
      </div>
    </div>
  );
}
