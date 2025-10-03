"use client";

import AdsTable from "@/components/parts/tables/AdsTable";
import Button from "@/components/ui/Button";
import { Listing } from "@/lib/types";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import Forms from "./Forms";

export default function StoreStock({
  data,
  error,
}: {
  data: Listing[];
  error?: string;
}) {
  const [ad, setAd] = useState<Listing>();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const rowClicked = (ad: Listing) => {
    setAd(ad);
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  return (
    <>
      <AdsTable
        data={data ?? []}
        displayColumns={["title", "price", "quantity"]}
        empty="No ads found matching the filters applied. Add or create ads"
        error={error}
        onRowSelect={rowClicked}
      />

      <dialog
        ref={dialogRef}
        className="backdrop:bg-black/75 bg-transparent w-full p-5 m-auto mt-[4.5rem] outline-none"
      >
        <div
          className={cn(
            "w-full max-w-sm bg-white shadow m-auto mt-0 rounded-lg space-y-2 h-fit min-h-40"
          )}
        >
          {ad && <AddToCartDialogBody ad={ad} />}
        </div>
      </dialog>
    </>
  );
}

export const AddToCartDialogBody = ({ ad }: { ad: Listing }) => {
  return (
    <div className="w-full">
      <div className="w-full pt-3 pb-1 px-5 flex gap-4 border-b-2 text-gray-500 border-gray-300">
        <h1 className="w-full line-clamp-1">{ad.title}</h1>
        <form method="dialog">
          <Button className="w-6 h-6 p-0 hover:bg-secondary">
            <X size={15} />
          </Button>
        </form>
      </div>
      <div className="py-3">{renderAddToCartForm(ad)}</div>
    </div>
  );
};

const renderAddToCartForm = (ad: Listing) => {
  const scheme = ad.pricings![0].scheme;
  switch (scheme) {
    case "fixed":
      return <Forms.FixedPriceForm ad={ad} />;

    case "recurring":
      return <Forms.RecurringPriceForm ad={ad} />;

    case "range":
      return <Forms.RangePriceForm ad={ad} />;

    case "menu":
      return <Forms.MenuPriceForm ad={ad} />;

    case "unit":
      return <Forms.UnitPriceForm ad={ad} />;

    default:
      return null;
  }
};
