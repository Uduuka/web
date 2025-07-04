"use client";

import Button from "@/components/ui/Button";
import {
  Category,
  FixedPrice,
  Listing,
  MenuItem,
  PriceMenu,
  PriceRange,
  Pricing,
  RecurringPrice,
  UnitPrice,
} from "@/lib/types";
import React, {
  ChangeEvent,
  ComponentProps,
  useEffect,
  useState,
  useTransition,
} from "react";
import ScrollArea from "../layout/ScrollArea";
import Select from "@/components/ui/Select";
import FormGroup from "@/components/ui/FormGroup";
import FormInput from "@/components/ui/Input";
import env from "@/lib/env";
import { useAppStore } from "@/lib/store";
import { FixedPriceTag } from "../cards/PriceTag";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "./dropzone";
import { useSupabaseUpload } from "@/lib/hooks/use_supabase_upload";
import { fetchCategories } from "@/lib/actions";

interface AdFormProps extends ComponentProps<"form"> {
  defaultAd?: Listing;
}

export default function CreateAdForm({ defaultAd }: AdFormProps) {
  const { currency, location, user } = useAppStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [ad, setAd] = useState<Listing>(defaultAd ?? ({} as Listing));
  const [pricing, setPricing] = useState<Pricing<any>>({ currency } as any);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [spects, setSpects] = useState<string[]>([]);
  const [adSpects, setAdSpects] = useState<any>({});

  const setCurrent = (index: number) => {
    setCurrentStep(index);
  };

  const next = () => {
    currentStep < 4 ? setCurrent(currentStep + 1) : setCurrent(0);
  };

  const prev = () => {
    currentStep > 0 ? setCurrent(currentStep - 1) : setCurrent(0);
  };

  const [fetchingCategories, startFetchingCategories] = useTransition();

  useEffect(() => {
    startFetchingCategories(async () => {
      const { data } = await fetchCategories();

      if (!data) {
        return;
      }

      setCategories(data);
    });
  }, []);

  useEffect(() => {
    const category = categories.find((cat) => cat.id === ad.category_id);
    const subCategory = category?.sub_categories?.find(
      (sb) => sb.id === ad.sub_category_id
    );

    if (!category || !subCategory) {
      setSpects([]);
      return;
    }

    const specs =
      category.default_specs ?? "".concat(subCategory.default_specs ?? "");

    setSpects(specs.split(",").map((s) => s.trim()));
    setAdSpects({});
  }, [categories, ad.category_id, ad.sub_category_id]);

  const handleSubmit = async () => {
    if (!user) {
      setError("The user is undefined");
      return;
    }
    ad.seller_id = user.id;
    ad.specs = adSpects;
    ad.pricing = pricing;

    console.log(ad);
  };

  return (
    <form
      action={handleSubmit}
      className="flex overflow-hidden flex-col gap-5 p-5"
    >
      <h1 className="text-center">Progress: stage {currentStep + 1}</h1>
      <div className="flex items-center w-full max-w-60 mx-auto gap-1">
        <Button
          type="button"
          onClick={() => setCurrentStep(0)}
          className={`h-3 p-0 bg-transparent aspect-square border rounded-full flex justify-center items-center text-xs ${
            currentStep > 0
              ? "bg-primary border-primary"
              : currentStep === 0
              ? "border-primary"
              : ""
          }`}
        ></Button>
        <div
          className={`w-full border-b ${
            currentStep > 0 ? "border-primary" : "border-secondary"
          }`}
        ></div>
        <Button
          type="button"
          onClick={() => setCurrentStep(1)}
          className={`h-3 p-0 bg-transparent aspect-square border rounded-full flex justify-center items-center text-xs
            ${
              currentStep > 1
                ? "bg-primary border-primary"
                : currentStep === 1
                ? "border-primary"
                : ""
            }`}
        ></Button>
        <div
          className={`w-full border-b ${
            currentStep > 1 ? "border-primary" : "border-secondary"
          }`}
        ></div>
        <Button
          type="button"
          onClick={() => setCurrentStep(2)}
          className={`h-3 p-0 bg-transparent aspect-square border rounded-full flex justify-center items-center text-xs ${
            currentStep > 2
              ? "bg-primary border-primary"
              : currentStep === 2
              ? "border-primary"
              : ""
          }`}
        ></Button>
        <div
          className={`w-full border-b ${
            currentStep > 2 ? "border-primary" : "border-secondary"
          }`}
        ></div>
        <Button
          type="button"
          onClick={() => setCurrentStep(3)}
          className={`h-3 p-0 bg-transparent aspect-square border rounded-full flex justify-center items-center text-xs ${
            currentStep > 3
              ? "border-primary bg-primary"
              : currentStep === 3
              ? "border-primary"
              : ""
          }`}
        ></Button>
      </div>
      <div
        className="relative flex flex-col justify-between h-[90vh] overflow-hidden"
        role="region"
      >
        <div
          className="flex w-full h-[70vh] transition-transform duration-300"
          style={{ transform: `translateX(-${currentStep * 100}%)` }}
        >
          {/* Step one */}
          <div className="w-full text-center text-background/80 flex-shrink-0 pt-10">
            <h1 className="">Step one:</h1>
            <p className="text-xs font-thin py-2">
              Select the category and sub-category of your advert.
            </p>
            <div className="py-5 flex flex-col gap-5 w-full max-w-80 mx-auto pt-10">
              <FormGroup
                label="Category"
                required
                className="text-left w-full  "
              >
                <Select
                  placeholder="Select a category"
                  options={categories.map((cat) => ({
                    value: cat.id,
                    label: cat.name,
                  }))}
                  className="w-full  text-foreground "
                  triggerStyle="w-full   bg-background py-2"
                  value={ad.category_id}
                  onChange={(v) => {
                    setAd({ ...ad, category_id: v });
                  }}
                />
              </FormGroup>
              <FormGroup
                label="Sub-category"
                required
                className="text-left w-full "
              >
                <Select
                  disabled={!Boolean(ad.category_id)}
                  placeholder="Select a sub-category"
                  options={
                    categories
                      .find((cate) => cate.id === ad.category_id)
                      ?.sub_categories?.map((subCate) => ({
                        value: subCate.id,
                        label: subCate.name,
                      })) ?? []
                  }
                  className="w-full  text-foreground "
                  triggerStyle="w-full   bg-background py-2"
                  value={ad.sub_category_id}
                  onChange={(v) => {
                    setAd({ ...ad, sub_category_id: v });
                  }}
                />
              </FormGroup>
            </div>
          </div>

          {/* Step two */}
          <div className="w-full text-center text-background/80 h-full flex-shrink-0">
            <ScrollArea
              maxHeight="100%"
              className="bg-foreground-50/20 focus:ring-0 active:ring-0 h-full px-5"
            >
              <h1>Step two:</h1>
              <p className="text-xs font-thin py-2">
                Provide the title or name and description of your advert.
              </p>
              <div className="py-5 flex flex-col gap-5 w-full pt-10">
                <FormGroup
                  label="Title"
                  required
                  className="text-left   w-full"
                >
                  <FormInput
                    className="px-3 py-1.5 w-full"
                    value={ad.title ?? ""}
                    onChange={(e) => setAd({ ...ad, title: e.target.value })}
                    placeholder="Title or name of the advert"
                  />
                </FormGroup>
                <FormGroup
                  label="Description"
                  required
                  className="text-left   w-full"
                >
                  <textarea
                    cols={5}
                    value={ad.description ?? ""}
                    onChange={(e) =>
                      setAd({ ...ad, description: e.target.value })
                    }
                    className="px-3 py-1.5 w-full h-40 rounded-lg border border-background hover:border-primary active:border-primary focus:border-primary transition-colors outline-0 focus:outline-0 ring-0 resize-none"
                    placeholder="Describe your product or service"
                  />
                </FormGroup>
                <FormGroup
                  label="Specifications"
                  className="text-left   w-full"
                >
                  <div className="rounded-lg p-5 min-h-40 border hover:border-primary focus-within:border-primary flex flex-wrap gap-5">
                    {spects.map((s, i) => (
                      <div
                        key={i}
                        className="w-fit flex flex-col justify-center items-center"
                      >
                        <input
                          id={s}
                          value={adSpects[s] ?? ""}
                          onChange={(e) =>
                            setAdSpects({ ...adSpects, [s]: e.target.value })
                          }
                          className="px-3 py-1 outline-0 focus:outline-0 border-b border-accent/60 w-fit text-center"
                        />
                        <label htmlFor={s} className="text-secondary/60">
                          {s}
                        </label>
                      </div>
                    ))}
                  </div>
                </FormGroup>
              </div>
            </ScrollArea>
          </div>

          {/* Step three */}
          <div className="w-full text-center text-background/80 h-96 flex-shrink-0 pt-10">
            <h1 className="">Step three:</h1>
            <p className="text-xs font-thin py-2">
              Upload clean and clear images of what your selling.
            </p>
            <FileUploadForm />
          </div>

          {/* Step four */}
          <div className="w-full text-center text-background/80 h-full flex-shrink-0">
            <ScrollArea
              maxHeight="100%"
              className="bg-foreground-50/20 focus:ring-0 active:ring-0 h-full px-5"
            >
              <h1 className="">Step four:</h1>
              <p className="text-xs font-thin py-2">
                Set the pricing for your advert
              </p>
              <div className="py-5 flex flex-col gap-5 w-full pt-10">
                <div className="flex gap-5 w-full">
                  <FormGroup
                    label="Currency"
                    required
                    className="w-full  text-left"
                  >
                    <Select
                      options={env.currencyOptions}
                      className="text-foreground "
                      triggerStyle="w-full bg-background py-2"
                      value={pricing.currency ?? currency}
                      onChange={(v) => {
                        setPricing({ ...pricing, currency: v });
                      }}
                    />
                  </FormGroup>
                  <FormGroup
                    label="Pricing scheme"
                    required
                    className="w-full  text-left"
                  >
                    <Select
                      placeholder="Select a pricing scheme"
                      options={env.pricingSchemes}
                      className="text-foreground "
                      triggerStyle="w-full bg-background py-2"
                      value={pricing.scheme}
                      onChange={(v) => {
                        setPricing({ ...pricing, scheme: v });
                      }}
                    />
                  </FormGroup>
                </div>

                {pricing.scheme === "fixed" && (
                  <FixedPriceForm
                    curr={pricing.currency ?? currency}
                    value={pricing.details}
                    onChange={(d) => setPricing({ ...pricing, details: d })}
                  />
                )}
                {pricing.scheme === "range" && (
                  <PriceRangeForm
                    curr={pricing.currency ?? currency}
                    value={pricing.details}
                    onChange={(pr) => setPricing({ ...pricing, details: pr })}
                  />
                )}
                {pricing.scheme === "unit" && (
                  <UnitPriceForm
                    curr={pricing.currency ?? currency}
                    value={pricing.details}
                    onChange={(up) => setPricing({ ...pricing, details: up })}
                  />
                )}
                {pricing.scheme === "recurring" && (
                  <RecurringPriceForm
                    curr={pricing.currency ?? currency}
                    value={pricing.details}
                    onChange={(rp) => setPricing({ ...pricing, details: rp })}
                  />
                )}
                {pricing.scheme === "menu" && (
                  <PriceMenuForm
                    curr={pricing.currency ?? currency}
                    value={pricing.details}
                    onChange={(pm) => setPricing({ ...pricing, details: pm })}
                  />
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Step five */}
          <div className="w-full text-center text-background/80 h-full flex-shrink-0">
            <ScrollArea
              maxHeight="100%"
              className="outline-0 focus-within:outline-0 active:outline-0 focus:ring-0 active:ring-0 h-full px-5"
            >
              <h1 className="">Step five:</h1>
              <p className="text-xs font-thin py-2">
                Provide address and location info of your product or service.
              </p>
              <FormGroup
                label="Geo-location coordinates"
                className="w-full text-left flex pt-5 flex-col"
              >
                <p className="text-primary">
                  [{location?.longitude}, {location?.latitude}]
                </p>
              </FormGroup>
              <FormGroup
                label="Physical address"
                className="w-full text-left pt-5"
              >
                <textarea className="w-full resize-none border hover:border-primary focus:border-primary transition-colors outline-0 focus:ring-0 active:outline-0 rounded-lg px-3 py-2"></textarea>
              </FormGroup>
            </ScrollArea>
          </div>
        </div>
        <div className="flex justify-between px-5">
          {currentStep > 0 ? (
            <Button
              onClick={prev}
              type="button"
              className="transform bg-primary/80 text-white p-2 px-5 w-40 gap-5 rounded-full hover:bg-primary transition"
              aria-label="Previous step"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous
            </Button>
          ) : (
            <div className=""></div>
          )}
          {currentStep === 4 ? (
            <Button className="transform bg-primary/80 text-white p-2 px-5 w-40 gap-5 rounded-full hover:bg-primary transition">
              Submit
            </Button>
          ) : (
            <Button
              onClick={next}
              type="button"
              className=" transform bg-primary/80 text-white p-2 px-5 w-40 gap-5 rounded-full hover:bg-primary transition"
              aria-label="Next step"
            >
              Next
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}

const FixedPriceForm = ({
  curr,
  value,
  onChange,
}: {
  curr: string;
  value: FixedPrice;
  onChange: (p: FixedPrice) => void;
}) => {
  const [discounted, setDiscounted] = useState(false);
  const [newValue, setNewValue] = useState<FixedPrice>(
    value ?? ({} as FixedPrice)
  );

  const setPrice = (e: ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value.replaceAll(",", "")))) {
      return;
    }
    setNewValue({ ...newValue, price: e.target.value });
    onChange({ ...newValue, price: e.target.value.replaceAll(",", "") });
  };
  const setInitialPrice = (e: ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value.replaceAll(",", "")))) {
      return;
    }
    setNewValue({ ...newValue, initialPrice: e.target.value });
    onChange({ ...newValue, initialPrice: e.target.value.replaceAll(",", "") });
  };

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
    </>
  );
};

