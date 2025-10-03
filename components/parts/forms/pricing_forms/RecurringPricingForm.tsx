import Button from "@/components/ui/Button";
import FormGroup from "@/components/ui/FormGroup";
import FormInput from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { Currency, Pricing, RecurringPrice } from "@/lib/types";
import { toNumber } from "@/lib/utils";
import { ChangeEvent, useState } from "react";
import PriceTag from "../../cards/PriceTag";
import { X } from "lucide-react";

export const RecurringPricingForm = ({
  curr,
  initialValue,
  onChange,
}: {
  curr: Currency;
  initialValue?: Pricing<RecurringPrice>[];
  onChange: (p: Pricing<RecurringPrice>[]) => void;
}) => {
  const [newValue, setNewValue] = useState<RecurringPrice>(
    {} as RecurringPrice
  );
  const [pricings, setPricings] = useState<Pricing<RecurringPrice>[]>(
    initialValue ?? []
  );

  const setPrice = (e: ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value.replaceAll(",", "")))) {
      return;
    }
    setNewValue({ ...newValue, price: e.target.value });
  };

  const setPeriod = (e: string) => {
    setNewValue({ ...newValue, period: e });
  };

  const handleSave = () => {
    if (!newValue.price || toNumber(newValue.price) === 0) {
      return;
    }
    setPricings([{ currency: curr, details: newValue, scheme: "recurring" }]);
    onChange([{ currency: curr, details: newValue, scheme: "recurring" }]);
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
      <div className="flex gap-5">
        <FormGroup label="Price" required className="w-full  text-left">
          <FormInput
            value={newValue?.price ?? ""}
            onChange={setPrice}
            type="text"
            icon={<span className="px-2">{curr}</span>}
            className="px-2 py-1.5 w-full"
          />
        </FormGroup>
        <FormGroup
          label="Recurring period"
          required
          className="w-full  text-left"
        >
          <Select
            value={newValue?.period}
            placeholder="Select the recurring period"
            triggerStyle="w-full py-2 bg-background"
            className="text-accent"
            options={[
              { label: "Hourly", value: "hour" },
              { label: "Daily", value: "day" },
              { label: "Weekly", value: "week" },
              { label: "Monthly", value: "month" },
              { label: "Quatterly", value: "quater" },
              { label: "Yearly", value: "year" },
            ]}
            onChange={setPeriod}
          />
        </FormGroup>
      </div>
      <Button
        type="button"
        disabled={
          !newValue.price || toNumber(newValue.price) === 0 || !newValue.period
        }
        className="bg-secondary/90 hover:bg-secondary text-accent disabled:cursor-not-allowed"
        onClick={handleSave}
      >
        Add pricing
      </Button>
    </>
  );
};
