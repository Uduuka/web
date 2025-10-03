import Button from "@/components/ui/Button";
import FormGroup from "@/components/ui/FormGroup";
import { Currency, Listing, PriceRange, Pricing } from "@/lib/types";
import { containsObject, toNumber } from "@/lib/utils";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import PriceTag from "../../cards/PriceTag";
import { X } from "lucide-react";
import Select from "@/components/ui/Select";
import FormInput from "@/components/ui/Input";

export const RangePricingForm = ({
  curr,
  initialValue,
  ad,
  onChange,
}: {
  curr: Currency;
  initialValue?: Pricing<PriceRange>[];
  ad: Listing;
  onChange: (p: Pricing<PriceRange>[]) => void;
}) => {
  // Get comma-separated spec keys
  const commaSeparatedSpecs = Object.entries(
    ad.specs as Record<string, any>
  ).filter(([_, value]) => typeof value === "string" && value.includes(","));

  const [specs, setSpecs] = useState<Record<string, string>>({});
  const [newValue, setNewValue] = useState<PriceRange>({} as PriceRange);
  const [pricings, setPricings] = useState<Pricing<PriceRange>[]>(
    initialValue ?? []
  );

  const dialogRef = useRef<HTMLDialogElement>(null);

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

    if (
      containsObject(
        pricings.map((p) => p.details.specs),
        newValue.specs
      )
    ) {
      if (dialogRef.current) {
        dialogRef.current.showModal();
      }
      return;
    }

    setPricings([
      ...pricings,
      { currency: curr, details: newValue, scheme: "range" },
    ]);
    onChange([
      ...pricings,
      { currency: curr, details: newValue, scheme: "range" },
    ]);
  };

  return (
    <>
      <div className="flex gap-5 w-full">
        <FormGroup
          label="Price determinats"
          required
          className="w-full  text-left"
        >
          <p className="text-sm text-gray-500">
            Specify the specifications that determine the price for this
            product.
          </p>
          <div className="flex flex-wrap gap-5 border rounded-lg border-gray-500 hover:border-primary p-5">
            {commaSeparatedSpecs.length > 0 ? (
              commaSeparatedSpecs.map((spec) => {
                const [key, value] = spec;
                return (
                  <Button
                    type="button"
                    key={key}
                    className={`px-2 py-1 rounded-full capitalize text-xs ${
                      specs[key]
                        ? "bg-primary text-background"
                        : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => {
                      if (specs[key]) {
                        const newSpecs = { ...specs };
                        delete newSpecs[key];
                        setSpecs(newSpecs);

                        if (newValue.specs && newValue.specs[key]) {
                          const newSelectedSpecs = { ...newValue.specs };
                          delete newSelectedSpecs[key];
                          setNewValue({
                            ...newValue,
                            specs: newSelectedSpecs,
                          });
                        }
                        return;
                      }
                      setSpecs({ ...specs, [key]: value });
                    }}
                  >
                    {key}
                  </Button>
                );
              })
            ) : (
              <p className="text-xs text-yellow-500">
                Oops, there no specifications that pricing may base on. Please
                add one or more comma seperated specifications in the step one.
              </p>
            )}
          </div>
        </FormGroup>
      </div>
      {pricings.length > 0 ? (
        <>
          {pricings.map((p, i) => (
            <div
              key={i}
              className="flex justify-between gap-3 p-1 px-2 rounded bg-background w-full items-center"
            >
              <PriceTag className="" pricing={p} />
              <button
                type="button"
                className="ml-2 p-1 rounded hover:bg-red-100 text-red-500"
                onClick={() => {
                  const filtered = pricings.filter((_, index) => index !== i);
                  setPricings(filtered);
                  onChange(filtered);
                }}
                aria-label="Remove pricing"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </>
      ) : null}
      <div className="w-full space-y-5">
        {specs && Object.keys(specs).length > 0 ? (
          <div className="flex flex-wrap gap-5">
            {Object.entries(specs).map(([key, value]) => (
              <FormGroup
                label={`Select ${key} option`}
                key={key}
                required
                className="w-fit text-left"
                labelStyle="text-xs text-gray-500"
              >
                <Select
                  options={value
                    .split(",")
                    .map((v) => ({ label: v, value: v }))}
                  onChange={(val) => {
                    if (val) {
                      setNewValue({
                        ...newValue,
                        specs: { ...newValue.specs, [key]: val },
                      });
                    } else {
                      const newSpecs = { ...newValue.specs };
                      delete newSpecs[key];
                      setNewValue({
                        ...newValue,
                        specs: newSpecs,
                      });
                    }
                  }}
                  value={newValue.specs ? newValue.specs[key] : undefined}
                  className="w-full"
                  triggerStyle="w-full"
                  placeholder={key}
                />
              </FormGroup>
            ))}
          </div>
        ) : null}
        {
          // If all newValue.specs values are selected

          newValue.specs &&
          Object.keys(newValue.specs).length === Object.keys(specs).length &&
          Object.values(newValue.specs).every((v) => v && v.length > 0) ? (
            <div className="flex gap-5 w-full">
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
                label="Quantity available"
                required
                className="w-full  text-left"
              >
                <FormInput
                  value={newValue?.qty ?? ""}
                  onChange={(e) => {
                    if (isNaN(Number(e.target.value.replaceAll(",", "")))) {
                      return;
                    }
                    setNewValue({ ...newValue, qty: Number(e.target.value) });
                  }}
                  type="text"
                  className="px-2 py-1.5 w-full"
                />
              </FormGroup>
            </div>
          ) : null
        }
        <Button
          type="button"
          disabled={!newValue.price || toNumber(newValue.price) === 0}
          className="bg-secondary/90 hover:bg-secondary text-accent disabled:cursor-not-allowed w-full"
          onClick={handleSave}
        >
          Add pricing
        </Button>
      </div>
      <dialog
        ref={dialogRef}
        className="m-auto bg-transparent backdrop:bg-black/30 p-5"
      >
        <div className="w-full max-w-sm bg-background p-5 rounded-lg text-gray-500">
          <form method="dialog" className="modal-box">
            <h3 className="font-bold text-lg">Duplicate pricing</h3>
            <p className="py-4">
              The price determinats you selected, have already been used. Do you
              want to replace the pricing ?
            </p>
            <div className="flex justify-between w-full">
              <Button
                type="submit"
                className="bg-gray-500 hover:bg-gray-500/90 text-background min-w-24"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={() => {
                  const filtered = pricings.filter(
                    (p) => !containsObject([p.details.specs], newValue.specs)
                  );
                  setPricings([
                    ...filtered,
                    { currency: curr, details: newValue, scheme: "range" },
                  ]);
                }}
                className="bg-primary hover:bg-primary/90 text-background min-w-24"
              >
                Replace
              </Button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};
