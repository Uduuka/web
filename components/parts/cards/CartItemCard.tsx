import React, { useEffect, useState, useTransition } from "react";
import PriceTag from "./PriceTag";
import Button from "@/components/ui/Button";
import { Minus, Plus, Trash } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { calcCartItemSubTotal, forex, toNumber } from "@/lib/utils";
import { CartItem } from "@/lib/types";

export default function CartItemCard({ item }: { item: CartItem }) {
  const {
    cart: { deleteItem, updateItem },
    currency,
  } = useAppStore();

  const [specs, setSpecs] = useState<{ key: string; value: any }[]>([]);

  const [updatingPrice, startUpdatingPrice] = useTransition();

  useEffect(() => {
    if (!item.specs) {
      return;
    }
    // const { quantity, units, ...options } = item.specs;
    const spcs = Object.entries(item.specs).map((e) => ({
      key: e[0],
      value: e[1],
    }));
    setSpecs(spcs);
  }, [item.specs]);

  useEffect(() => {
    startUpdatingPrice(async () => {
      const exchangedPricing = (await forex([item.pricing], currency))[0];
      updateItem?.({
        ...item,
        pricing: exchangedPricing,
        subTotal: calcCartItemSubTotal(exchangedPricing, Number(item.qty)),
      });
    });
  }, [currency]);

  const increamentItemQuantity = () => {
    let qty = toNumber(`${item.qty}`);
    if (qty < toNumber(`${item.aqty}`)) {
      qty = qty + 1;
    }

    updateItem?.({
      ...item,
      subTotal: calcCartItemSubTotal(item.pricing, qty),
      qty,
    });
  };

  const decreamentItemQuantity = () => {
    let qty = toNumber(`${item.qty}`);
    if (qty > 1) {
      qty = qty - 1;
    }

    updateItem?.({
      ...item,
      subTotal: calcCartItemSubTotal(item.pricing, qty),
      qty,
    });
  };
  return (
    <div className="hover:bg-gray-50 p-3 group rounded-lg cursor-pointer">
      <div className="flex">
        <div className="px-2 w-full">
          <p className="font-bold text-gray-500">{item.ad.title}</p>
          <p className="text-gray-400 line-clamp-1 text-xs ">
            {item.ad.description}
          </p>
          <div className="flex flex-wrap gap-2 items-center text-gray-500 text-xs border-t pt-1 mt-1 border-gray-200">
            <PriceTag
              className="font-normal text-xs text-gray-500 pr-0"
              pricing={item.pricing}
            />
            <div className="flex gap-2 text-xs">
              |<span className="text-xs">shipping:</span>
              <PriceTag
                className="text-xs text-gray-500 font-normal"
                pricing={{
                  currency: "UGX",
                  details: { price: 4500 },
                  scheme: "fixed",
                }}
              />
            </div>
            <div className="flex gap-2 items-center">
              {item.qty ? (
                <>
                  |
                  <div className="flex gap-2 capitalize">
                    {String(item.qty).length < 2
                      ? `0${item.qty} ${
                          item.period
                            ? `${item.period}s`
                            : item?.units ?? "units"
                        }`
                      : `${item.qty} ${
                          item.period
                            ? `${item.period}s`
                            : item?.units ?? "units"
                        }`}
                  </div>
                </>
              ) : null}
            </div>
            {specs.map((s, i) => (
              <div key={i} className="flex gap-2 items-center">
                |
                <div className="flex gap-2 items-center">
                  <span>
                    {s.key}
                    {s.value.length > 1 ? "s" : ""}:{" "}
                  </span>
                  {s.value.length ? (
                    <>
                      {(s.value as any[]).map((v, i) => (
                        <span
                          key={i}
                          className="bg-gray-100 px-2 py-0.5 rounded line-clamp-1"
                        >
                          {v}
                        </span>
                      ))}
                    </>
                  ) : (
                    <span>{s.value}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2"></div>
        </div>
        <div className="w-8 border-l border-gray-200 justify-center items-center opacity-0 group-hover:opacity-100 flex flex-col">
          <Button
            disabled={!item.qty}
            onClick={increamentItemQuantity}
            className="p-1 bg-transparent hover:bg-primary hover:text-background text-primary"
          >
            <Plus size={15} />
          </Button>
          <Button
            disabled={!item.qty}
            onClick={decreamentItemQuantity}
            className="p-1 bg-transparent hover:bg-primary hover:text-background text-primary"
          >
            <Minus size={15} />
          </Button>
          <Button
            onClick={() => {
              deleteItem?.(item);
            }}
            className="p-1 bg-transparent hover:bg-red-500 text-error hover:text-background"
          >
            <Trash size={15} />
          </Button>
        </div>
      </div>

      <div className="w-full flex gap-2 items-center justify-end px-2 pt-1 text-gray-500 border-t mt-2 border-gray-200">
        <div className="self-end flex gap-2 items-center">
          <span className="text-xs text-gray-400">Sub-total:</span>
          {updatingPrice ? (
            <span className="bg-gray-200 animate-pulse w-24 h-5 rounded-lg "></span>
          ) : (
            <PriceTag pricing={item.subTotal} />
          )}
        </div>
      </div>
    </div>
  );
}
