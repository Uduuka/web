import AdsList from "@/components/parts/lists/AdsList";
import FlashSales from "@/components/parts/lists/FlashSales";
import StoreList from "@/components/parts/lists/StoreList";

export default async function Home() {
  return (
    <div className="w-full">
      <FlashSales
        title="Quick deals"
        orientation="horizontal"
        className="grid gap-5 grid-cols-3"
      />
      <StoreList
        title="Popular Stores Near You"
        orientation="horizontal"
        className="grid gap-5 grid-cols-3"
      />
      <AdsList title="Trending ads" />
    </div>
  );
}