const PriceRangeForm = ({
  curr,
  value,
  onChange,
}: {
  curr: string;
  value: PriceRange;
  onChange: (p: PriceRange) => void;
}) => {
  const [discounted, setDiscounted] = useState(false);
  const [newValue, setNewValue] = useState<PriceRange>(
    value ?? ({} as PriceRange)
  );

  const setMinPrice = (e: ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value.replaceAll(",", "")))) {
      return;
    }
    setNewValue({ ...newValue, minPrice: e.target.value });
    onChange({ ...newValue, minPrice: e.target.value.replaceAll(",", "") });
  };

  const setMaxPrice = (e: ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value.replaceAll(",", "")))) {
      return;
    }
    setNewValue({ ...newValue, maxPrice: e.target.value });
    onChange({ ...newValue, maxPrice: e.target.value.replaceAll(",", "") });
  };

  const setInitialMinPrice = (e: ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value.replaceAll(",", "")))) {
      return;
    }
    setNewValue({ ...newValue, initialMinPrice: e.target.value });
    onChange({
      ...newValue,
      initialMinPrice: e.target.value.replaceAll(",", ""),
    });
  };

  const setInitialMaxPrice = (e: ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value.replaceAll(",", "")))) {
      return;
    }
    setNewValue({ ...newValue, initialMaxPrice: e.target.value });
    onChange({
      ...newValue,
      initialMaxPrice: e.target.value.replaceAll(",", ""),
    });
  };

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
    </>
  );
};

