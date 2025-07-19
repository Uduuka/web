import AdsList from "@/components/parts/lists/AdsList";
import React, { Suspense } from "react";

export default async function ListingsPage() {
  return (
    <div className="">
      <Suspense>
        <AdsList />
      </Suspense>
    </div>
  );
}
