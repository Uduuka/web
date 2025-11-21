"use client";
import React, { useEffect, useState, useTransition } from "react";
import ScrollArea from "../layout/ScrollArea";
import CartItemCard from "./CartItemCard";
import Button from "@/components/ui/Button";
import PriceTag from "./PriceTag";
import { useAppStore } from "@/lib/store";
import { calcCartItemSubTotal, pretifyMoney } from "@/lib/utils";
import { Currency, Order } from "@/lib/types";
import { fetchCurrencyRates, placeOrder } from "@/lib/actions";
import { LoaderCircle, Trash } from "lucide-react";
import MoneyInput from "../forms/MoneyInput";
import Modal from "../models/Modal";

export default function StoreCart() {
  const {
    cart: { items, total, store, clearCart },
    currency,
  } = useAppStore();

  const [received, setReceived] = useState(0);
  const [change, setChange] = useState(0);
  const [error, setError] = useState("");
  const [submitting, startSubmitting] = useTransition();
  const [cartTotal, setCartTotal] = useState(0);
  const [conversionError, setConversionError] = useState("");
  const [fetchingCurrencyRates, startFecthingRates] = useTransition();
  const [cartItems, setCartItems] = useState(items);

  useEffect(() => {
    const currencyCodes = Array.from(
      new Set<string>([
        ...items.map((item) => item.subTotal.currency),
        currency,
      ])
    );

    startFecthingRates(async () => {
      const { data, error } = await fetchCurrencyRates(
        currencyCodes as Currency[]
      );
      if (error) {
        setConversionError("Failed to fetch currency rates");
        return;
      }
      setCartItems(
        items.map((item) => {
          const fromRate =
            data.find((d) => d.code === item.subTotal.currency)?.rate ?? 1;
          const toRate = data.find((d) => d.code === currency)?.rate ?? 1;
          return {
            ...item,
            pricing: {
              currency,
              amount: item.pricing.amount * (toRate / fromRate),
              discount: item.pricing.discount
                ? item.pricing.discount * (toRate / fromRate)
                : undefined,
              flashSale: item.pricing.flashSale
                ? {
                    ...item.pricing.flashSale,
                    amount: item.pricing.flashSale.amount * (toRate / fromRate),
                  }
                : undefined,
              scheme: "fixed",
              details: item.pricing.details,
            },
            subTotal: calcCartItemSubTotal(
              {
                currency,
                amount: item.pricing.amount * (toRate / fromRate),
                discount: item.pricing.discount
                  ? item.pricing.discount * (toRate / fromRate)
                  : undefined,
                flashSale: item.pricing.flashSale
                  ? {
                      ...item.pricing.flashSale,
                      amount:
                        item.pricing.flashSale.amount * (toRate / fromRate),
                    }
                  : undefined,
                scheme: "fixed",
                details: item.pricing.details,
              },
              item.qty as number
            ),
          };
        })
      );
    });
  }, [items, currency]);

  useEffect(() => {
    if (received > total) {
      setChange(received - total);
    }
  }, [cartTotal, received]);

  useEffect(() => {
    setCartTotal(
      cartItems.map((i) => i.subTotal.amount)?.reduce((t, i) => t + i, 0)
    );
  }, [cartItems]);

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
      <div className="w-full px-5 pt-2 pb-1 border-b-2 border-gray-200">
        {store ? (
          <>
            <h1 className="text-gray-500 text-lg">{store?.name}</h1>
            <p className="text-gray-400 flex justify-between items-center">
              <span>{new Date().toDateString()}</span>
              <span>{new Date().toLocaleTimeString()}</span>
            </p>
          </>
        ) : null}
      </div>
      <ScrollArea maxHeight="100%" className="!pb-0 flex-1">
        {error && (
          <div className="p-5 w-full bg-red-50 text-error text-center">
            {error}
          </div>
        )}
        {cartItems.map((item, i) => (
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
              amount: cartTotal,
              details: {},
              scheme: "fixed",
            }}
          />
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex gap-5 px-2 w-full">
            <MoneyInput
              money={received}
              className="text-gray-600"
              setMoney={(e) => {
                setReceived(Number(e));
              }}
              label="Amount received"
              currency={currency}
            />
            <MoneyInput
              money={change}
              disabled
              className="text-gray-600"
              label="Change"
              setMoney={() => {
                setChange(change);
              }}
              currency={currency}
            />
          </div>
          <div className="flex gap-5 justify-between pb-5 px-2">
            <Modal
              trigger={
                <>
                  <Trash size={15} /> Clear
                </>
              }
              className="max-w-60"
              header={
                <span className="text-lg text-red-500">
                  Clear shopping list
                </span>
              }
              triggerStyle="bg-error text-white items-center gap-2 hover:bg-red-400"
            >
              <div className="p-5 text-red-500 text-center w-full">
                <p className="w-full">
                  Are you sure you want to clear this shopping list?
                </p>
              </div>
              <form method="dialog" className="flex gap-5 w-full px-5 pb-5">
                <Button className="w-full bg-gray-500 text-white hover:bg-gray-400">
                  No
                </Button>
                <Button
                  onClick={clearCart}
                  className="w-full bg-red-500 text-white hover:bg-red-400"
                >
                  Yes
                </Button>
              </form>
            </Modal>
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
