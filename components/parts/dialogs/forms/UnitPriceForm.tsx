import { Currency, Pricing, Unit, UnitPrice } from "@/lib/types";
import React, { useState } from "react";
import Modal from "../../models/Modal";
import { Check } from "lucide-react";
import MoneyInput from "../../forms/MoneyInput";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/Input";

/**
 * This one adds a single unit price to the unit pricings list.
 * @param param0
 * @returns
 */
export default function UnitPriceForm({
  unit,
  pricings,
  setPricings,
  currency,
  adUnits,
}: {
  unit: string;
  pricings: Pricing<UnitPrice>[];
  setPricings: (p: Pricing<UnitPrice>[]) => void;
  currency: Currency;
  adUnits: string;
}) {
  const [pricing, setPricing] = useState<Pricing<UnitPrice>>(
    pricings.find((p) => p.details.units === unit) ?? {
      currency,
      scheme: "unit",
      amount: 0,
      details: { units: unit } as UnitPrice,
    }
  );
  console.log(adUnits, unit);
  const addNewPrice = () => {
    const exists = pricings.find(
      (p) => p.details.units === pricing.details.units
    );

    if (Boolean(exists)) {
      setPricings(
        pricings.map((p) =>
          p.details.units === pricing.details.units ? pricing : p
        )
      );
    } else {
      setPricings([pricing, ...pricings]);
    }
  };
  return (
    <Modal
      trigger={
        <>
          {unit}{" "}
          {pricings.map((p) => p.details.units).includes(unit) ? (
            <Check size={15} />
          ) : (
            <></>
          )}
        </>
      }
      triggerStyle={`rounded ${
        pricings.map((p) => p.details.units).includes(unit)
          ? "bg-primary hover:bg-orange-400 text-background gap-3"
          : "bg-gray-200 hover:bg-gray-100"
      }`}
      className="max-w-60 mt-20"
      header={`Price per ${unit}`}
    >
      <div className="px-5 space-y-5 text-gray-500">
        <MoneyInput
          money={pricing?.amount ?? ""}
          currency={currency}
          label={`Price per ${unit}`}
          setMoney={(m) => {
            setPricing({
              ...pricing,
              amount: m,
              details: { ...pricing.details },
            });
          }}
        />
        {adUnits.toLowerCase() !== unit.toLowerCase() && (
          <div className="">
            <p className="text-gray-400 text-xs w-full break-words text-wrap whitespace-normal m-0">
              How many <span className="lowercase">{unit}</span> are there in
              one {adUnits}{" "}
            </p>
            <FormInput
              type="number"
              value={pricing.details.conversionFactor ?? ""}
              onChange={(e) => {
                setPricing({
                  ...pricing,
                  details: {
                    ...pricing.details,
                    conversionFactor: Number(e.target.value),
                  },
                });
              }}
              actionBtn={<span className="pr-5">{unit}s</span>}
            />
          </div>
        )}
        <form method="dialog" className="w-full flex gap-5 pb-5">
          <Button className="w-full text-base text-gray-500 bg-transparent border border-gray-500">
            Cancel
          </Button>
          <Button
            disabled={!pricing.amount}
            onClick={addNewPrice}
            className="w-full disabled:opacity-40 text-base text-green-500 bg-transparent border border-green-500"
          >
            Add pricing
          </Button>
        </form>
      </div>
    </Modal>
  );
}
