"use client";

import { MenuItem } from "@/app/ads/[adID]/(pricing)/Pricing";
import PriceTag from "@/components/parts/cards/PriceTag";
import ScrollArea from "@/components/parts/layout/ScrollArea";
import Button from "@/components/ui/Button";
import FormGroup from "@/components/ui/FormGroup";
import FormInput from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { useAppStore } from "@/lib/store";
import {
  CartItem,
  Listing,
  PriceMenu,
  PriceRange,
  Pricing,
  Store,
  UnitPrice,
} from "@/lib/types";
import { calcCartItemSubTotal, toNumber } from "@/lib/utils";
import _ from "lodash";
import { Info, Minus, Plus } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";

const FixedPriceForm = ({ ad }: { ad: Listing }) => {
  const pricing = ad.pricings![0];
  const {
    cart: { items, addItem, updateItem, store },
  } = useAppStore();
  const [cartItem, setCartItem] = useState<CartItem>(() => {
    return {
      aqty: ad.quantity ?? 1,
      ad: { id: ad.id, title: ad.title, description: ad.description ?? "" },
      units: pricing.details?.units,
      sn: ad.id,
      pricing,
      store: ad.store ?? ({} as Store),
      specs: {},
      qty: 1.0,
      subTotal: calcCartItemSubTotal(pricing, 1),
    } as CartItem;
  });
  const handleChangeQuantity = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value <= Number(`${ad.quantity ?? 1}`)) {
      setCartItem({ ...cartItem, qty: Number(e.target.value) });
    }
  };

  const handleAddToCart = () => {
    if (!ad.store) {
      alert("The ad does not belong to any specified store.");
      return;
    }

    if ((cartItem.qty as number) > (ad.quantity ?? 1)) {
      alert(
        `You can only add up to ${ad.quantity ?? 1} ${ad.units ?? "unit"}.`
      );
    }

    if (Number(cartItem.qty as number) <= 0) {
      alert(`Quantity must be greater than 0.`);
      return;
    }

    const old = items.find((i) => i.sn === cartItem.sn);
    const subTotal = calcCartItemSubTotal(
      cartItem.pricing,
      Number(cartItem.qty)
    );

    if (Boolean(old)) {
      updateItem?.({ ...old, ...{ ...cartItem }, subTotal });
      return;
    }
    addItem?.({
      ...cartItem,
      pricing,
      subTotal,
      store: ad.store,
      id: items.length + 1,
    });
  };

  return (
    <div className="w-full">
      <ScrollArea maxHeight="65vh" className="space-y-5 px-5 pb-0 w-full">
        <PriceTag pricing={pricing} className="text-base" />
        {ad.quantity && (
          <FormGroup
            label={`Quantity (Available: ${ad.quantity ?? 1} ${
              ad.units ?? "unit"
            })`}
            className="bg-white rounded-lg"
          >
            <div className="flex gap-3 items-center">
              <FormInput
                type="text"
                className="border border-secondary text-lg font-bold text-primary w-20"
                wrapperStyle="border-none w-fit mx-auto"
                value={(cartItem.qty as number) ?? "1"}
                onChange={handleChangeQuantity}
                actionBtn={
                  <span className="flex gap-3 p-2">
                    <Button
                      className="text-xs p-1 hover:bg-gray-300"
                      onClick={() => {
                        if ((cartItem.qty as number) < (ad.quantity ?? 1)) {
                          setCartItem({
                            ...cartItem,
                            qty: (cartItem.qty as number) + 1,
                          });
                        }
                      }}
                    >
                      <Plus size={15} />
                    </Button>
                    <Button
                      className="text-xs p-1 hover:bg-gray-300"
                      onClick={() => {
                        if ((cartItem.qty as number) > 1) {
                          setCartItem({
                            ...cartItem,
                            qty: (cartItem.qty as number) - 1,
                          });
                        }
                      }}
                    >
                      <Minus size={15} />
                    </Button>
                  </span>
                }
              />
            </div>
          </FormGroup>
        )}
        <form
          method="dialog"
          className="flex gap-5 w-full justify-between items-center pt-3"
        >
          <Button className="w-full bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-background">
            Cancel
          </Button>
          <Button
            onClick={handleAddToCart}
            className="w-full bg-transparent border border-green-500 text-green-500 hover:bg-green-500 hover:text-background"
          >
            Add to cart
          </Button>
        </form>
      </ScrollArea>
    </div>
  );
};

