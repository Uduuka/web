"use client";

import { useState } from "react";
import { Truck } from "lucide-react";
import FormInput from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import MoneyInput from "../../forms/MoneyInput";
import { useAppStore } from "@/lib/store";
import Select from "@/components/ui/Select";
import FormGroup from "@/components/ui/FormGroup";

interface ShippingSettingsProps {
  onChange?: () => void;
}

interface DeliveryZone {
  from: number;
  to: number;
  price: number;
}

export default function ShippingSettings({ onChange }: ShippingSettingsProps) {
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([
    { from: 0, to: 5, price: 5000 },
    { from: 5, to: 10, price: 8000 },
    { from: 10, to: 20, price: 12000 },
  ]);

  const { currency } = useAppStore();

  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(5);

  const handleDeliveryZoneChange = (
    idx: number,
    field: string,
    value: string
  ) => {
    const newZones = [...deliveryZones];
    newZones[idx] = { ...newZones[idx], [field]: Number.parseFloat(value) };
    setDeliveryZones(newZones);
    onChange?.();
  };

  const addDeliveryZone = () => {
    const lastZone = deliveryZones[deliveryZones.length - 1];
    setDeliveryZones([
      ...deliveryZones,
      { from: lastZone.to, to: lastZone.to + 5, price: 0 },
    ]);
    // onChange?.();
  };

  const removeDeliveryZone = (idx: number) => {
    setDeliveryZones(deliveryZones.filter((_, i) => i !== idx));
    onChange?.();
  };

  return (
    <div className="space-y-6">
      <div className="p-5 bg-gray-50 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Shipping & Deliveries</h1>
        <p className="text-muted-foreground">
          Configure delivery options and pricing
        </p>
      </div>

      {/* Delivery Pricing */}
      <div className="p-5 bg-gray-50 rounded-lg">
        <div className="pb-5">
          <h1 className="flex items-center text-base font-bold gap-2">
            <Truck className="w-5 h-5" />
            Delivery Pricing
          </h1>
          <p>Set distance-based delivery rates</p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2 flex flex-col">
            <div className="flex items-center gap-6 px-3 py-2 bg-gray-100 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium w-32">
                  Free delivery upto
                </span>
                <FormInput
                  type="number"
                  value={freeDeliveryThreshold ?? ""}
                  onChange={(e) => {
                    setFreeDeliveryThreshold(Number.parseFloat(e.target.value));
                    onChange?.();
                  }}
                  className="w-16"
                  min="0"
                />

                <span className="text-sm">km</span>
                <span className="text-sm">Duration</span>
                <FormInput type="number" className="w-16" />
                <Select
                  value={"mins"}
                  options={[
                    { label: "Mins", value: "mins" },
                    { label: "Hours", value: "hours" },
                    { label: "Days", value: "days" },
                  ]}
                  onChange={(v) => {}}
                />
              </div>
            </div>
            {deliveryZones.map((zone, idx) => (
              <div
                key={idx}
                className="flex items-center gap-6 px-3 py-2 bg-gray-100 bg-muted rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">From</span>
                  <FormInput
                    type="number"
                    value={zone.from ?? ""}
                    onChange={(e) =>
                      handleDeliveryZoneChange(idx, "from", e.target.value)
                    }
                    className="w-16"
                    min="0"
                  />
                  <span className="text-sm">to</span>
                  <FormInput
                    type="number"
                    value={zone.to ?? ""}
                    onChange={(e) =>
                      handleDeliveryZoneChange(idx, "to", e.target.value)
                    }
                    className="w-16"
                    min="0"
                  />
                  <span className="text-sm">km</span>
                  <span className="text-sm">Duration</span>
                  <FormInput type="number" className="w-16" />
                  <Select
                    value={"mins"}
                    options={[
                      { label: "Mins", value: "mins" },
                      { label: "Hours", value: "hours" },
                      { label: "Days", value: "days" },
                    ]}
                    onChange={(v) => {}}
                  />
                </div>
                <div className="flex items-center gap-2 w-60">
                  <span className="text-sm font-medium">Price:</span>
                  <MoneyInput
                    money={zone.price}
                    setMoney={(m) =>
                      handleDeliveryZoneChange(idx, "price", m.toString())
                    }
                    currency={currency}
                    className="w-fit"
                    label=""
                  />
                </div>

                {deliveryZones.length > 1 && (
                  <Button
                    onClick={() => removeDeliveryZone(idx)}
                    className="ml-auto px-2 py-1 text-error bg-transparent hover:bg-red-100 rounded transition-colors text-sm"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              onClick={addDeliveryZone}
              className="bg-primary hover:bg-orange-400 text-white py-1.5 w-fit self-end"
            >
              Add delivery zone
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
