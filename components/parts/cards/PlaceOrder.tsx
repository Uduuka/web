"use client";

import { useAppStore } from "@/lib/store";
import { pretifyMoney, toMoney } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import FormGroup from "@/components/ui/FormGroup";
import FormInput from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Order } from "@/lib/types";
import { placeOrder } from "@/lib/actions";

export function PlaceOrder() {
  const {
    cart: { items, store, total },
    currency,
    user,
  } = useAppStore();

  const [payementError, setPayementError] = useState("");
  const [number, setNumber] = useState("");
  const method = useSearchParams().get("method") as "cash" | "mtn" | "airtel";

  const handleSubmit = async () => {
    const order: Order = {
      p_desired_currency: currency,
      p_method: method,
      p_order_items: items.map((o) => ({
        pricing_id: o.pricing.id!,
        quantity: Number(o.qty),
        units: o.units,
      })),
      p_store_id: store?.id!,
      p_buyer_id: user?.id,
      p_phone: number,
      p_amount: Number(pretifyMoney(total, currency)),
      p_type: "remote",
    };

    console.log(order);

    const { data, error } = await placeOrder(order);
    console.log({ data, error });
    if (error) {
      setPayementError(error.message);
    }
  };

  return (
    <>
      <p className="text-gray-500">
        Thank you for shopping with {store?.name}. Please select a payement
        option and pay{" "}
        <span className="font-bold">
          {currency} {toMoney(total.toString(), currency)}
        </span>{" "}
        to place your order.
      </p>

      <div className="p-5 text-center space-y-5 border-2 transition-all duration-500 rounded-lg border-primary w-full mx-auto mt-5">
        <h1 className="text-xl font-bold">Select a payement method</h1>
        <div className="flex gap-5 justify-center items-center">
          <div className="flex flex-col gap-1">
            <Link
              href={`?method=mtn`}
              className="p-0 shadow hover:shadow-2xl transition-all duration-500 rounded-lg overflow-hidden"
            >
              <Image
                height={100}
                width={100}
                src="/logos/mtn.jpg"
                alt="MTN"
                className="w-full max-w-20 h-auto hover:scale-110 transition-all duration-500"
              />
            </Link>
            <div
              className={`h-1 bg-amber-400 rounded transition-all duration-500 w-0 ${
                method === "mtn" ? "w-full" : "w-0"
              }`}
            ></div>
          </div>
          <h1 className="text-xl font-bold">Or</h1>
          <div className="flex flex-col gap-1">
            <Link
              href={`?method=airtel`}
              className="p-0 shadow hover:shadow-2xl transition-all duration-500 rounded-lg overflow-hidden"
            >
              <Image
                height={100}
                width={100}
                src="/logos/airtel.jpg"
                alt="Airtel"
                className="w-full max-w-20 h-auto hover:scale-110 transition-all duration-500"
              />
            </Link>
            <div
              className={`h-1 bg-red-600 rounded transition-all duration-500 w-0 ${
                method === "airtel" ? "w-full" : "w-0"
              }`}
            ></div>
          </div>
        </div>
        <form action={handleSubmit}>
          {payementError && (
            <div className="bg-red-50 px-4 py-2 rounded-lg text-error text-center">
              {payementError}
            </div>
          )}
          <div className="space-y-4 max-w-sm mx-auto">
            <FormGroup label="Ammount" className="text-left">
              <FormInput
                className=""
                disabled
                value={toMoney(total.toString(), currency)}
                icon={<span className="px-2">Ugx</span>}
                onChange={() => {}}
                wrapperStyle="border-2"
              />
            </FormGroup>
            <FormGroup label="Mobile number" className="text-left">
              <FormInput
                className=""
                value={number}
                disabled={!Boolean(method)}
                type="number"
                onChange={(e) => setNumber(e.target.value)}
                wrapperStyle="border-2"
                placeholder={
                  method
                    ? `Enter an ${method} number`
                    : "Select a payement method"
                }
              />
            </FormGroup>
          </div>
          <div className="flex gap-5 pt-5 justify-center">
            <Button
              type="submit"
              disabled={!number || number.length < 10}
              className="bg-primary w-full max-w-sm mx-auto text-background shadow disabled:opacity-20"
            >
              Pay now
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