const RecurringPriceForm = ({ ad }: { ad: Listing }) => {
  const pricing = ad.pricings![0];
  const {
    cart: { items, addItem, updateItem },
  } = useAppStore();
  const [cartItem, setCartItem] = useState<CartItem>(() => {
    return {
      aqty: pricing.details.max_period ?? 12,
      ad: { id: ad.id, title: ad.title, description: ad.description ?? "" },
      units: pricing.details?.units,
      sn: ad.id,
      period: pricing.details.period,
      pricing,
      store: ad.store ?? ({} as Store),
      specs: {},
      qty: 1.0,
      subTotal: calcCartItemSubTotal(pricing, 1),
    } as CartItem;
  });
  const handleChangeQuantity = (e: ChangeEvent<HTMLInputElement>) => {
    const value = toNumber(e.target.value);
    if (value <= toNumber(`${pricing.details.max_period ?? 12}`)) {
      setCartItem({ ...cartItem, qty: toNumber(e.target.value) });
    }
  };

  const handleAddToCart = () => {
    if (!ad.store) {
      alert("The ad does not belong to any specified store.");
      return;
    }

    if ((cartItem.qty as number) > (pricing.details.max_perios ?? 12)) {
      alert(
        `You can only add up to ${pricing.details.max_perios ?? 12} ${
          ad.units ?? "unit"
        }.`
      );
    }

    if (Number(cartItem.qty as number) <= 0) {
      alert(`Quantity must be greater than 0.`);
      return;
    }
    const old = items.find((i) => i.sn === cartItem.sn);
    if (Boolean(old)) {
      updateItem?.({
        ...old,
        ...{
          ...cartItem,
          pricing,
          subTotal: calcCartItemSubTotal(pricing, Number(cartItem.qty)),
        },
      });
      return;
    }
    addItem?.({ ...cartItem, pricing, store: ad.store, id: items.length + 1 });
  };

  return (
    <div className="w-full">
      <ScrollArea maxHeight="70vh" className="space-y-3 px-5 pb-0">
        <PriceTag pricing={pricing} className="text-base" />
        <FormGroup
          label={`${pricing.details.period}s`}
          labelStyle="capitalize"
          className="bg-white p-5 rounded-lg shadow"
        >
          <div className="flex gap-3 items-center">
            <FormInput
              type="text"
              className="border border-secondary text-lg font-bold text-primary w-20"
              wrapperStyle="border-none w-fit mx-auto"
              value={(cartItem.qty as number) ?? "1"}
              onChange={handleChangeQuantity}
              actionBtn={
                <span className="flex gap-3 p-2">
                  <Button
                    className="text-xs p-1 hover:bg-gray-300"
                    onClick={() => {
                      if (
                        (cartItem.qty as number) <
                        (pricing.details.max_period ?? 12)
                      ) {
                        setCartItem({
                          ...cartItem,
                          qty: (cartItem.qty as number) + 1,
                        });
                      }
                    }}
                  >
                    <Plus size={15} />
                  </Button>
                  <Button
                    className="text-xs p-1 hover:bg-gray-300"
                    onClick={() => {
                      if (
                        (cartItem.qty as number) >
                        (pricing.details.min_period ?? 1)
                      ) {
                        setCartItem({
                          ...cartItem,
                          qty: (cartItem.qty as number) - 1,
                        });
                      }
                    }}
                  >
                    <Minus size={15} />
                  </Button>
                </span>
              }
            />
          </div>
        </FormGroup>
        <PriceTag
          pricing={calcCartItemSubTotal(
            cartItem.pricing,
            cartItem.qty as number
          )}
          className="text-base border px-5 py-1 rounded"
        />
        <form
          method="dialog"
          className="flex gap-5 w-full justify-between items-center pt-2"
        >
          <Button className="w-full bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-background">
            Cancel
          </Button>
          <Button
            onClick={handleAddToCart}
            className="w-full bg-transparent border border-green-500 text-green-500 hover:bg-green-500 hover:text-background"
          >
            Add to cart
          </Button>
        </form>
      </ScrollArea>
    </div>
  );
};

