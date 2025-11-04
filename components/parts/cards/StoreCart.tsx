"use client";
import React, { useEffect, useState, useTransition } from "react";
import ScrollArea from "../layout/ScrollArea";
import CartItemCard from "./CartItemCard";
import Button from "@/components/ui/Button";
import PriceTag from "./PriceTag";
import { useAppStore } from "@/lib/store";
import { pretifyMoney, toMoney } from "@/lib/utils";
import FormGroup from "@/components/ui/FormGroup";
import FormInput from "@/components/ui/Input";
import { Order } from "@/lib/types";
import { placeOrder } from "@/lib/actions";
import { LoaderCircle } from "lucide-react";

export default function StoreCart() {
  const {
    cart: { items, total, store, clearCart },
    currency,
  } = useAppStore();

  const [received, setReceived] = useState(0);
  const [change, setChange] = useState(0);
  const [error, setError] = useState("");
  const [submitting, startSubmitting] = useTransition();

  useEffect(() => {
    if (received > total) {
      setChange(received - total);
    }
  }, [total, received]);

  const handleSubmit = () => {
    startSubmitting(async () => {
      if (!store) {
        setError("The store is undefined.");
        return;
      }
      const order: Order = {
        p_desired_currency: currency,
        p_method: "cash",
        p_received: received,
        p_order_items: items.map((o) => ({
          pricing_id: o.pricing.id!,
          quantity: Number(o.qty),
          units: o.units,
          specs: o.specs,
        })),
        p_status: "completed",
        p_store_id: store.id,
        p_amount: Number(pretifyMoney(total, currency)),
        p_type: "local",
      };

      const { error } = await placeOrder(order);
      if (error) {
        setError(error.message);
        return;
      }
      clearCart?.();
      setError("");
      setReceived(0);
      setChange(0);
    });
  };

  return (
    <>
      <ScrollArea maxHeight="100%" className="!pb-0 flex-1">
        {error && (
          // <div className="px-5 pt-2">
          <div className="p-5 w-full bg-red-50 text-error text-center">
            {error}
          </div>
          // </div>
        )}
        {items.map((item, i) => (
          <CartItemCard item={item} key={i} />
        ))}
      </ScrollArea>

      <div className="bg-orange-50">
        <div className="flex justify-end px-2 py-1 gap-5 items-center text-primary border-b">
          <span className="text-xl font-bold">Total:</span>
          <PriceTag
            className="text-xl font-bold"
            pricing={{
              currency,
              amount: total,
              details: {},
              scheme: "fixed",
            }}
          />
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex gap-5 px-2">
            <FormGroup label="Amount received" className="text-primary">
              <FormInput
                wrapperStyle="border-primary bg-white"
                value={toMoney(received.toString())}
                onChange={(e) => {
                  setReceived(Number(e.target.value.replace(",", "")));
                }}
                icon={<span className="px-2">{currency}</span>}
              />
            </FormGroup>
            <FormGroup label="Change" className="text-primary">
              <FormInput
                wrapperStyle="border-primary text-white bg-primary"
                disabled
                value={toMoney(change.toString())}
                onChange={() => {}}
                icon={<span className="px-2">{currency}</span>}
              />
            </FormGroup>
          </div>
          <div className="flex gap-5 justify-between pb-5 px-2">
            <Button
              onClick={handleSubmit}
              className="bg-primary text-lg font-bold w-full text-background hover:bg-orange-400"
            >
              {submitting ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                "Make a sale"
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
