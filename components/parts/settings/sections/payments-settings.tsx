"use client";

import FormGroup from "@/components/ui/FormGroup";
import FormInput from "@/components/ui/Input";
import { useState } from "react";
import MoneyInput from "../../forms/MoneyInput";
import { useAppStore } from "@/lib/store";
import Button from "@/components/ui/Button";
import PriceTag from "../../cards/PriceTag";
import { X } from "lucide-react";

interface PaymentsSettingsProps {
  onChange?: () => void;
}

type LoyalityProgram = {
  enabled: boolean;
  amount: number;
  pointsPerAmount: number;
};

type Tip = { amount: number; tip: number };

export default function PaymentsSettings({ onChange }: PaymentsSettingsProps) {
  const [paymentMethods, setPaymentMethods] = useState({
    cash: true,
    card: true,
    mobileMoney: true,
    giftCards: false,
    storeCredit: false,
    bankTransfer: false,
  });

  const { currency } = useAppStore();

  const [tipSettings, setTipSettings] = useState<{
    enabled: boolean;
    presets: { amount: number; tip: number }[];
  }>({
    enabled: true,
    presets: [],
  });

  const [newTip, setNewTip] = useState<Tip>();

  const [loyaltyProgram, setLoyaltyProgram] = useState<LoyalityProgram>();

  const [currencies, setCurrencies] = useState(["UGX", "USD"]);
  const [giftCardsEnabled, setGiftCardsEnabled] = useState(true);

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethods((prev: any) => ({ ...prev, [method]: !prev[method] }));
    onChange?.();
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-lg bg-gray-50">
        <h1 className="text-3xl font-bold mb-2">Payments & Tenders</h1>
        <p className="text-muted-foreground">
          Configure payment methods and tender settings
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
          {/* Payment Methods */}
          <div className="p-5 bg-gray-50 rounded-lg">
            <div className="pb-5">
              <h1 className="font-bold text-base">Accepted Payment Methods</h1>
              <p>Select which payment methods you accept</p>
            </div>
            <div className="">
              {Object.entries(paymentMethods).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between px-3 py-1 hover:bg-gray-100 rounded-lg hover:bg-muted transition-colors"
                >
                  <label htmlFor={key} className="cursor-pointer capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                  <input
                    type="checkbox"
                    checked={value}
                    id={key}
                    onChange={() => {
                      handlePaymentMethodChange(key);
                    }}
                    className="w-5 h-5 rounded cursor-pointer accent-primary"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Supported Currencies */}
          <div className="p-5 bg-gray-50 rounded-lg">
            <div className="pb-5">
              <h1 className="text-base font-bold ">Supported Currencies</h1>
              <p>Select accepted currencies</p>
            </div>
            <div className="">
              {["UGX", "USD", "EUR", "GBP", "KES", "TZS"].map((currency) => (
                <div
                  key={currency}
                  className="flex items-center justify-between px-3 py-1 hover:bg-gray-100 rounded-lg hover:bg-muted transition-colors"
                >
                  <label
                    htmlFor={currency}
                    className="text-sm font-medium w-full cursor-pointer"
                  >
                    {currency}
                  </label>
                  <input
                    type="checkbox"
                    checked={currencies.includes(currency)}
                    id={currency}
                    onChange={() => {
                      setCurrencies((prev) =>
                        prev.includes(currency)
                          ? prev.filter((c) => c !== currency)
                          : [...prev, currency]
                      );
                      onChange?.();
                    }}
                    className="w-5 h-5 rounded cursor-pointer accent-primary"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Loyalty Program */}
          <div className="p-5 bg-gray-50 rounded-lg col-span-2">
            <div className="pb-5">
              <h1 className="text-base font-bold">Loyalty Program</h1>
            </div>
            <div className="space-y-4">
              <div className="flex gap-5">
                <div className="flex items-center justify-between px-3 py-2 w-full bg-secondary/50 rounded-lg hover:bg-secondary transition-colors">
                  <label className="cursor-pointer">
                    Enable loyalty program
                  </label>
                  <input
                    type="checkbox"
                    checked={loyaltyProgram?.enabled ?? false}
                    onChange={(e) => {
                      setLoyaltyProgram((prev) => ({
                        ...(prev ?? ({} as LoyalityProgram)),
                        enabled: e.target.checked,
                      }));
                      onChange?.();
                    }}
                    className="w-5 h-5 rounded cursor-pointer accent-primary"
                  />
                </div>
                <div className="flex items-center justify-between px-3 py-2 w-full bg-secondary/50 rounded-lg hover:bg-secondary transition-colors">
                  <label
                    htmlFor="enable-tips"
                    className="cursor-pointer w-full"
                  >
                    Enable giftCards
                  </label>
                  <input
                    type="checkbox"
                    id="enable-tips"
                    checked={giftCardsEnabled}
                    onChange={(e) => {
                      setGiftCardsEnabled(e.target.checked);
                      onChange?.();
                    }}
                    className="w-5 h-5 rounded cursor-pointer accent-primary"
                  />
                </div>
              </div>

              <div
                className={`flex gap-5 ${
                  !loyaltyProgram?.enabled && "opacity-40"
                }`}
              >
                <MoneyInput
                  money={0}
                  setMoney={() => {}}
                  currency={currency}
                  className="min-w-60 w-fit"
                  moneyStyle="border-gray-300 hover:border-primary focus-within:border-primary  w-60"
                />
                <FormGroup label="Points" className="">
                  <FormInput
                    id="pointsPerUnit"
                    type="number"
                    value={loyaltyProgram?.pointsPerAmount ?? ""}
                    onChange={(e) => {
                      setLoyaltyProgram((prev) => ({
                        ...(prev ?? ({} as LoyalityProgram)),
                        pointsPerAmount: Number.parseInt(e.target.value),
                      }));
                      onChange?.();
                    }}
                    className=" w-32"
                    min="1"
                  />
                </FormGroup>
              </div>
            </div>
          </div>
        </div>
        {/* Tip Settings */}
        <div className="p-5 bg-gray-50 rounded-lg flex flex-col space-y-5 w-full max-w-96">
          <h1 className="text-base font-bold">Tip Settings</h1>

          <div className="flex items-center justify-between px-3 py-2 w-full bg-secondary/50 rounded-lg hover:bg-secondary transition-colors">
            <label htmlFor="enable-tips" className="cursor-pointer w-full">
              Enable tips
            </label>
            <input
              type="checkbox"
              id="enable-tips"
              checked={tipSettings.enabled}
              onChange={(e) => {
                setTipSettings((prev) => ({
                  ...prev,
                  enabled: e.target.checked,
                }));
                onChange?.();
              }}
              className="w-5 h-5 rounded cursor-pointer accent-primary"
            />
          </div>

          <div className="space-y-5 flex-1 flex flex-col">
            <div
              className={
                tipSettings.enabled
                  ? " space-y-5 flex-1 flex flex-col"
                  : "opacity-40 space-y-5 flex-1 flex flex-col"
              }
            >
              <div className="flex-1">
                <h1 className="text-base  ">Tip rules</h1>
                <div className="w-full space-y-2">
                  {tipSettings.presets.length === 0 && (
                    <p className="text-gray-400">No tip rules defined.</p>
                  )}
                  {tipSettings.presets.map((tp, ind) => (
                    <div
                      className="w-full relative flex gap-2 px-2 py-1 bg-orange-100 rounded group"
                      key={ind}
                    >
                      <PriceTag
                        pricing={{
                          scheme: "fixed",
                          currency,
                          amount: tp.amount,
                          details: {},
                        }}
                        from
                      />
                      <span className="text-primary font-bold pl-2">
                        -{tp.tip}%
                      </span>
                      <Button
                        onClick={() => {
                          setTipSettings({
                            ...tipSettings,
                            presets: tipSettings.presets.filter(
                              (p) => p.amount !== tp.amount
                            ),
                          });
                        }}
                        className="p-0 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-400 bg-error text-white rounded-full absolute -top-1 -right-1"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <MoneyInput
                label="Tipable amount"
                money={newTip?.amount ?? 0}
                setMoney={(m) => {
                  setNewTip({ ...(newTip as any), amount: m });
                }}
                disabled={!tipSettings.enabled}
                currency={currency}
                moneyStyle="border-gray-300 hover:border-primary focus-within:border-primary"
              />

              <FormGroup label="Tip (%)" className="flex gap-2 mt-2">
                <div className="flex gap-5 items-center">
                  <FormInput
                    type="number"
                    disabled={!tipSettings.enabled}
                    placeholder="Tip (%)"
                    value={newTip?.tip ?? ""}
                    onChange={(v) =>
                      setNewTip({ ...(newTip as any), tip: v.target.value })
                    }
                    wrapperStyle="w-full"
                  />
                  <Button
                    onClick={() => {
                      newTip &&
                        setTipSettings({
                          ...tipSettings,
                          presets: [...tipSettings.presets, newTip],
                        });
                      setNewTip(undefined);
                    }}
                    className="w-full bg-primary hover:bg-orange-400 text-white"
                  >
                    Add tip
                  </Button>
                </div>
              </FormGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
