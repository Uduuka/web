import StoreList from "@/components/parts/lists/StoreList";
import CreateStore from "@/components/parts/sidePanels/CreateStore";
import { stores } from "@/lib/dev_db/db";
import React from "react";

export default function page() {
  return (
    <div className="">
      <div className="p-5">
        <div className="p-5 bg-white rounded-lg flex justify-between">
          <h1 className="text-accent">My stores</h1>
          <div className="w-fit">
            <CreateStore />
          </div>
        </div>
      </div>
      {stores.length ? (
        <StoreList
          stores={stores}
          nextUrl="/dashboard/stores"
          className="w-full grid grid-cols-2 gap-5"
        />
      ) : (
        <>
          <p className="text-xs font-light text-center">
            Store help to organise your ads. Create at least one store to start
            selling your products and services.
          </p>
        </>
      )}
    </div>
  );
}
