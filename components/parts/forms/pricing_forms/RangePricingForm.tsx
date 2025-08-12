import Button from "@/components/ui/Button";
import FormGroup from "@/components/ui/FormGroup";
import FormInput from "@/components/ui/Input";
import { Currency, PriceRange, Pricing } from "@/lib/types";
import { toNumber } from "@/lib/utils";
import { ChangeEvent, useState } from "react";
import PriceTag from "../../cards/PriceTag";
import { X } from "lucide-react";

export const RangePricingForm = ({
  curr,
  initialValue,
  onChange,
}: {
  curr: Currency;
  initialValue?: Pricing<PriceRange>[];
  onChange: (p: Pricing<PriceRange>[]) => void;
}) => {
  const [discounted, setDiscounted] = useState(false);
  const [newValue, setNewValue] = useState<PriceRange>({} as PriceRange);
  const [pricings, setPricings] = useState<Pricing<PriceRange>[]>(
    initialValue ?? []
  );

  const setMinPrice = (e: ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value.replaceAll(",", "")))) {
      return;
    }
    setNewValue({ ...newValue, minPrice: e.target.value });
  };

  const setMaxPrice = (e: ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value.replaceAll(",", "")))) {
      return;
    }
    setNewValue({ ...newValue, maxPrice: e.target.value });
  };

  const setInitialMinPrice = (e: ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value.replaceAll(",", "")))) {
      return;
    }
    setNewValue({ ...newValue, initialMinPrice: e.target.value });
  };

  const setInitialMaxPrice = (e: ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value.replaceAll(",", "")))) {
      return;
    }
    setNewValue({ ...newValue, initialMaxPrice: e.target.value });
  };

  const handleSave = () => {
    if (!newValue.minPrice || toNumber(newValue.minPrice) === 0) {
      return;
    }
    setPricings([{ currency: curr, details: newValue, scheme: "range" }]);
    onChange([{ currency: curr, details: newValue, scheme: "range" }]);
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
      <div className="flex gap-5 w-full">
        <FormGroup label="Minimum price" required className="w-full  text-left">
          <FormInput
            type="text"
            value={newValue?.minPrice ?? ""}
            onChange={setMinPrice}
            icon={<span className="px-2">{curr}</span>}
            className="px-3 py-1.5"
          />
        </FormGroup>
        <FormGroup label="Maximum price" className="w-full  text-left">
          <FormInput
            type="text"
            value={newValue?.maxPrice ?? ""}
            onChange={setMaxPrice}
            icon={<span className="px-2">{curr}</span>}
            className="px-3 py-1.5"
          />
        </FormGroup>
      </div>
      <FormGroup
        label="Are these prices discounted?"
        required
        className="w-full  text-left"
      >
        <div className="px-5 py-1.5 rounded-lg border hover:border-primary focus-within:border-primary flex gap-10 justify-center items-center">
          <FormGroup
            label="Yes"
            htmlFor="yes"
            className="flex-row-reverse gap-0 w-fit"
            labelStyle="pl-2"
          >
            <input
              checked={discounted}
              onChange={(e) => {
                setDiscounted(e.target.checked);
              }}
              type="radio"
              id="yes"
              className="bg-primary border-primary checked:border-primary checked:bg-primary checked:text-primary"
            />
          </FormGroup>
          <FormGroup
            label="No"
            htmlFor="no"
            className="flex-row-reverse gap-0 w-fit"
            labelStyle="pl-2"
          >
            <input
              checked={!discounted}
              onChange={(e) => {
                setDiscounted(!e.target.checked);
              }}
              type="radio"
              id="no"
              className="bg-primary border-primary checked:border-primary checked:bg-primary checked:text-primary"
            />
          </FormGroup>
        </div>
      </FormGroup>
      {discounted && (
        <div className="flex gap-5 w-full">
          <FormGroup
            label="Initial minimum price"
            required
            className="w-full  text-left"
          >
            <FormInput
              type="text"
              value={newValue?.initialMinPrice ?? ""}
              onChange={setInitialMinPrice}
              icon={<span className="px-2">{curr}</span>}
              min={0}
              className="px-3 py-1.5"
            />
          </FormGroup>
          <FormGroup
            label="Initial maximum price"
            className="w-full  text-left"
          >
            <FormInput
              type="text"
              value={newValue?.initialMaxPrice ?? ""}
              onChange={setInitialMaxPrice}
              icon={<span className="px-2">{curr}</span>}
              min={0}
              className="px-3 py-1.5"
            />
          </FormGroup>
        </div>
      )}
      <Button
        type="button"
        disabled={!newValue.minPrice || toNumber(newValue.minPrice) === 0}
        className="bg-secondary/90 hover:bg-secondary text-accent disabled:cursor-not-allowed"
        onClick={handleSave}
      >
        Add pricing
      </Button>
    </>
  );
};