const RangePriceForm = ({ ad }: { ad: Listing }) => {
  const {
    cart: { items, addItem, updateItem },
  } = useAppStore();
  const pricings: Pricing<PriceRange>[] = ad.pricings ?? [];
  const price_determinats = Array.from(
    Object.keys(pricings[0].details.specs ?? {})
  );
  const price_choices = pricings.map((p) => p.details.specs);

  // Get comma-separated spec keys
  const specs = Object.entries(ad.specs as Record<string, any>)
    .filter(([_, value]) => typeof value === "string" && value.includes(","))
    .map(([key, value]) => {
      return { key, options: value.split(",") as string[] };
    });

  const [error, setError] = useState<Record<string, string>>({});
  const [cartItem, setCartItem] = useState<CartItem>(() => {
    return {
      ad: { id: ad.id, title: ad.title, description: ad.description ?? "" },
      store: ad.store ?? ({} as Store),
      specs: {},
      qty: 1.0,
    } as CartItem;
  });

  const handleOptionChange = (key: string, value: string) => {
    // If the spec already exists, delete it
    if (cartItem.specs![key] && cartItem.specs![key].includes(value)) {
      setCartItem((prev) => ({
        ...prev,
        specs: {
          ...cartItem.specs,
          [key]: cartItem.specs![key].filter((r: string) => r != value),
        },
      }));

      return;
    }

    if (
      ((cartItem.specs![key] as any[]) ?? []).length >= (cartItem.qty as number)
    ) {
      setError({
        ...error,
        [key]: `You can only have ${cartItem.qty as number} ${key} options.`,
      });
      return;
    }

    setCartItem((prev) => ({
      ...prev,
      specs: {
        ...cartItem.specs,
        [key]: [...(cartItem.specs[key] ?? []), value],
      },
    }));
  };

  const handleAddToCart = () => {
    if (!ad.store) {
      alert("The ad does not belong to any specified store.");
      return;
    }
    if (Number(cartItem.qty as number) <= 0) {
      alert(`Quantity must be greater than 0.`);
      return;
    }
    if (!cartItem.pricing) {
      alert(
        "Select one of the available pricing options based on the specifications."
      );
      return;
    }
    const old = items.find((i) => i.sn === `${ad.id}-${cartItem.pricing.id}`);
    if (Boolean(old)) {
      updateItem?.({
        ...cartItem,
        store: ad.store,
        id: old?.id!,
        sn: old?.sn,
        aqty: cartItem.pricing.details.qty,
      });
      return;
    }
    addItem?.({
      ...cartItem,
      store: ad.store,
      id: items.length + 1,
      sn: `${ad.id}-${cartItem.pricing.id}`,
      aqty: cartItem.pricing.details.qty,
    });
  };

  const handleChangeQuantity = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value <= Number(`${cartItem.pricing?.details.qty ?? 1}`)) {
      setCartItem({ ...cartItem, qty: Number(e.target.value) });
    }
  };

  return (
    <div className="w-full">
      <div className="px-5 pb-5 space-y-3">
        {ad.pricings?.map((pricing, index) => (
          <Button
            className="w-full"
            key={index}
            onClick={() => {
              setCartItem({
                ...cartItem,
                pricing,
                subTotal: calcCartItemSubTotal(pricing, Number(cartItem.qty)),
              });
            }}
          >
            <PriceTag className="" pricing={pricing} />
          </Button>
        ))}
      </div>
      <ScrollArea maxHeight="50vh" className="space-y-5 px-5">
        <FormInput
          type="number"
          className="border border-secondary text-lg font-bold text-primary w-full"
          wrapperStyle=""
          value={(cartItem.qty as number) ?? "1"}
          onChange={handleChangeQuantity}
          icon={<span className="px-2">QTY</span>}
          actionBtn={
            <span className="flex gap-3 px-2">
              <Button
                className="text-xs p-1 hover:bg-gray-300"
                onClick={() => {
                  if (
                    (cartItem.qty as number) <
                    (cartItem.pricing?.details.qty ?? 1)
                  ) {
                    setCartItem({
                      ...cartItem,
                      qty: (cartItem.qty as number) + 1,
                    });
                  }
                }}
              >
                <Plus size={15} />
              </Button>
              <Button
                className="text-xs p-1 hover:bg-gray-300"
                onClick={() => {
                  if ((cartItem.qty as number) > 1) {
                    setCartItem({
                      ...cartItem,
                      qty: (cartItem.qty as number) - 1,
                    });
                  }
                }}
              >
                <Minus size={15} />
              </Button>
            </span>
          }
        />
        {specs
          .filter((s) => !price_determinats.includes(s.key))
          .map((s, i) => {
            return (
              <FormGroup
                label={s.key}
                labelStyle="capitalize"
                className="bg-white p-5 rounded-lg shadow"
                key={i}
              >
                <div className="flex gap-2 flex-wrap py-3">
                  {error[s.key] && (
                    <p className="p-2 w-full bg-amber-100 text-amber-500 rounded-lg flex items-center gap-1 text-xs">
                      <Info className="h-5 w-5" />
                      <span>{error[s.key]}</span>
                    </p>
                  )}
                  {s.options.map((op, k) => {
                    const exists = (
                      cartItem.specs[s.key] ?? ([] as any[])
                    ).includes(op);

                    const clickable = () => {
                      const is_clickable = price_determinats.includes(s.key)
                        ? Boolean(price_choices.find((b) => b![s.key] === op))
                        : true;
                      const is_determinant = price_determinats.includes(s.key);
                      if (is_determinant) {
                        if (is_clickable) {
                          console.log();
                          if (cartItem?.specs[s.key]?.length == 1) {
                            return cartItem?.specs[s.key][0] !== op;
                          } else {
                            return false;
                          }
                        } else {
                          return true;
                        }
                      } else {
                        return exists
                          ? false
                          : !is_clickable ||
                              (cartItem.specs[s.key] ?? []).length >=
                                (cartItem.qty as number);
                      }
                    };
                    return (
                      <Button
                        onClick={() => {
                          handleOptionChange(s.key, op);
                        }}
                        disabled={clickable()}
                        key={k}
                        className={`rounded hover:shadow disabled:opacity-30 ${
                          exists ? "bg-primary text-background" : ""
                        }`}
                      >
                        {op}
                      </Button>
                    );
                  })}
                </div>
              </FormGroup>
            );
          })}
      </ScrollArea>
      <form
        method="dialog"
        className="flex gap-5 w-full justify-between items-center pt-3 px-5"
      >
        <Button className="w-full bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-background">
          Cancel
        </Button>
        <Button
          onClick={handleAddToCart}
          disabled={!cartItem.pricing || !cartItem.subTotal}
          className="w-full bg-transparent border border-green-500 text-green-500 hover:bg-green-500 hover:text-background disabled:opacity-40"
        >
          Add to cart
        </Button>
      </form>
    </div>
  );
};

