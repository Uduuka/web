import ErrorCard from "@/components/parts/cards/ErrorCard";
import AdsList from "@/components/parts/lists/AdsList";
import Button from "@/components/ui/Button";
import { stores } from "@/lib/dev_db/db";
import React from "react";

export default async function StorePage({ params }: { params: any }) {
  const storeID = (await params)["storeID"];
  const store = stores.find((store) => store.id === storeID);
  if (!store) {
    return (
      <div className="p-5 flex justify-center items-center min-h-96">
        <ErrorCard
          className="max-w-60 mx-auto"
          title="Unknown store"
          error="Unknown store selected"
        >
          <Button className="bg-red-50 text-accent mx-auto my-3">
            Clear filters
          </Button>
        </ErrorCard>
      </div>
    );
  }
  return (
    <div className="">
      <h1 className="pt-5 px-5 text-base font-bold w-full flex justify-between">
        Ads in {store.name}
      </h1>
      <AdsList />
    </div>
  );
}
