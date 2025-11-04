import React, { useRef, useState, useTransition } from "react";
import ScrollArea from "../layout/ScrollArea";
import FormGroup from "@/components/ui/FormGroup";
import Select from "@/components/ui/Select";
import {
  FixedPriceForm,
  MenuPricingForm,
  RangePricingForm,
  RecurringPricingForm,
  UnitPricingForm,
} from "../dialogs/EditPricingDialog";
import Modal from "../models/Modal";
import PriceTag from "../cards/PriceTag";
import { ChevronLeft, ChevronRight, LoaderCircle, Trash } from "lucide-react";
import Button from "@/components/ui/Button";
import { Listing, Pricing, Scheme, Unit } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { deletePricing, updatePricings } from "@/lib/actions";

export default function PricingForm({
  ad,
  units,
  setter,
  handleNext,
  handlePrevious,
}: {
  ad: Listing;
  units?: Unit[];
  setter: (pricings: Pricing<any>[]) => void;
  handleNext: () => void;
  handlePrevious: () => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const deleteFormRef = useRef<HTMLFormElement>(null);
  const { currency } = useAppStore();

  const [scheme, setScheme] = useState(ad.pricings?.[0]?.scheme);
  const [pricings, setPricings] = useState(ad.pricings ?? []);
  const [curr, setCurr] = useState(currency);

  const [deleting, startDeleting] = useTransition();
  const [saving, startSaving] = useTransition();

  const unit = units?.find(
    (u) =>
      u.name.toLowerCase() === ad.units?.toLowerCase() ||
      u.plural.toLowerCase() === ad.units?.toLowerCase() ||
      u.sub_units?.some((u) => u.name.toLowerCase() === ad.units?.toLowerCase())
  );

  const deleteExistingPricing = (p: Pricing<any>) => {
    startDeleting(async () => {
      if (!p.id) {
        setPricings(pricings.filter((d) => d !== p));
        deleteFormRef.current?.submit();
        return;
      }
      const { error } = await deletePricing(p.id);
      if (error) {
        return;
      }

      setPricings(pricings.filter((d) => d.id !== p.id));
      deleteFormRef.current?.submit();
    });
  };

  const handleChangeOfScheme = async (newScheme: string) => {
    if (pricings.length > 0) {
      const res = confirm(
        `Changing the pricing scheme from ${scheme} to  ${newScheme} deletes all the ad pricings and you will be required to create new pricings to the ad.`
      );

      if (res) {
        const promises = pricings.map(async (p) => {
          deleteExistingPricing(p);
        });
        await Promise.all(promises);
      }
    }
    setPricings([]);
    setScheme(newScheme as Scheme);
  };

  const handleSaveChanges = () => {
    startSaving(async () => {
      const { data, error } = await updatePricings(
        pricings.map((p) => ({ ...p, ad_id: ad.id }))
      );
      console.log({ data, error });

      if (!error) {
      }
    });
  };

  const next = () => {
    setter(pricings);
    if (handleNext) {
      handleNext();
    }
  };
  return (
    <div className="w-full text-left">
      <ScrollArea maxHeight="100%" className="w-full h-72 px-5 text-gray-500">
        <div className="flex gap-5">
          <FormGroup label="Pricing scheme" className="w-full" required>
            <Select
              placeholder="Select a pricing scheme"
              triggerStyle="w-full py-1 text-base"
              value={scheme ?? ""}
              options={[
                { label: "Fixed pricing", value: "fixed" },
                { label: "Unit pricing", value: "unit" },
                { label: "Recurring pricing", value: "recurring" },
                { label: "Menu pricing", value: "menu" },
                { label: "Range pricing", value: "range" },
              ]}
              onChange={handleChangeOfScheme}
            />
          </FormGroup>
          <FormGroup label="Currency" className="w-fit" required>
            <Select
              placeholder="Select a currency"
              className="w-full"
              triggerStyle="w-full py-1 text-base"
              value={curr ?? ""}
              options={[
                { label: "UGX", value: "UGX" },
                { label: "KSH", value: "KSH" },
                { label: "TSH", value: "TSH" },
                { label: "USD", value: "USD" },
              ]}
              onChange={setCurr}
            />
          </FormGroup>
        </div>
        {scheme === "fixed" ? (
          <FixedPriceForm
            pricings={pricings}
            setter={setPricings}
            currency={curr}
          />
        ) : scheme === "unit" ? (
          <UnitPricingForm
            adUnits={ad.units!}
            pricings={pricings}
            setter={setPricings}
            currency={curr}
            unit={unit}
          />
        ) : scheme === "recurring" ? (
          <RecurringPricingForm
            pricings={pricings}
            setter={setPricings}
            currency={curr}
          />
        ) : scheme === "menu" ? (
          <div className="py-5 w-full">
            <Modal
              trigger="Create a new menu item"
              header="Creat menu item"
              triggerStyle="text-base w-full bg-primary text-background hover:bg-orange-400"
            >
              <MenuPricingForm
                pricings={pricings}
                setter={setPricings}
                currency={curr}
              />
            </Modal>
          </div>
        ) : scheme === "range" ? (
          <div className="py-5 w-full">
            <Modal
              trigger="Add a new price"
              header="Add a price range"
              className="max-w-80 mt-10"
              triggerStyle="text-base w-full bg-primary text-background hover:bg-orange-400"
            >
              <ScrollArea className="py-0">
                <RangePricingForm
                  pricings={pricings}
                  setter={setPricings}
                  currency={curr}
                  specs={(ad.specs ?? {}) as Record<string, string>}
                />
              </ScrollArea>
            </Modal>
          </div>
        ) : null}
        <div className="space-y-2">
          {pricings.map((p, i) => (
            <div
              key={i}
              className="w-full rounded-lg flex justify-between items-center gap-2 pr-4 bg-gray-100 "
            >
              <div className="w-full">
                {scheme === "menu" ? (
                  <Modal
                    trigger={
                      <div className="flex gap-2 rounded-lg w-full overflow-hidden">
                        <div className="w-20 bg-secondary"></div>
                        <div className="w-full py-2">
                          <h1 className="text-gray-500 font-bold">
                            {p.details.title}
                          </h1>
                          <p className="text-gray-500">
                            {p.details.description}
                          </p>
                          <PriceTag pricing={p} />
                        </div>
                      </div>
                    }
                    triggerStyle="w-full text-left p-0 bg-gray-100 hover:bg-gray-200"
                    header={`Edit ${p.details.title}`}
                  >
                    <MenuPricingForm
                      pricings={pricings}
                      setter={setPricings}
                      currency={curr}
                      pricing={p}
                    />
                  </Modal>
                ) : scheme === "range" ? (
                  <Modal
                    trigger={
                      <div className="w-full py-2 px-4">
                        <PriceTag pricing={p} />
                        <div className="flex flex-wrap gap-2 w-full">
                          {Array.from(
                            Object.entries(p.details.specs ?? {})
                          ).map(([k, v], im) => (
                            <p
                              key={im}
                              className=" text-xs text-gray-400 border-r pr-2 last:border-r-0"
                            >
                              <span className="capitalize">{k}</span>:{" "}
                              {v as string}
                            </p>
                          ))}
                        </div>
                      </div>
                    }
                    header="Add a price range"
                    className="max-w-80 mt-10"
                    triggerStyle="w-full bg-transparent hover:bg-gray-200"
                  >
                    <ScrollArea className="py-0">
                      <RangePricingForm
                        pricings={pricings}
                        pricing={p}
                        setter={setPricings}
                        currency={curr}
                        specs={(ad.specs ?? {}) as Record<string, string>}
                      />
                    </ScrollArea>
                  </Modal>
                ) : (
                  <div className="px-4 py-2">
                    <PriceTag pricing={p} />
                  </div>
                )}
              </div>
              <Modal
                className="max-w-80 mt-20"
                header="Delete pricing"
                trigger={<Trash size={15} />}
                triggerStyle="p-0 bg-transparent transition-all hover:scale-120 bg-red-50 text-error"
              >
                <div className="p-5 w-full">
                  <PriceTag pricing={p} />
                  <p className="text-gray-400 text-base font-thin w-full break-words text-wrap whitespace-normal m-0">
                    Are you sure you want to delete this pricing?
                  </p>
                  <form
                    method="dialog"
                    ref={deleteFormRef}
                    className="w-full flex gap-5 p-5"
                  >
                    <Button className="w-full text-base hover:bg-gray-50 text-gray-500 bg-transparent border border-gray-500">
                      No
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        deleteExistingPricing(p);
                      }}
                      className="w-full text-base text-red-500 bg-transparent border border-red-500 hover:bg-red-50"
                    >
                      {deleting ? (
                        <LoaderCircle size={15} className="animate-spin" />
                      ) : (
                        "Yes"
                      )}
                    </Button>
                  </form>
                </div>
              </Modal>
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          <Button
            type="button"
            onClick={handlePrevious}
            className=" transform bg-primary/80 text-white p-2 px-5 w-40 gap-5 rounded-full hover:bg-primary transition"
            aria-label="Next step"
          >
            <ChevronLeft size={15} />
            Previous
          </Button>
          {pricings.length > 0 && (
            <Button
              type="button"
              onClick={next}
              className=" transform bg-primary/80 text-white p-2 px-5 w-40 gap-5 rounded-full hover:bg-primary transition"
              aria-label="Next step"
            >
              {" "}
              Next
              <ChevronRight size={15} />
            </Button>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