const MenuPriceForm = ({ ad }: { ad: Listing }) => {
  const pricings: Pricing<PriceMenu>[] = ad.pricings ?? [];
  const [pricing, setPricing] = useState<Pricing<PriceMenu>>();
  const {
    cart: { items, addItem, updateItem },
  } = useAppStore();
  const [error, setError] = useState<Record<string, string>>({});
  const [cartItem, setCartItem] = useState<CartItem>(() => {
    return {
      ad: { id: ad.id, title: ad.title, description: ad.description ?? "" },
      store: ad.store ?? ({} as Store),
      specs: {},
      qty: 1.0,
    } as CartItem;
  });

  const handleChangeQuantity = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (pricing?.details.qty) {
      if (value <= Number(`${pricing?.details.qty}`)) {
        setCartItem({ ...cartItem, qty: Number(e.target.value) });
      }
    } else {
      setCartItem({ ...cartItem, qty: Number(e.target.value) });
    }
  };

  const handleAddToCart = () => {
    if (!ad.store) {
      alert("The ad does not belong to any specified store.");
      return;
    }
    if (Number(cartItem.qty as number) <= 0) {
      alert(`Quantity must be greater than 0.`);
      return;
    }
    if (!cartItem.pricing) {
      alert(
        "Failed to determine the apropriate pricing based on the specifications"
      );
      return;
    }

    const subTotal = calcCartItemSubTotal(
      cartItem.pricing,
      Number(cartItem.qty)
    );
    if (!subTotal) {
      return;
    }
    const old = items.find((i) => i.sn === `${ad.id}-${cartItem.pricing.id}`);
    if (Boolean(old)) {
      updateItem?.({
        ...cartItem,
        subTotal,
        store: ad.store,
        id: old?.id!,
        sn: old?.sn,
      });
      return;
    }
    addItem?.({
      ...cartItem,
      subTotal,
      store: ad.store,
      id: items.length + 1,
      sn: `${ad.id}-${cartItem.pricing.id}`,
    });
  };
  return (
    <div className="w-full">
      <ScrollArea maxHeight="65vh" className="space-y-5 pb-0 w-full">
        <div className="w-full">
          {pricings.map((p, i) => {
            return (
              <Button
                key={i}
                onClick={() => {
                  setPricing(p);
                  setCartItem({
                    ...cartItem,
                    sn: `${ad.id}-${p.id}`,
                    pricing: p,
                    ad: {
                      id: ad.id,
                      title: p.details.title,
                      description: p.details.description ?? "",
                    },
                    aqty: p.details.qty ?? 1000,
                  });
                }}
                className={`hover:bg-gray-200 w-full bg-transparent px-5 rounded-none text-left ${
                  p === cartItem.pricing && "bg-gray-100"
                }`}
              >
                <MenuItem item={p} />
              </Button>
            );
          })}
        </div>
        {cartItem.pricing ? (
          <div className="p-5">
            <div className="text-gray-500 p-5 rounded-lg gap-5 flex flex-wrap shadow">
              <PriceTag
                className="text-lg font-bold"
                pricing={cartItem.pricing}
              />

              <FormInput
                type="text"
                className="border border-secondary text-lg font-bold text-primary w-10"
                wrapperStyle=""
                value={(cartItem.qty as number) ?? "1"}
                onChange={handleChangeQuantity}
                icon={<span className="px-2">QTY</span>}
                actionBtn={
                  <span className="flex gap-3 px-2">
                    <Button
                      className="text-xs p-1 hover:bg-gray-300"
                      onClick={() => {
                        if (pricing?.details.qty) {
                          if (
                            (cartItem.qty as number) <
                            (pricing?.details.qty ?? 1)
                          ) {
                            setCartItem({
                              ...cartItem,
                              qty: (cartItem.qty as number) + 1,
                            });
                          }
                        } else {
                          setCartItem({
                            ...cartItem,
                            qty: (cartItem.qty as number) + 1,
                          });
                        }
                      }}
                    >
                      <Plus size={15} />
                    </Button>
                    <Button
                      className="text-xs p-1 hover:bg-gray-300"
                      onClick={() => {
                        if ((cartItem.qty as number) > 1) {
                          setCartItem({
                            ...cartItem,
                            qty: (cartItem.qty as number) - 1,
                          });
                        }
                      }}
                    >
                      <Minus size={15} />
                    </Button>
                  </span>
                }
              />
            </div>
          </div>
        ) : (
          <div className="text-gray-500 p-5 rounded-lg shadow">
            Select a menu item to reveal the price
          </div>
        )}
      </ScrollArea>
      <form
        method="dialog"
        className="flex gap-5 w-full justify-between items-center pt-3 px-5"
      >
        <Button className="w-full bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-background">
          Cancel
        </Button>
        <Button
          onClick={handleAddToCart}
          className="w-full bg-transparent border border-green-500 text-green-500 hover:bg-green-500 hover:text-background"
        >
          Add to cart
        </Button>
      </form>
    </div>
  );
};

