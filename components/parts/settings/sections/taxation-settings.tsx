"use client";

import FormGroup from "@/components/ui/FormGroup";
import FormInput from "@/components/ui/Input";
import Link from "next/link";
import { useState } from "react";

interface TaxationSettingsProps {
  onChange?: () => void;
}

export default function TaxationSettings({ onChange }: TaxationSettingsProps) {
  const [efrisEnabled, setEfrisEnabled] = useState(false);
  const [efrisApiKey, setEfrisApiKey] = useState("");
  const [vatRate, setVatRate] = useState(18);
  const [vatInclusive, setVatInclusive] = useState(false);
  const [taxExemptCustomers, setTaxExemptCustomers] = useState(false);

  return (
    <div className="space-y-6">
      <div className="p-5 bg-gray-50 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Taxation Settings</h1>
        <p className="text-muted-foreground">
          Configure tax and compliance settings
        </p>
      </div>

      <div className="flex gap-5">
        {/* EFRIS Integration */}
        <div className="p-5 bg-gray-50 rounded-lg w-full">
          <div className="pb-5">
            <h1 className="text-base font-bold">EFRIS Integration (Uganda)</h1>
            <p>Enable EFRIS compliance for electronic invoicing</p>
          </div>
          <div className="space-y-4">
            <div className="flex bg-gray-100 items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition-colors">
              <label className="cursor-pointer">Enable EFRIS Integration</label>
              <input
                type="checkbox"
                checked={efrisEnabled}
                onChange={(e) => {
                  setEfrisEnabled(e.target.checked);
                  onChange?.();
                }}
                className="w-5 h-5 rounded cursor-pointer accent-primary"
              />
            </div>

            <div className={`space-y-3 ${!efrisEnabled && "opacity-40"}`}>
              <FormGroup label="EFRIS API key">
                <FormInput
                  value={efrisApiKey ?? ""}
                  disabled={!efrisEnabled}
                  onChange={(e) => {
                    setEfrisApiKey(e.target.value);
                    onChange?.();
                  }}
                  placeholder="Enter your EFRIS API key"
                  className="py-1.5"
                />
              </FormGroup>
              <p className="text-xs text-muted-foreground">
                Get your API key from the EFRIS portal at{" "}
                <span className="text-blue-500">
                  {efrisEnabled ? (
                    <Link target="_blank" href="https://ura.go.ug/en/efris/">
                      https://ura.go.ug/en/efris/
                    </Link>
                  ) : (
                    "https://ura.go.ug/en/efris/"
                  )}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* VAT Settings */}
        <div className="p-5 bg-gray-50 rounded-lg w-full">
          <div className="pb-5">
            <h1 className="text-base font-bold">
              VAT / Sales Tax Configuration
            </h1>
          </div>
          <div className="space-y-4">
            <FormGroup label="VAT Rate (%)">
              <FormInput
                id="vatRate"
                type="number"
                value={vatRate}
                onChange={(e) => {
                  setVatRate(Number.parseFloat(e.target.value));
                  onChange?.();
                }}
                className="py-1.5 w-32"
                min="0"
                max="100"
                step="0.1"
              />
            </FormGroup>

            <div className="">
              <div className="flex gap-5">
                {[
                  { value: false, label: "Exclusive (add to price)" },
                  { value: true, label: "Inclusive (included in price)" },
                ].map(({ value, label }) => (
                  <label
                    key={String(value)}
                    className="flex items-center gap-3 px-3 py-2 bg-gray-100 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name="vatCalculation"
                      value={String(value)}
                      checked={vatInclusive === value}
                      onChange={(e) => {
                        setVatInclusive(e.target.value === "true");
                        onChange?.();
                      }}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
