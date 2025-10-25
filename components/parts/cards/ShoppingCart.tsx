"use client";
import React, { useEffect, useState } from "react";
import ScrollArea from "../layout/ScrollArea";
import CartItemCard from "./CartItemCard";
import { Info } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import PriceTag from "./PriceTag";
import { useAppStore } from "@/lib/store";
import { groupBy, toNumber } from "@/lib/utils";
import { CartItem } from "@/lib/types";

export default function ShoppingCart({
  mode = "dropdown",
  successMessage,
}: {
  mode?: "dropdown" | "page";
  successMessage?: string;
}) {
  const {
    cart: { items, clearCart, store },
    currency,
  } = useAppStore();
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    const subTotals = items.map((item) =>
      toNumber(item.subTotal.details.price)
    );

    setCartTotal(subTotals?.reduce((t, i) => t + i, 0));
  }, [items]);

  return (
    <>
      {store && (
        <div className="w-full px-5 pt-2 pb-1 border-b-2 border-gray-200">
          <h1 className="text-gray-500 text-lg">
            {store ? store?.name : "No store name"}
          </h1>
          <p className="text-gray-400 flex justify-between items-center">
            <span>{new Date().toDateString()}</span>
            <span>{new Date().toLocaleTimeString()}</span>
          </p>
        </div>
      )}
      <ScrollArea maxHeight="100%" className="!pb-0 flex-1">
        {items.length > 0 ? (
          items.map((item, i) => <CartItemCard item={item} key={i} />)
        ) : successMessage ? (
          <div className="w-full text-center">
            <p className="text-center text-gray-400 p-5">{successMessage}</p>
          </div>
        ) : (
          <p className="text-center text-gray-400 p-5">
            Your cart is empty. Continue shopping to addd items and later
            proceed to pay.
          </p>
        )}
      </ScrollArea>
      {items.length > 0 && (
        <div className="bg-orange-50">
          <div className="flex justify-end px-5 py-2 gap-5 items-center text-primary">
            <span className="text-2xl font-bold">Total:</span>
            <PriceTag
              className="text-2xl"
              pricing={{
                currency,
                details: { price: cartTotal },
                scheme: "fixed",
              }}
            />
          </div>
          {items.length > 0 && mode === "dropdown" && (
            <div className="flex gap-5 justify-between py-3 px-5 border-t border-primary ">
              <Button
                onClick={() => clearCart?.()}
                className="bg-transparent close w-full text-error border-error border hover:text-background hover:bg-error text-xs"
              >
                Clear cart
              </Button>
              <Link href="/order" className="w-full block mx-auto">
                <Button className="bg-primary close w-full text-background hover:bg-orange-400 text-xs">
                  Place order
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}
