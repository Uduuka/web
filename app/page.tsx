import AdsList from "@/components/parts/lists/AdsList";
import FlashSales from "@/components/parts/lists/FlashSales";
import StoreList from "@/components/parts/lists/StoreList";
import { stores } from "@/lib/dev_db/db";

export default async function Home() {
  return (
    <div className="w-full">
      <FlashSales
        title="Quick deals"
        orientation="horizontal"
        className="grid gap-5 grid-cols-3"
      />
      <StoreList
        stores={stores}
        nextUrl="/stores"
        title="Popular Stores Near You"
        orientation="horizontal"
        className="grid gap-5 grid-cols-3"
      />
      <AdsList title="Trending ads" />
    </div>
  );
}
