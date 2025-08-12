import FormGroup from "@/components/ui/FormGroup";
import FormInput from "@/components/ui/Input";
import { Currency, Listing, Pricing, Unit, UnitPrice } from "@/lib/types";
import { toNumber } from "@/lib/utils";
import { ChangeEvent, useEffect, useState, useTransition } from "react";
import PriceTag from "../../cards/PriceTag";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";
import { fetchUnits } from "@/lib/actions";
import Select from "@/components/ui/Select";
import useConversionFactor from "@/lib/hooks/use_conversion_factor";

export const UnitPricingForm = ({
  curr,
  initialValue,
  ad,
  onChange,
}: {
  curr: Currency;
  value: UnitPrice;
  initialValue?: Pricing<UnitPrice>[];
  ad: Listing;
  onChange: (p: Pricing<UnitPrice>[]) => void;
}) => {
  const [discounted, setDiscounted] = useState(false);
  const [newValue, setNewValue] = useState<UnitPrice>({} as UnitPrice);
  const [conversionRatio, setConversionRatio] =
    useState<Record<string, string>>();
  const [pricings, setPricings] = useState<Pricing<UnitPrice>[]>(
    initialValue ?? []
  );
  const [filteredUnit, setFilteredUnit] = useState<Unit>();
  const [fetchingUnits, startFetchingUnits] = useTransition();
  const [showPricingDialog, setShowPricingDialog] = useState(false);
  const [pendingPricing, setPendingPricing] =
    useState<Pricing<UnitPrice> | null>(null);
  const { conversionFactor } = useConversionFactor(
    filteredUnit,
    ad.units,
    newValue.units
  );

  useEffect(() => {
    startFetchingUnits(async () => {
      const { data } = await fetchUnits();
      const unit = data?.find(
        (u) =>
          u.abbr === ad.units ||
          u.sub_units.map((s) => s.abbr).includes(ad.units)
      );

      if (!unit) {
        setFilteredUnit(undefined);
        return;
      }
      setFilteredUnit(unit);
    });
  }, [ad.units]);

  useEffect(() => {
    setNewValue((prev) => ({
      ...prev,
      conversionFactor,
      conversionRatio,
    }));
  }, [conversionRatio, conversionFactor]);

  const setPrice = (e: ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value.replaceAll(",", "")))) {
      return;
    }
    setNewValue({ ...newValue, price: e.target.value });
  };

  const setInitialPrice = (e: ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value.replaceAll(",", "")))) {
      return;
    }
    setNewValue({ ...newValue, initialPrice: e.target.value });
  };

  const handleSave = () => {
    if (!newValue.price || toNumber(newValue.price) === 0) {
      return;
    }

    const newPricing = {
      currency: curr,
      details: newValue,
      scheme: "unit",
    } as Pricing<UnitPrice>;

    // Check if there's existing pricing for the same units
    const existingPricing = pricings.find(
      (pricing) => pricing.details?.units === newValue.units
    );

    if (existingPricing) {
      // Show dialog to confirm replacement
      setPendingPricing(newPricing);
      setShowPricingDialog(true);
    } else {
      // No existing pricing, proceed normally
      const updatedPricings = [...pricings, newPricing];
      setPricings(updatedPricings);
      onChange(updatedPricings);
      setNewValue({} as UnitPrice);
    }
  };

  const handleReplacePricing = () => {
    if (!pendingPricing) return;

    // Remove existing pricing for the same units
    const filteredPricings = pricings.filter(
      (pricing) => pricing.details?.units !== pendingPricing.details?.units
    );

    // Add the new pricing
    const updatedPricings = [...filteredPricings, pendingPricing];
    setPricings(updatedPricings);
    onChange(updatedPricings);

    setShowPricingDialog(false);
    setPendingPricing(null);
    setNewValue({} as UnitPrice);
  };

  const handleCancelPricing = () => {
    setShowPricingDialog(false);
    setPendingPricing(null);
  };

  if (!ad.units) {
    return (
      <div className="w-full bg-amber-50 p-3 rounded-lg shadow-2xl">
        <p className="text-center p-3 text-accent">
          You can not add a unit price to an ad that does not have units. If you
          intend to use unit price, go back and add the quantity and units to
          your ad. Or you can use other pricing schemes.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {pricings.length > 0 && (
        <div className="space-y-2">
          {pricings.map((pricing, index) => (
            <div
              key={index}
              className="flex justify-between gap-3 p-1 px-2 rounded bg-background w-full items-center"
            >
              <PriceTag className="" pricing={pricing} />

              <button
                type="button"
                className="ml-2 p-1 rounded hover:bg-red-100 text-red-500"
                onClick={() => {
                  {
                    setPricings(pricings.filter((p) => p !== pricing));
                    onChange(pricings.filter((p) => p !== pricing));
                  }
                }}
                aria-label="Remove pricing"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-3 py-3">
        <FormGroup label="Price" required className="w-full  text-left">
          <FormInput
            value={newValue?.price ?? ""}
            onChange={setPrice}
            type="text"
            icon={<span className="px-2">{curr}</span>}
            className="px-2 py-1.5 w-full"
          />
        </FormGroup>
        <FormGroup label="Units" required className="w-full  text-left">
          {filteredUnit && (
            <>
              {fetchingUnits ? (
                <div className="w-full bg-secondary animate-pulse py-5 rounded-lg"></div>
              ) : (
                <Select
                  className="text-foreground "
                  triggerStyle="w-full bg-background py-2"
                  value={newValue?.units ?? ""}
                  onChange={(value) => {
                    setNewValue({
                      ...newValue,
                      units: value as string,
                    });
                  }}
                  options={[
                    { label: filteredUnit.plural, value: filteredUnit?.abbr },
                    ...(filteredUnit?.sub_units?.map((sub) => ({
                      label: sub.name + "s",
                      value: sub.abbr,
                    })) ?? []),
                  ]}
                />
              )}
            </>
          )}
        </FormGroup>
      </div>
      {/* Conversion warning */}
      {newValue.units && !conversionFactor && (
        <div className="text-foreground py-2 bg-background text-left px-3 rounded-lg my-3">
          <p className="text-amber-600 text-center p-5">
            Oops! there is no relationship between the two units used. Please
            provide a valid relationship between{" "}
            {ad.units === filteredUnit?.abbr
              ? filteredUnit.plural
              : filteredUnit?.sub_units?.find((u) => u.abbr === ad.units)
                  ?.name + "s"}{" "}
            and{" "}
            {newValue.units === filteredUnit?.abbr
              ? filteredUnit.plural
              : filteredUnit?.sub_units?.find((u) => u.abbr === newValue.units)
                  ?.name + "s"}
          </p>
          <div className="flex gap-3 justify-around p-5 pt-0">
            <FormGroup
              className="w-full max-w-24"
              id="ad-units"
              label={
                ad.units === filteredUnit?.abbr
                  ? filteredUnit.plural
                  : filteredUnit?.sub_units?.find((u) => u.abbr === ad.units)
                      ?.name + "s"
              }
            >
              <FormInput
                type="number"
                id="ad-units"
                value={conversionRatio ? conversionRatio[ad.units] ?? "" : ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setConversionRatio({
                    ...conversionRatio,
                    [ad.units!]: value,
                  });
                }}
                placeholder=" e.g 1"
                min={0}
                wrapperStyle="rounded border-foreground"
              />
            </FormGroup>
            <FormGroup
              className="w-full max-w-24"
              id="new-units"
              label={
                newValue.units === filteredUnit?.abbr
                  ? filteredUnit.plural
                  : filteredUnit?.sub_units?.find(
                      (u) => u.abbr === newValue.units
                    )?.name + "s"
              }
            >
              <FormInput
                type="number"
                id="new-units"
                value={
                  conversionRatio ? conversionRatio[newValue.units] ?? "" : ""
                }
                onChange={(e) => {
                  const value = e.target.value;
                  setConversionRatio({
                    ...conversionRatio,
                    [newValue.units]: value,
                  });
                }}
                placeholder=" e.g 1"
                min={0}
                wrapperStyle="rounded border-foreground"
              />
            </FormGroup>
          </div>
        </div>
      )}

      <FormGroup
        label="Is this price discounted?"
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
        <FormGroup
          label="What was the initial price?"
          required
          className="w-full  text-left"
        >
          <FormInput
            type="text"
            value={newValue?.initialPrice ?? ""}
            onChange={setInitialPrice}
            icon={<span className="px-2">{curr}</span>}
            min={0}
            className="px-3 py-1.5"
          />
        </FormGroup>
      )}
      <Button
        type="button"
        disabled={!(Boolean(newValue.units) && toNumber(newValue.price) > 0)}
        className="bg-secondary/90 w-full mt-3 hover:bg-secondary text-accent disabled:cursor-not-allowed"
        onClick={handleSave}
      >
        Add pricing
      </Button>
      {showPricingDialog && (
        <div className="absolute  w-full h-full top-0 left-0 bg-transparent flex justify-center items-center rounded-lg shadow-lg">
          <div className="w-full max-w-80 bg-yellow-50 rounded-lg shadow-2xl p-5">
            <p className="text-accent text-center mb-4">
              You already have pricing set for "{pendingPricing?.details?.units}
              " units. Do you want to replace the existing pricing with the new
              pricing?
            </p>

            <div className="flex gap-3 justify-center">
              <Button
                onClick={handleCancelPricing}
                className="bg-transparent border border-secondary text-accent hover:bg-secondary/50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleReplacePricing}
                className="bg-primary text-white hover:bg-primary/90"
              >
                Replace Pricing
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