const UnitPriceForm = ({
  curr,
  value,
  onChange,
}: {
  curr: string;
  value: UnitPrice;
  onChange: (p: UnitPrice) => void;
}) => {
  const [discounted, setDiscounted] = useState(false);
  const [newValue, setNewValue] = useState<UnitPrice>(
    value ?? ({} as UnitPrice)
  );

  const setPrice = (e: ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value.replaceAll(",", "")))) {
      return;
    }
    setNewValue({ ...newValue, price: e.target.value });
    onChange({ ...newValue, price: e.target.value.replaceAll(",", "") });
  };

  const setUnits = (e: ChangeEvent<HTMLInputElement>) => {
    setNewValue({ ...newValue, units: e.target.value });
    onChange({ ...newValue, units: e.target.value });
  };

  const setInitialPrice = (e: ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value.replaceAll(",", "")))) {
      return;
    }
    setNewValue({ ...newValue, initialPrice: e.target.value });
    onChange({ ...newValue, initialPrice: e.target.value.replaceAll(",", "") });
  };

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
        <FormGroup label="Units" required className="w-full  text-left">
          <FormInput
            value={newValue?.units ?? ""}
            onChange={setUnits}
            type="text"
            className="px-2 py-1.5 w-full"
          />
        </FormGroup>
      </div>
      <div className="flex gap-5">
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
      </div>
    </>
  );
};

