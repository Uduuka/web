"use client";
import React, { useEffect, useState } from "react";
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

export default function StoreCart() {
  const {
    cart: { items, total, store },
    currency,
    user,
  } = useAppStore();

  const [received, setReceived] = useState(0);
  const [change, setChange] = useState(0);

  useEffect(() => {
    if (received > total) {
      setChange(received - total);
    }
  }, [total, received]);

  const handleSubmit = async () => {
    const order: Order = {
      p_desired_currency: currency,
      p_method: "cash",
      p_received: received,
      p_order_items: items.map((o) => ({
        pricing_id: o.pricing.id!,
        quantity: Number(o.qty),
        units: o.units,
      })),
      p_store_id: store?.id!,
      p_amount: Number(pretifyMoney(total, currency)),
      p_type: "local",
    };

    const { data, error } = await placeOrder(order);

    console.log({ data, error });
  };

  return (
    <>
      <ScrollArea maxHeight="100%" className="!pb-0 flex-1">
        {items.map((item, i) => (
          <CartItemCard item={item} key={i} />
        ))}
      </ScrollArea>

      <div className="bg-orange-50">
        <div className="flex justify-end px-5 py-2 gap-5 items-center text-primary">
          <span className="text-2xl font-bold">Total:</span>
          <PriceTag
            className="text-2xl"
            pricing={{
              currency,
              details: { price: total },
              scheme: "fixed",
            }}
          />
        </div>

        <div className="space-y-5">
          <div className="flex gap-5 px-5">
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
          <div className="flex gap-5 justify-between py-3 px-5 border-t border-primary ">
            <Button
              onClick={handleSubmit}
              className="bg-primary text-lg font-bold w-full text-background hover:bg-orange-400"
            >
              Make a sale
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
