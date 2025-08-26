import { Currency, Listing, Pricing } from "@/lib/types";
import { cn } from "@/lib/utils";
import React, { ComponentProps, useEffect, useState } from "react";
import ScrollArea from "../layout/ScrollArea";
import FormGroup from "@/components/ui/FormGroup";
import Select from "@/components/ui/Select";
import env from "@/lib/env";
import { useAppStore } from "@/lib/store";
import PricingForms from "./pricing_forms";
import Button from "@/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PricingFormProps extends ComponentProps<"div"> {
  setter: (pricings: Pricing<any>[]) => void;
  initialdData?: Pricing<any>[];
  handleNext?: () => void;
  handlePrevious?: () => void;
  ad: Listing;
}

export function PricingForm({
  setter,
  handleNext,
  handlePrevious,
  ad,
  initialdData,
  className,
  ...props
}: PricingFormProps) {
  const { currency: c } = useAppStore();

  const [scheme, setScheme] = useState<string | undefined>(() => {
    if (ad.units) return "unit";
    if (initialdData && initialdData.length > 0) {
      return initialdData[0].scheme;
    }
  });
  const [currency, setCurrency] = useState<Currency>(c);
  const [pricings, setPricings] = useState<Pricing<any>[]>(initialdData ?? []);

  const Form = scheme ? PricingForms[scheme] : undefined;

  const next = () => {
    setter(pricings);
    if (handleNext) {
      handleNext();
    }
  };

  return (
    <div {...props} className={cn("h-full", className)}>
      <ScrollArea
        maxHeight="100%"
        className="bg-foreground-50/20 focus:ring-0 active:ring-0 h-full flex flex-col space-y-5 p-5"
      >
        <div className="flex gap-5 w-full">
          <FormGroup label="Currency" required className="w-full  text-left">
            <Select
              options={
                env.currencyOptions as { label: string; value: string }[]
              }
              className="text-foreground "
              triggerStyle="w-full bg-background py-2"
              value={currency ?? currency}
              onChange={(v) => {
                setCurrency(v as Currency);
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
              options={env.pricingSchemes as { label: string; value: string }[]}
              className="text-foreground "
              triggerStyle="w-full bg-background py-2"
              value={scheme}
              onChange={(v) => {
                setScheme(v);
              }}
            />
          </FormGroup>
        </div>
        {Form && (
          <Form
            curr={currency}
            ad={ad}
            initialValue={pricings}
            onChange={setPricings}
          />
        )}
        <div className="flex-1"></div>
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
              Next
              <ChevronRight size={15} />
            </Button>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
