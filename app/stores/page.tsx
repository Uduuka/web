import StoreList from "@/components/parts/lists/StoreList";
import { stores } from "@/lib/dev_db/db";
import React from "react";

export default function StoresListPage() {
  return (
    <StoreList
      stores={stores}
      nextUrl="/stores"
      orientation="vertical"
      className="grid gap-5 grid-cols-3"
    />
  );
}
