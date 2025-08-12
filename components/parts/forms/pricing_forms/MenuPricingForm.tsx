import FormGroup from "@/components/ui/FormGroup";
import { Currency, MenuItem, PriceMenu, Pricing } from "@/lib/types";
import { ChangeEvent, useState } from "react";
import { FixedPriceTag } from "../../cards/PriceTag";
import FormInput from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export const MenuPricingForm = ({
  curr,
  initialValue,
  onChange,
}: {
  curr: Currency;
  initialValue?: Pricing<PriceMenu>[];
  onChange: (p: Pricing<PriceMenu>[]) => void;
}) => {
  const [discounted, setDiscounted] = useState(false);
  const [items, setItems] = useState<MenuItem[]>(
    initialValue ? initialValue[0].details.items : []
  );
  const [cItem, setCItem] = useState<MenuItem>({} as MenuItem);

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
    setCItem({} as MenuItem);

    onChange([
      { currency: curr, scheme: "menu", details: { items: [...items, cItem] } },
    ]);
  };
  return (
    <div className="w-full flex">
      <FormGroup label="Price menu items" className="w-full text-left">
        <div className="border rounded-lg w-full">
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
                        currency: curr,
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