const UnitPriceForm = ({ ad }: { ad: Listing }) => {
  const pricings: Pricing<UnitPrice>[] = ad.pricings ?? [];
  const [old, setOld] = useState<CartItem>();

  const units = pricings.map((p) => ({
    u: p.details.units,
    cr: p.details.conversionRatio,
    cf: p.details.conversionFactor,
  }));

  const maxQuantity = (u?: string) => {
    if (!u) {
      return 1;
    }
    const rt = units.find((ut) => ut.u === u);
    if (!rt) {
      return 1;
    }
    const ratio = rt.cr;
    if (!ratio) {
      const cf = rt.cf;
      if (!cf) {
        return 1;
      }
      return toNumber(`${ad.quantity}`) * cf;
    }
    return toNumber(`${ad.quantity}`) * toNumber(ratio[u] ?? 1);
  };

  // Get comma-separated spec keys
  const specs = Object.entries(ad.specs as Record<string, any>)
    .filter(([_, value]) => typeof value === "string" && value.includes(","))
    .map(([key, value]) => {
      return { key, options: value.trim().split(",") as string[] };
    });

  const {
    cart: { items, addItem, updateItem },
  } = useAppStore();

  useEffect(() => {
    setOld(items.find((i) => i.sn === ad.id));
  }, [items]);

  const [error, setError] = useState<Record<string, string>>({});
  const [cartItem, setCartItem] = useState<CartItem>((): CartItem => {
    if (old) {
      return old as CartItem;
    }
    return {
      ad: { id: ad.id, title: ad.title, description: ad.description ?? "" },
      store: ad.store ?? ({} as Store),
      specs: {},
      sn: ad.id,
      qty: 1.0,
      units: units[0].u,
      pricing: pricings.find((p) => (p.details.units = units[0].u)),
    } as CartItem;
  });

  const handleChangeQuantity = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);

    if (value <= maxQuantity(cartItem.units)) {
      setCartItem({ ...cartItem, qty: e.target.value });
    }
  };

  const handleOptionChange = (key: string, value: string) => {
    // If the spec already exists, delete it
    if (cartItem.specs![key] && cartItem.specs![key].includes(value)) {
      setCartItem((prev) => ({
        ...prev,
        specs: {
          ...cartItem.specs,
          [key]: cartItem.specs![key].filter((r: string) => r != value),
        },
      }));

      return;
    }

    if (
      ((cartItem.specs![key] as any[]) ?? []).length >= (cartItem.qty as number)
    ) {
      setError({
        ...error,
        [key]: `You can only have ${cartItem.qty as number} ${key} options.`,
      });
      return;
    }

    setCartItem((prev) => ({
      ...prev,
      specs: {
        ...cartItem.specs,
        [key]: [...(cartItem.specs[key] ?? []), value],
      },
    }));
  };

  const handleAddToCart = () => {
    if (!ad.store) {
      alert("The ad does not belong to any specified store.");
      return;
    }
    if (Number(cartItem.qty as number) <= 0) {
      alert(`Quantity must be greater than 0.`);
      return;
    }
    if (!cartItem.pricing) {
      alert("First select the units to identify the pricing.");
      return;
    }

    const subTotal = calcCartItemSubTotal(
      cartItem.pricing,
      Number(cartItem.qty)
    );
    if (!subTotal) {
      return;
    }

    if (Boolean(old)) {
      updateItem?.({
        ...old,
        ...cartItem,
        subTotal,
        aqty: maxQuantity(cartItem.units),
        store: ad.store,
      });
      return;
    }
    addItem?.({
      ...cartItem,
      subTotal,
      store: ad.store,
      aqty: maxQuantity(cartItem.units),
      id: items.length + 1,
    });
  };

  return (
    <div className="w-full space-y-5">
      <div className="w-full flex gap-5 px-5">
        <FormInput
          type="number"
          className="border border-secondary text-lg font-bold text-primary w-full"
          wrapperStyle="w-full"
          value={(cartItem.qty as number) ?? "1"}
          onChange={handleChangeQuantity}
          icon={<span className="px-2">QTY</span>}
          actionBtn={
            <span className="flex gap-3 px-2">
              <Button
                className="text-xs p-1 hover:bg-gray-300"
                onClick={() => {
                  if ((cartItem.qty as number) < maxQuantity(cartItem.units)) {
                    setCartItem({
                      ...cartItem,
                      qty: (cartItem.qty as number) + 1,
                    });
                  }
                }}
              >
                <Plus size={15} />
              </Button>
              <Button
                className="text-xs p-1 hover:bg-gray-300"
                onClick={() => {
                  if ((cartItem.qty as number) > 1) {
                    setCartItem({
                      ...cartItem,
                      qty: (cartItem.qty as number) - 1,
                    });
                  }
                }}
              >
                <Minus size={15} />
              </Button>
            </span>
          }
        />
        <Select
          value={cartItem.units}
          className=""
          triggerStyle="h-full"
          options={units.map((u) => ({ label: u.u, value: u.u }))}
          onChange={(e) => {
            const pricing = pricings.find((p) => p.details.units === e);
            if (!pricing) {
              setError({
                pricing:
                  "The selected units did not correspond to any of the available pricings.",
              });
              return;
            }
            setCartItem({
              ...cartItem,
              units: e,
              pricing,
              aqty: maxQuantity(e),
            });
          }}
        />
      </div>
      <ScrollArea maxHeight="65vh" className="space-y-5 px-5 pb-0 w-full">
        {specs.map((s, i) => {
          return (
            <FormGroup
              label={s.key}
              labelStyle="capitalize"
              className="bg-white p-5 rounded-lg shadow"
              key={i}
            >
              <div className="flex gap-2 flex-wrap py-3">
                {error[s.key] && (
                  <p className="p-2 w-full bg-amber-100 text-amber-500 rounded-lg flex items-center gap-1 text-xs">
                    <Info className="h-5 w-5" />
                    <span>{error[s.key]}</span>
                  </p>
                )}
                {s.options.map((op, k) => {
                  const exists = (
                    cartItem.specs[s.key] ?? ([] as any[])
                  ).includes(op);

                  const clickable = () => {
                    return exists
                      ? false
                      : (cartItem.specs[s.key] ?? []).length >=
                          (cartItem.qty as number);
                  };
                  return (
                    <Button
                      onClick={() => {
                        handleOptionChange(s.key, op);
                      }}
                      disabled={clickable()}
                      key={k}
                      className={`rounded hover:shadow disabled:opacity-30 ${
                        exists ? "bg-primary text-background" : ""
                      }`}
                    >
                      {op}
                    </Button>
                  );
                })}
              </div>
            </FormGroup>
          );
        })}
      </ScrollArea>
      <form
        method="dialog"
        className="flex gap-5 w-full justify-between items-center pt-3 px-5"
      >
        <Button className="w-full bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-background">
          Cancel
        </Button>
        <Button
          onClick={handleAddToCart}
          disabled={!Boolean(cartItem.pricing)}
          className="w-full bg-transparent disabled:opacity-35 hover:disabled:bg-transparent hover:disabled:text-green-500 border border-green-500 text-green-500 hover:bg-green-500 hover:text-background"
        >
          Add to cart
        </Button>
      </form>
    </div>
  );
};

export default {
  FixedPriceForm,
  RecurringPriceForm,
  RangePriceForm,
  MenuPriceForm,
  UnitPriceForm,
};
