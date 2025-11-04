import { Category, Listing, Unit } from "@/lib/types";
import { cn } from "@/lib/utils";
import React, { ComponentProps, useEffect, useState } from "react";
import ScrollArea from "../layout/ScrollArea";
import FormGroup from "@/components/ui/FormGroup";
import Select from "@/components/ui/Select";
import FormInput from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { toNumber } from "@/lib/utils";
import Popup from "@/components/ui/Popup";
import { useParams } from "next/navigation";

interface AdFormProps extends ComponentProps<"form"> {
  initailData?: Listing;
  setter: (newData: Listing) => void;
  handleNext?: () => void;
  title?: string;
  actionText?: string;
  categories: Category[];
  units: Unit[];
}

export default function AdForm({
  title,
  setter,
  initailData,
  actionText,
  handleNext,
  className,
  categories,
  units,
  ...props
}: AdFormProps) {
  const storeID = useParams().storeID as string;
  const [ad, setAd] = useState(
    initailData ?? ({ store_id: storeID ?? null } as Listing)
  );
  const [spects, setSpects] = useState<string[]>([]);
  const [adSpects, setAdSpects] = useState<any>(initailData?.specs);

  useEffect(() => {
    const saved = localStorage.getItem("adData");
    if (saved) {
      const parsed = JSON.parse(saved);
      setAd(parsed);

      setAdSpects(parsed?.specs ?? {});
    }
  }, []);

  useEffect(() => {
    const category = categories.find((cat) => cat.slug === ad?.category_id);
    const subCategory = category?.sub_categories?.find(
      (sb) => sb.slug === ad?.sub_category_id
    );

    if (!category || !subCategory) {
      setSpects([]);
      return;
    }

    const specs =
      category.default_specs ?? "".concat(subCategory.default_specs ?? "");
    setAdSpects(ad?.specs ?? {});
    setSpects(specs.split(",").map((s) => s.trim()));
  }, [categories, ad?.category_id, ad?.sub_category_id, initailData]);

  const handleSubmit = () => {
    if (!ad) return;
    setter({ ...ad, specs: adSpects });
    localStorage.setItem("adData", JSON.stringify({ ...ad, specs: adSpects }));
    if (handleNext) {
      handleNext();
    }
  };

  return (
    <form
      {...props}
      className={cn("h-full flex flex-col text-accent gap-3", className)}
    >
      {title && <h1 className="text-center">{title}</h1>}
      <ScrollArea maxHeight="95%" className="h-full px-5 flex flex-col gap-5">
        <div className="sm:flex gap-3">
          <FormGroup label="Category" required className="text-left w-full">
            <Select
              placeholder="Select a category"
              options={categories.map((cat) => ({
                value: cat.slug,
                label: cat.name,
              }))}
              className="w-full  text-foreground "
              triggerStyle="w-full   bg-background py-2"
              value={ad?.category_id}
              onChange={(v) => {
                if (ad) {
                  setAd({ ...ad, category_id: v });
                } else {
                  setAd({ category_id: v } as Listing);
                }
              }}
            />
          </FormGroup>
          <FormGroup
            label="Sub-category"
            required
            className="text-left w-full "
          >
            <Select
              disabled={!Boolean(ad?.category_id)}
              placeholder="Select a sub-category"
              options={
                categories
                  .find((cate) => cate.slug === ad?.category_id)
                  ?.sub_categories?.map((subCate) => ({
                    value: subCate.slug,
                    label: subCate.name,
                  })) ?? []
              }
              className="w-full  text-foreground "
              triggerStyle="w-full   bg-background py-2"
              value={ad?.sub_category_id}
              onChange={(v) => {
                if (ad) {
                  setAd({ ...ad, sub_category_id: v });
                } else {
                  setAd({ sub_category_id: v } as Listing);
                }
              }}
            />
          </FormGroup>
        </div>
        <FormGroup label="Title" required className="text-left w-full">
          <FormInput
            className="px-3 py-1.5 w-full"
            wrapperStyle="border-accent"
            value={ad?.title ?? ""}
            onChange={(e) =>
              setAd({ ...(ad ?? ({} as Listing)), title: e.target.value })
            }
            placeholder="Title or name of the advert"
          />
        </FormGroup>
        <FormGroup label="Description" required className="text-left w-full">
          <textarea
            cols={2}
            value={ad?.description ?? ""}
            onChange={(e) =>
              setAd({ ...(ad ?? ({} as Listing)), description: e.target.value })
            }
            className="px-3 py-1.5 w-full rounded-lg border border-accent hover:border-primary active:border-primary focus:border-primary transition-colors outline-0 focus:outline-0 ring-0 resize-none"
            placeholder="Describe your product or service"
          />
        </FormGroup>
        <FormGroup label="Stock quantity" className="text-left w-full">
          <div className="flex gap-3">
            <FormGroup label="Quantity" className="w-1/2">
              <FormInput
                type="number"
                wrapperStyle="border-accent"
                min={0}
                className="px-3 py-1.5 w-full"
                placeholder="Quantity"
                value={ad?.quantity ?? ""}
                onChange={(e) =>
                  setAd({
                    ...(ad ?? ({} as Listing)),
                    quantity:
                      e.target.value === ""
                        ? undefined
                        : toNumber(e.target.value),
                  })
                }
              />
            </FormGroup>
            <FormGroup label="Units" className="w-1/2">
              <FormInput
                className=""
                value={ad.units ?? ""}
                onChange={(e) => {
                  setAd({ ...ad, units: e.target.value });
                }}
              />
            </FormGroup>
          </div>
        </FormGroup>
        {
          /* Specifications */
          spects && spects.length > 0 && (
            <FormGroup label="Specifications" className="text-left   w-full">
              <div className="rounded-lg p-5 border hover:border-primary focus-within:border-primary flex flex-wrap gap-5">
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
                    <label htmlFor={s} className="text-accent/70 text-xs">
                      {s}
                    </label>
                  </div>
                ))}
              </div>
            </FormGroup>
          )
        }
        <div className="flex justify-end">
          <Button
            type="button"
            disabled={
              !ad?.category_id ||
              !ad.sub_category_id ||
              !ad.title ||
              !ad.description
            }
            onClick={handleSubmit}
            className=" transform bg-primary/80 text-white p-2 px-5 gap-5 rounded-full hover:bg-primary transition disabled:bg-accent disabled:opacity-65 disabled:cursor-not-allowed"
            aria-label="Next step"
          >
            {actionText ?? "Save"}
            {actionText && (
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
            )}
          </Button>
        </div>
      </ScrollArea>
    </form>
  );
}
