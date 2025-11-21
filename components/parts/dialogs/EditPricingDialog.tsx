import React, { useEffect, useRef, useState, useTransition } from "react";
import Modal from "../models/Modal";
import { Check, LoaderCircle, Pencil, Plus, Trash, X } from "lucide-react";
import {
  Currency,
  FixedPrice,
  Listing,
  PriceMenu,
  PriceRange,
  Pricing,
  RecurringPrice,
  Scheme,
  Unit,
  UnitPrice,
} from "@/lib/types";
import FormGroup from "@/components/ui/FormGroup";
import Select from "@/components/ui/Select";
import ScrollArea from "../layout/ScrollArea";
import { deletePricing, updatePricings } from "@/lib/actions";
import Button from "@/components/ui/Button";
import { useAppStore } from "@/lib/store";
import MoneyInput from "../forms/MoneyInput";
import PriceTag from "../cards/PriceTag";
import UnitPriceForm from "./forms/UnitPriceForm";
import RecurringPriceForm from "./forms/RecurringPriceForm";
import Dropzone from "@/components/ui/Dopzone";
import Image from "next/image";
import FormInput from "@/components/ui/Input";
import { containsObject } from "@/lib/utils";
import { IoPricetagsOutline } from "react-icons/io5";

export default function EditPricingDialog({
  ad,
  units,
  ads,
  setAds,
}: {
  ad: Listing;
  units: Unit[];
  ads: Listing[];
  setAds: (ads: Listing[]) => void;
}) {
  const schemeDialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const deleteFormRef = useRef<HTMLFormElement>(null);
  const { currency } = useAppStore();

  const [scheme, setScheme] = useState(ad.pricings?.[0]?.scheme);
  const [pricings, setPricings] = useState(ad.pricings ?? []);
  const [curr, setCurr] = useState(currency);

  const [deleting, startDeleting] = useTransition();
  const [saving, startSaving] = useTransition();

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
        setAds(ads.map((a) => (a.id === ad.id ? { ...ad, pricings } : a)));
        formRef.current?.submit();
      }
    });
  };

  return (
    <Modal
      trigger={
        <>
          <IoPricetagsOutline size={15} /> Edit pricing
        </>
      }
      className=""
      header={
        <span className="text-base font-bold max-w-90% line-clamp-1">
          Edit ad pricing.
        </span>
      }
      triggerStyle="p-1 bg-primary w-full hover:bg-orange-400 gap-2 justify-start px-5 text-xs text-white"
    >
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
            unit={
              units.find(
                (u) =>
                  u.name === ad.units ||
                  u.sub_units?.some((su) => su.name === ad.units)
              )!
            }
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
      </ScrollArea>

      <form method="dialog" ref={formRef} className="w-full flex gap-5 p-5">
        <Button className="w-full text-base text-gray-500 bg-transparent border border-gray-500">
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSaveChanges}
          className="w-full text-base text-green-500 bg-transparent border border-green-500"
        >
          {saving ? (
            <LoaderCircle className="animate-spin" size={15} />
          ) : (
            "Save changes"
          )}
        </Button>
      </form>
    </Modal>
  );
}

export const FixedPriceForm = ({
  currency,
  pricings,
  setter,
}: {
  currency: Currency;
  pricings: Pricing<FixedPrice>[];
  setter: (pricings: Pricing<FixedPrice>[]) => void;
}) => {
  const [data, setData] = useState(
    pricings?.[0] ?? { scheme: "fixed", currency, details: {} }
  );

  useEffect(() => {
    setData(pricings[0] ?? { scheme: "fixed", currency });
  }, [pricings]);

  const handleEdit = (money: number) => {
    setData({
      ...data,
      details: {},
      amount: money,
    });

    setter([
      {
        ...data,
        details: {},
        amount: money,
      },
    ]);
  };
  return (
    <div className="space-y-2 w-full py-5">
      <MoneyInput
        money={data.amount ?? ""}
        setMoney={handleEdit}
        currency={currency}
        label="Price"
      />
      <div className="w-fit flex gap-3"></div>
    </div>
  );
};

export const UnitPricingForm = ({
  currency,
  pricings,
  setter,
  unit,
  adUnits,
}: {
  currency: Currency;
  pricings: Pricing<UnitPrice>[];
  setter: (pricings: Pricing<UnitPrice>[]) => void;
  unit?: Unit;
  adUnits: string;
}) => {
  if (!unit) {
    return null;
  }
  return (
    <div className="w-full space-y-3 py-5">
      <div className="flex flex-wrap gap-2 justify-start">
        <UnitPriceForm
          pricings={pricings}
          setPricings={setter}
          unit={unit.plural}
          currency={currency}
          adUnits={adUnits}
        />
        {unit.sub_units?.map((u, i) => (
          <UnitPriceForm
            key={i}
            adUnits={adUnits}
            pricings={pricings}
            setPricings={setter}
            unit={u.plural}
            currency={currency}
          />
        ))}
      </div>
    </div>
  );
};

