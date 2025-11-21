"use client";

import { Listing } from "@/lib/types";
import { AddToCartDialogBody } from "@/app/dashboard/stores/[storeID]/pos/parts/StockTable";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

interface AddToCartButtonProps {
  ad: Listing;
}

export function AddToCartButton({ ad }: AddToCartButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openDailog = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };
  return (
    <>
      <Button
        onClick={openDailog}
        className="bg-primary text-white hover:bg-orange-400 w-full"
      >
        Add to cart
      </Button>
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
