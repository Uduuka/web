import React, { useRef, useState, useTransition } from "react";
import Modal from "../models/Modal";
import { DiamondPercent, LoaderCircle } from "lucide-react";
import { Listing, Pricing } from "@/lib/types";
import ScrollArea from "../layout/ScrollArea";
import FormGroup from "@/components/ui/FormGroup";
import PriceTag from "../cards/PriceTag";
import MoneyInput from "../forms/MoneyInput";
import Button from "@/components/ui/Button";
import { updatePricings } from "@/lib/actions";

export default function DiscountDialog({
  ad,
  ads,
  setAds,
}: {
  ad: Listing;
  ads: Listing[];
  setAds: (ads: Listing[]) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const [discounts, setDiscounts] = useState(ad.pricings ?? []);
  const [saving, startSaving] = useTransition();

  const handleSaveDistcount = () => {
    startSaving(async () => {
      const { error } = await updatePricings(discounts);
      if (error) {
        console.log(error);
        return;
      }
      setAds(
        ads.map((a) => (a.id === ad.id ? { ...ad, pricings: discounts } : a))
      );
      formRef.current?.submit();
    });
  };
  return (
    <Modal
      trigger={
        <>
          <DiamondPercent size={15} /> Offer discount
        </>
      }
      header={
        <span className="text-base font-bold max-w-90% line-clamp-1">
          Offer discount.
        </span>
      }
      triggerStyle="p-1 bg-purple-500 gap-2 justify-start px-5 hover:bg-purple-600 text-xs text-white w-full"
    >
      <ScrollArea className="pt-2 pb-0 px-5">
        <div className="space-y-2 w-full py-5">
          {discounts.map((p, i) => (
            <div
              className="text-gray-500 bg-gray-100 rounded-lg w-full p-5"
              key={i}
            >
              <FormGroup label="Price" className="">
                <PriceTag pricing={p} className="text-gray-500 font-bold" />
              </FormGroup>
              <FormGroup className="">
                <MoneyInput
                  currency={p.currency}
                  label="Discount"
                  money={p.discount}
                  placeholder="Enter a discount here"
                  setMoney={(m) => {
                    setDiscounts(
                      discounts.map((d) =>
                        d.id === p.id ? { ...p, discount: m } : d
                      )
                    );
                  }}
                />
              </FormGroup>
            </div>
          ))}
        </div>
      </ScrollArea>
      <form
        ref={formRef}
        method="dialog"
        className="w-full flex gap-5 pb-5 px-5"
      >
        <Button className="w-full border bg-red-50 border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSaveDistcount}
          className="w-full border bg-green-50 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
        >
          {saving ? (
            <LoaderCircle className="animate-spin" size={15} />
          ) : (
            "Save"
          )}
        </Button>
      </form>
    </Modal>
  );
}
