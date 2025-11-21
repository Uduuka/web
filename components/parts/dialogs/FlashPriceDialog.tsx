import React, { useRef, useState, useTransition } from "react";
import Modal from "../models/Modal";
import { LoaderCircle } from "lucide-react";
import { FlashPricing, Listing } from "@/lib/types";
import ScrollArea from "../layout/ScrollArea";
import Button from "@/components/ui/Button";
import { IoMdFlash } from "react-icons/io";
import PriceTag from "../cards/PriceTag";
import FormGroup from "@/components/ui/FormGroup";
import MoneyInput from "../forms/MoneyInput";
import { createFlashPricings } from "@/lib/actions";

export default function CreateFlashPricingDialog({
  ad,
  ads,
  setAds,
}: {
  ad: Listing;
  ads: Listing[];
  setAds: (ads: Listing[]) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pricings, setPricings] = useState(ad.pricings ?? []);
  const [saving, startSaving] = useTransition();

  const handleCreateFlashSales = () => {
    startSaving(async () => {
      const flashPricings = pricings
        .filter((p) =>
          Boolean(
            p.flashSale &&
              p.flashSale.amount > 0 &&
              p.flashSale.expires_at &&
              new Date(p.flashSale.expires_at) > new Date()
          )
        )
        .map((p) => ({
          ...p.flashSale!,
          pricing_id: p.id!,
        }));
      if (flashPricings.length === 0) return;
      const { error } = await createFlashPricings(flashPricings);
      if (error) {
        console.error("Error creating flash pricings:", error);
        return;
      }

      // Update ads state
      setAds(
        ads.map((a) =>
          a.id === ad.id
            ? {
                ...a,
                pricings,
              }
            : a
        )
      );

      // Close the dialog
      formRef.current?.close();
    });
  };

  return (
    <Modal
      trigger={
        <>
          <IoMdFlash size={15} /> Create flash sale
        </>
      }
      className=""
      header={
        <span className="text-base flex items-center font-bold max-w-90% line-clamp-1">
          <IoMdFlash size={18} /> Create flash sale
        </span>
      }
      triggerStyle="p-1 bg-primary w-full hover:bg-orange-400 gap-2 justify-start px-5 text-xs text-white"
    >
      <ScrollArea maxHeight="100%" className="w-full h-72 px-5 text-gray-500">
        <div className="space-y-5">
          {pricings.map((p, i) => (
            <div
              key={i}
              className="w-full rounded-lg border border-gray-300 p-2"
            >
              <PriceTag pricing={p} />
              <MoneyInput
                money={p.flashSale?.amount}
                setMoney={(m) => {
                  setPricings(
                    pricings.map((pr) =>
                      pr.id === p.id
                        ? {
                            ...pr,
                            flashSale: {
                              ...(pr.flashSale ?? ({} as FlashPricing)),
                              amount: m,
                            },
                          }
                        : pr
                    )
                  );
                }}
                currency={p.currency}
                label="Flash price"
                className="mt-5"
                moneyStyle="border-gray-300 rounded"
              />
              <div className="flex w-full gap-5">
                <FormGroup label="End date" className="mt-5 w-full">
                  <input
                    type="date"
                    value={
                      (p.flashSale?.expires_at
                        ? new Date(p.flashSale.expires_at)
                        : new Date()
                      )
                        .toISOString()
                        .split("T")[0]
                    }
                    onChange={(e) => {
                      const time = (
                        p.flashSale?.expires_at
                          ? new Date(p.flashSale.expires_at)
                          : new Date()
                      )
                        .toISOString()
                        .split("T")[1]
                        .split(":")
                        .slice(0, 2)
                        .join(":");

                      const isoString = `${e.target.value ?? ""}T${time}:00`;
                      setPricings(
                        pricings.map((pr) =>
                          pr.id === p.id
                            ? {
                                ...pr,
                                flashSale: {
                                  ...(pr.flashSale ?? ({} as FlashPricing)),
                                  expires_at: new Date(isoString).toISOString(),
                                },
                              }
                            : pr
                        )
                      );
                    }}
                    className="w-full border border-gray-300 rounded px-3 py-1"
                  />
                </FormGroup>
                <FormGroup label="End time" className="mt-5 w-full">
                  <input
                    type="time"
                    value={(p.flashSale?.expires_at
                      ? new Date(p.flashSale.expires_at)
                      : new Date()
                    )
                      .toISOString()
                      .split("T")[1]
                      .split(":")
                      .slice(0, 2)
                      .join(":")}
                    onChange={(e) => {
                      const date = (
                        p.flashSale?.expires_at
                          ? new Date(p.flashSale.expires_at)
                          : new Date()
                      )
                        .toISOString()
                        .split("T")[0];

                      const isoString = `${date}T${e.target.value
                        .split(":")
                        .slice(0, 2)
                        .join(":")}:00.000z`;
                      setPricings(
                        pricings.map((pr) =>
                          pr.id === p.id
                            ? {
                                ...pr,
                                flashSale: {
                                  ...(pr.flashSale ?? ({} as FlashPricing)),
                                  expires_at: isoString,
                                },
                              }
                            : pr
                        )
                      );
                    }}
                    className="w-full border border-gray-300 rounded px-3 py-1"
                  />
                </FormGroup>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form
        method="dialog"
        ref={formRef}
        className="w-full flex gap-5 p-5 pt-0"
      >
        <Button className="w-full text-base text-gray-500 bg-transparent border border-gray-500">
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleCreateFlashSales}
          className="w-full text-base text-green-500 bg-transparent border border-green-500"
        >
          {saving ? (
            <LoaderCircle className="animate-spin" size={15} />
          ) : (
            "Create flash sales"
          )}
        </Button>
      </form>
    </Modal>
  );
}
