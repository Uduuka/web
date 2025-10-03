import Button from "@/components/ui/Button";
import FormGroup from "@/components/ui/FormGroup";
import FormInput from "@/components/ui/Input";
import { Currency, FixedPrice, Pricing } from "@/lib/types";
import { ChangeEvent, useEffect, useState } from "react";
import PriceTag from "../../cards/PriceTag";
import { X } from "lucide-react";
import { toNumber } from "@/lib/utils";

export const FixedPricingForm = ({
  curr,
  initialValue,
  onChange,
}: {
  curr: Currency;
  initialValue?: Pricing<FixedPrice>[];
  onChange: (pricing: Pricing<FixedPrice>[]) => void;
}) => {
  const [newValue, setNewValue] = useState<FixedPrice>({} as FixedPrice);

  const [pricings, setPricings] = useState<Pricing<FixedPrice>[]>(
    initialValue ?? []
  );

  const setPrice = (e: ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value.replaceAll(",", "")))) {
      return;
    }
    setNewValue({ ...newValue, price: e.target.value });
  };

  const handleSave = () => {
    if (!newValue.price || toNumber(newValue.price) === 0) {
      return;
    }
    setPricings([{ currency: curr, details: newValue, scheme: "fixed" }]);
    onChange([{ currency: curr, details: newValue, scheme: "fixed" }]);
  };

  if (pricings.length > 0) {
    return (
      <div className="flex justify-between gap-3 p-1 px-2 rounded bg-background w-full items-center">
        <PriceTag className="" pricing={pricings[0]} key={0} />
        <button
          type="button"
          className="ml-2 p-1 rounded hover:bg-red-100 text-red-500"
          onClick={() => {
            setPricings([]);
            onChange([]);
          }}
          aria-label="Remove pricing"
        >
          <X size={18} />
        </button>
      </div>
    );
  }

  return (
    <>
      <FormGroup label="Price" required className="w-full  text-left">
        <FormInput
          value={newValue?.price ?? ""}
          onChange={setPrice}
          type="text"
          icon={<span className="px-2">{curr}</span>}
          className="px-2 py-1.5 w-full"
        />
      </FormGroup>
      <Button
        type="button"
        disabled={!newValue.price || toNumber(newValue.price) === 0}
        className="bg-secondary/90 hover:bg-secondary text-accent disabled:cursor-not-allowed"
        onClick={handleSave}
      >
        Add pricing
      </Button>
    </>
  );
};
