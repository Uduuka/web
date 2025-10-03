import FormGroup from "@/components/ui/FormGroup";
import { Currency, PriceMenu, Pricing } from "@/lib/types";
import { ChangeEvent, useState } from "react";
import FormInput from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAppStore } from "@/lib/store";
import PriceTag from "../../cards/PriceTag";

export const MenuPricingForm = ({
  curr,
  initialValue,
  onChange,
}: {
  curr: Currency;
  initialValue?: Pricing<PriceMenu>[];
  onChange: (p: Pricing<PriceMenu>[]) => void;
}) => {
  const { currency } = useAppStore();
  const [pricing, setPricing] = useState<Pricing<PriceMenu>>({
    scheme: "menu",
    currency,
  } as Pricing<PriceMenu>);
  const [pricings, setPricings] = useState<Pricing<PriceMenu>[]>(
    initialValue ?? []
  );

  const setPrice = (e: ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value.replaceAll(",", "")))) {
      return;
    }

    setPricing({
      ...pricing,
      details: { ...pricing.details, price: e.target.value },
    });
  };

  const addToList = () => {
    if (!pricing.details?.title || !pricing.details?.price) {
      return;
    }
    setPricings([...pricings, pricing]);

    onChange(pricings);
  };
  return (
    <div className="w-full flex">
      <FormGroup label="Price menu items" className="w-full text-left">
        <div className="border rounded-lg w-full">
          <div className="space-y-2 border-b p-5">
            {pricings.length === 0 && (
              <div className="p-5 text-center">
                <p className="w-full max-w-72 text-xs mx-auto fornt-light text-gray-400">
                  The price menu is empty. Use the form below to add items here.
                </p>
              </div>
            )}
            {pricings.map((item, index) => (
              <div
                key={index}
                className="flex gap-2 rounded-lg overflow-hidden"
              >
                <div className="w-20 bg-secondary"></div>
                <div className="w-full">
                  <h1 className="text-gray-500 font-bold">
                    {item.details.title}
                  </h1>
                  <p className="text-gray-500">{item.details.description}</p>
                  <PriceTag pricing={item} />
                </div>
              </div>
            ))}
          </div>
          <div className="p-5 space-y-5">
            <FormGroup label="Item title" required className="">
              <FormInput
                type="text"
                value={pricing.details?.title ?? ""}
                onChange={(e) =>
                  setPricing({
                    ...pricing,
                    details: { ...pricing.details, title: e.target.value },
                  })
                }
              />
            </FormGroup>
            <FormGroup label="Item description" className="">
              <textarea
                value={pricing.details?.description ?? ""}
                onChange={(e) =>
                  setPricing({
                    ...pricing,
                    details: {
                      ...pricing.details,
                      description: e.target.value,
                    },
                  })
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
                  value={pricing.details?.price ?? ""}
                  onChange={setPrice}
                  icon={<span className="px-2">{curr}</span>}
                  min={0}
                  className="px-3 py-1.5"
                />
              </FormGroup>
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