export const RecurringPricingForm = ({
  currency,
  pricings,
  setter,
}: {
  currency: Currency;
  pricings: Pricing<RecurringPrice>[];
  setter: (pricings: Pricing<RecurringPrice>[]) => void;
}) => {
  const periods = ["year", "month", "week", "day", "hour"];
  return (
    <div className="w-full space-y-5 py-5">
      <div className="flex flex-wrap gap-5">
        {periods.map((p, i) => (
          <RecurringPriceForm
            key={i}
            currency={currency}
            period={p}
            pricings={pricings}
            setPricings={setter}
            olp={pricings.find((pr) => pr.details.period === p)}
          />
        ))}
      </div>
    </div>
  );
};

export const MenuPricingForm = ({
  currency,
  pricings,
  setter,
  pricing,
}: {
  currency: Currency;
  pricings: Pricing<PriceMenu>[];
  setter: (pricings: Pricing<PriceMenu>[]) => void;
  pricing?: Pricing<PriceMenu>;
}) => {
  const [menuItem, setMenuItem] = useState<Pricing<PriceMenu>>(
    pricing ?? ({ scheme: "menu", currency, details: {} } as Pricing<PriceMenu>)
  );
  const addNewPrice = () => {
    if (Boolean(pricing)) {
      setter(pricings.map((p) => (p === pricing ? menuItem : p)));
    } else {
      setter([menuItem, ...pricings]);
    }

    setMenuItem({
      scheme: "menu",
      currency,
      details: {},
    } as Pricing<PriceMenu>);
  };
  const handleNewImages = (imgs: { file: File; dataURL: string }[]) => {
    if (!imgs[0]) {
      return;
    }
    setMenuItem({
      ...menuItem,
      details: { ...menuItem.details, image: imgs[0].dataURL },
    });
  };
  return (
    <div className="p-5">
      <div className="w-full max-w-40 h-36 relative rounded-lg mx-auto border border-gray-300">
        {menuItem?.details?.image ? (
          <Image
            src={menuItem.details.image}
            alt="menu item"
            height={500}
            width={500}
            className="h-full w-full object-fill"
          />
        ) : (
          <p className="text-center w-full break-words text-wrap whitespace-normal m-0 p-5 text-gray-400">
            Click to add the item image
          </p>
        )}
        <Dropzone
          onFilesChange={handleNewImages}
          className="w-full absolute top-0 left-0 h-full rounded-lg opacity-0 text-gray-300 bg-gray-100 flex justify-center items-center"
        />
      </div>
      <div className="space-y-3 text-gray-500">
        <MoneyInput
          money={menuItem.amount ?? ""}
          currency={currency}
          setMoney={(m) => setMenuItem({ ...menuItem, amount: m })}
        />
        <FormGroup label="Item title" required className="">
          <FormInput
            type="text"
            value={menuItem?.details?.title ?? ""}
            onChange={(e) =>
              setMenuItem({
                ...menuItem,
                details: { ...menuItem.details, title: e.target.value },
              })
            }
          />
        </FormGroup>
        <FormGroup label="Item description" className="">
          <textarea
            value={menuItem.details?.description ?? ""}
            onChange={(e) =>
              setMenuItem({
                ...menuItem,
                details: {
                  ...menuItem.details,
                  description: e.target.value,
                },
              })
            }
            className="resize-none active:ring-0 outline-0 px-3 py-2 focus:ring-0 border-gray-200 border hover:border-primary focus:border-primary rounded-lg"
          />
        </FormGroup>
      </div>
      <form method="dialog" className="w-full flex gap-5 pt-5">
        <Button className="w-full text-base text-gray-500 bg-transparent border border-gray-500">
          Cancel
        </Button>
        <Button
          onClick={addNewPrice}
          className="w-full text-base text-green-500 bg-transparent border border-green-500"
        >
          Add menu
        </Button>
      </form>
    </div>
  );
};