const RecurringPriceForm = ({
  curr,
  value,
  onChange,
}: {
  curr: string;
  value: RecurringPrice;
  onChange: (p: RecurringPrice) => void;
}) => {
  const [discounted, setDiscounted] = useState(false);
  const [newValue, setNewValue] = useState<RecurringPrice>(
    value ?? ({} as RecurringPrice)
  );

  const setPrice = (e: ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value.replaceAll(",", "")))) {
      return;
    }
    setNewValue({ ...newValue, price: e.target.value });
    onChange({ ...newValue, price: e.target.value.replaceAll(",", "") });
  };

  const setPeriod = (e: string) => {
    setNewValue({ ...newValue, period: e });
    onChange({ ...newValue, period: e });
  };

  const setInitialPrice = (e: ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value.replaceAll(",", "")))) {
      return;
    }
    setNewValue({ ...newValue, initialPrice: e.target.value });
    onChange({ ...newValue, initialPrice: e.target.value.replaceAll(",", "") });
  };

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
      <div className="flex gap-5">
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
      </div>
    </>
  );
};

const PriceMenuForm = ({
  curr,
  value,
  onChange,
}: {
  curr: string;
  value: PriceMenu;
  onChange: (p: MenuItem[]) => void;
}) => {
  const [discounted, setDiscounted] = useState(false);
  const [items, setItems] = useState<MenuItem[]>(value?.items ?? []);
  const [cItem, setCItem] = useState<MenuItem>({} as MenuItem);
  const { currency } = useAppStore();

  const setPrice = (e: ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value.replaceAll(",", "")))) {
      return;
    }
    setCItem({ ...cItem, price: e.target.value });
  };

  const setInitailPrice = (e: ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value.replaceAll(",", "")))) {
      return;
    }
    setCItem({ ...cItem, initialPrice: e.target.value });
  };

  const addToList = () => {
    if (!cItem.title || !cItem.price) {
      return;
    }
    setItems([...items, cItem]);
    onChange([...items, cItem]);
    setCItem({} as MenuItem);
  };
  return (
    <div className="w-full flex">
      <FormGroup label="Price menu items" className="w-full text-left">
        <div className="border rounded-lg hover:border-primary w-full focus-within:border-primary">
          <div className="space-y-2 border-b p-5">
            {items.length === 0 && (
              <div className="p-5 text-center">
                <p className="w-full max-w-72 text-xs mx-auto fornt-light text-background/50">
                  The price menu is empty. Use the form below to add items here.
                </p>
              </div>
            )}
            {items.map((item, index) => (
              <div
                key={index}
                className="flex gap-2 rounded-lg overflow-hidden"
              >
                <div className="w-20 bg-secondary"></div>
                <div className="w-full">
                  <span className="text-xs text-background/80">
                    {item.title}
                  </span>
                  <div className="text-primary">
                    <FixedPriceTag
                      pricing={{
                        scheme: "fixed",
                        currency,
                        details: {
                          price: item.price,
                          initialPrice: item.initialPrice,
                        },
                      }}
                    />
                  </div>
                  <span className="text-xs text-background/70 font-light">
                    {item.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-5 space-y-5">
            <FormGroup label="Item title" required className="">
              <FormInput
                type="text"
                value={cItem.title ?? ""}
                onChange={(e) => setCItem({ ...cItem, title: e.target.value })}
              />
            </FormGroup>
            <FormGroup label="Item description" className="">
              <textarea
                value={cItem?.description ?? ""}
                onChange={(e) =>
                  setCItem({ ...cItem, description: e.target.value })
                }
                className="resize-none active:ring-0 outline-0 px-3 py-2 focus:ring-0 border hover:border-primary focus:border-primary rounded-lg"
              ></textarea>
            </FormGroup>
            <div className="flex gap-5">
              <FormGroup label="Image" className="w-full">
                <FormInput type="file" accept="image/*" />
              </FormGroup>
              <FormGroup label="Price" required className="w-full">
                <FormInput
                  type="text"
                  value={cItem?.price ?? ""}
                  onChange={setPrice}
                  icon={<span className="px-2">{curr}</span>}
                  min={0}
                  className="px-3 py-1.5"
                />
              </FormGroup>
            </div>
            <div className="flex gap-5">
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
                    value={cItem?.initialPrice ?? ""}
                    onChange={setInitailPrice}
                    icon={<span className="px-2">{curr}</span>}
                    min={0}
                    className="px-3 py-1.5"
                  />
                </FormGroup>
              )}
            </div>
            <Button
              type="button"
              onClick={addToList}
              className="w-full hover:bg-primary bg-background text-foreground hover:text-background"
            >
              Add menu item
            </Button>
          </div>
        </div>
      </FormGroup>
    </div>
  );
};

const FileUploadForm = () => {
  const props = useSupabaseUpload({
    bucketName: "test",
    path: "test",
    allowedMimeTypes: ["image/*"],
    maxFiles: 2,
    maxFileSize: 1000 * 1000 * 10, // 10MB,
  });

  return (
    <FormGroup className="w-full max-w-sm mx-auto text-background py-10 ">
      <Dropzone {...props}>
        <DropzoneEmptyState />
        <DropzoneContent />
      </Dropzone>
    </FormGroup>
  );
};
