import { Currency, Pricing, RecurringPrice } from "@/lib/types";
import React, { useState } from "react";
import Modal from "../../models/Modal";
import { Check } from "lucide-react";
import MoneyInput from "../../forms/MoneyInput";
import Button from "@/components/ui/Button";

/**
 * This one adds a single period price to the period pricings list.
 * @param param0
 * @returns
 */
export default function RecurringPriceForm({
  period,
  pricings,
  setPricings,
  currency,
  olp,
}: {
  period: string;
  pricings: Pricing<RecurringPrice>[];
  setPricings: (p: Pricing<RecurringPrice>[]) => void;
  currency: Currency;
  olp?: Pricing<RecurringPrice>;
}) {
  const [pricing, setPricing] = useState<Pricing<RecurringPrice>>(
    olp ?? {
      currency,
      scheme: "recurring",
      amount: 0,
      details: { period } as RecurringPrice,
    }
  );

  const addNewPrice = () => {
    const exists = pricings.find(
      (p) => p.details.period === pricing.details.period
    );

    if (Boolean(exists)) {
      setPricings(
        pricings.map((p) =>
          p.details.period === pricing.details.period ? pricing : p
        )
      );
    } else {
      setPricings([...pricings, pricing]);
    }
  };
  return (
    <Modal
      trigger={
        <>
          {period}{" "}
          {pricings.map((p) => p.details.period).includes(period) ? (
            <Check size={15} />
          ) : (
            <></>
          )}
        </>
      }
      triggerStyle={`rounded capitalize ${
        pricings.map((p) => p.details.period).includes(period)
          ? "bg-primary hover:bg-orange-400 text-background gap-3"
          : ""
      }`}
      className="max-w-60 mt-20"
      header={`Price per ${period}`}
    >
      <div className="px-5 space-y-5 text-gray-500">
        <MoneyInput
          money={pricing?.amount ?? ""}
          currency={currency}
          label={`Price`}
          setMoney={(m) => {
            setPricing({
              ...pricing,
              amount: m,
            });
          }}
        />
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