export const RangePricingForm = ({
  currency,
  pricings,
  setter,
  specs,
  pricing,
}: {
  currency: Currency;
  pricings: Pricing<PriceRange>[];
  setter: (pricings: Pricing<PriceRange>[]) => void;
  specs: Record<string, string>;
  pricing?: Pricing<PriceRange>;
}) => {
  // Get comma-separated spec keys
  const commaSeparatedSpecs = Object.entries(
    specs as Record<string, any>
  ).filter(([_, value]) => typeof value === "string" && value.includes(","));

  const dialogRef = useRef<HTMLDialogElement>(null);

  const [newValue, setNewValue] = useState<Pricing<PriceRange>>(
    pricing ??
      ({
        scheme: "range",
        currency,
        details: {},
      } as Pricing<PriceRange>)
  );
  const [pricingSpecs, setPricingSpecs] = useState<Record<string, string>>(
    pricing?.details.specs ?? {}
  );

  const handleSave = () => {
    if (!newValue.amount || newValue.amount === 0) {
      return;
    }

    if (Boolean(pricing)) {
      setter(pricings.map((p) => (p === pricing ? newValue : p)));
      setNewValue({
        scheme: "range",
        currency,
        details: {},
      } as Pricing<PriceRange>);
      return;
    }

    if (
      containsObject(
        pricings.map((p) => p.details.specs),
        newValue.details.specs
      )
    ) {
      if (dialogRef.current) {
        dialogRef.current.showModal();
      }
      return;
    }

    setter([newValue, ...pricings]);
    setNewValue({
      scheme: "range",
      currency,
      details: {},
    } as Pricing<PriceRange>);
  };

  return (
    <div className="px-5 py-2">
      <FormGroup
        label="Price determinats"
        labelStyle="font-bold"
        required
        className="w-full border-gray-300 text-left border text-gray-500 rounded-lg p-2"
      >
        <p className="text-xs text-gray-500">
          Select the specifications that determine the price for this product.
        </p>
        <div className="flex flex-wrap gap-2 border-gray-500 py-2">
          {commaSeparatedSpecs.length > 0 ? (
            commaSeparatedSpecs.map((s) => {
              const [key, value] = s;
              return (
                <Button
                  type="button"
                  key={key}
                  className={`px-2 py-1 rounded-full capitalize text-xs ${
                    pricingSpecs[key]
                      ? "bg-gray-500 text-background"
                      : "bg-gray-100 text-gray-500"
                  }`}
                  onClick={() => {
                    if (pricingSpecs[key]) {
                      const newSpecs = { ...pricingSpecs };
                      delete newSpecs[key];
                      setPricingSpecs(newSpecs);

                      if (
                        newValue.details.specs &&
                        newValue.details.specs[key]
                      ) {
                        const newSelectedSpecs = {
                          ...newValue.details.specs,
                        };
                        delete newSelectedSpecs[key];
                        setNewValue({
                          ...newValue,
                          details: {
                            ...newValue.details,
                            specs: newSelectedSpecs,
                          },
                        });
                      }
                      return;
                    }
                    setPricingSpecs({ ...pricingSpecs, [key]: value });
                  }}
                >
                  {key}
                </Button>
              );
            })
          ) : (
            <p className="text-xs text-yellow-500">
              Oops, there no specifications that pricing may base on. Please add
              one or more comma seperated specifications in the step one.
            </p>
          )}
        </div>
      </FormGroup>
      {Array.from(Object.entries(pricingSpecs)).length > 0 && (
        <div className="flex flex-wrap gap-2 py-5">
          {Array.from(Object.entries(pricingSpecs)).map(([key, value], i) => (
            <FormGroup
              label={`${key}:`}
              key={i}
              labelStyle="capitalize text-gray-500 text-xs"
            >
              <Select
                placeholder={key}
                options={value.split(",").map((v) => ({ label: v, value: v }))}
                value={newValue.details?.specs?.[key] ?? ""}
                onChange={(s) => {
                  setNewValue({
                    ...newValue,
                    details: {
                      ...newValue.details,
                      specs: { ...newValue.details.specs, [key]: s },
                    },
                  });
                }}
                triggerStyle="bg-gray-200 text-gray-500"
              />
            </FormGroup>
          ))}
          <FormGroup
            label="Quantity available"
            labelStyle="text-xs"
            required
            className="text-left text-xs text-gray-500"
          >
            <FormInput
              value={newValue?.details.qty ?? ""}
              onChange={(e) => {
                if (isNaN(Number(e.target.value.replaceAll(",", "")))) {
                  return;
                }
                setNewValue({
                  ...newValue,
                  details: {
                    ...newValue.details,
                    qty: Number(e.target.value),
                  },
                });
              }}
              type="text"
              className="text-xs"
            />
          </FormGroup>
        </div>
      )}
      <div className="w-full space-y-5">
        {
          // If all newValue.specs values are selected

          newValue.details.specs &&
          Object.keys(newValue.details.specs).length ===
            Object.keys(pricingSpecs).length &&
          Object.values(newValue.details.specs).every(
            (v) => v && v.length > 0
          ) ? (
            <div className="flex gap-5 w-full text-gray-500">
              <MoneyInput
                money={newValue.amount ?? ""}
                setMoney={(m) => {
                  setNewValue({ ...newValue, amount: m });
                }}
                currency={currency}
              />
            </div>
          ) : null
        }
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
                  setter(
                    pricings.map((p) =>
                      containsObject([p.details.specs], newValue.details.specs)
                        ? newValue
                        : p
                    )
                  );
                  setNewValue({
                    scheme: "range",
                    currency,
                    details: {},
                  } as Pricing<PriceRange>);
                }}
                className="bg-primary hover:bg-primary/90 text-background min-w-24"
              >
                Replace
              </Button>
            </div>
          </form>
        </div>
      </dialog>
      <form method="dialog" className="w-full pt-5 pb-2 flex gap-5">
        <Button
          type="submit"
          className="bg-secondary/90 hover:bg-secondary text-accent disabled:cursor-not-allowed w-full"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!newValue.amount || newValue.amount === 0}
          className="bg-secondary/90 hover:bg-secondary text-accent disabled:opacity-40 w-full"
          onClick={handleSave}
        >
          Add pricing
        </Button>
      </form>
    </div>
  );
};
