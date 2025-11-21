"use client";

import { useState } from "react";

import { Bell, Volume2 } from "lucide-react";
import Select from "@/components/ui/Select";

interface AlertsSettingsProps {
  onChange?: () => void;
}

export default function AlertsSettings({ onChange }: AlertsSettingsProps) {
  const [toggles, setToggles] = useState({
    newOrders: true,
    lowInventory: true,
    newMessages: false,
    customerReviews: true,
    promotionUpdates: false,
  });

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sound, setSound] = useState("bell");
  const [pushNotifications, setPushNotifications] = useState("all");

  const handleToggle = (key: string) => {
    setToggles((prev: any) => ({ ...prev, [key]: !prev[key] }));
    onChange?.();
  };

  return (
    <div className="space-y-6">
      <div className="p-5 bg-gray-50 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Alerts & Notifications</h1>
        <p className="text-muted-foreground">
          Configure how you receive alerts and notifications
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {/* Notification Types */}
        <div className="bg-gray-50 rounded-lg p-5">
          <div className="pb-5">
            <h1 className="flex items-center gap-2 text-base font-bold">
              <Bell /> Notification Types
            </h1>
            <p>Choose which notifications you want to receive</p>
          </div>
          <div className="">
            {[
              { key: "newOrders", label: "New Orders" },
              { key: "lowInventory", label: "Low Inventory Alerts" },
              { key: "newMessages", label: "New Messages" },
              { key: "customerReviews", label: "Customer Reviews" },
              { key: "promotionUpdates", label: "Promotion Updates" },
            ].map(({ key, label }) => (
              <div
                key={key}
                className="flex items-center justify-between px-3 py-1 hover:bg-gray-100 rounded-lg hover:bg-muted transition-colors"
              >
                <label htmlFor={key} className="cursor-pointer">
                  {label}
                </label>
                <input
                  type="checkbox"
                  checked={toggles[key as keyof typeof toggles]}
                  onChange={() => handleToggle(key)}
                  id={key}
                  className="w-5 h-5 rounded cursor-pointer accent-primary text-white "
                />
              </div>
            ))}
          </div>
        </div>

        {/* Push Notifications */}
        <div className="bg-gray-50 rounded-lg p-5">
          <div className="pb-5">
            <h1 className="flex items-center gap-2 text-base font-bold">
              <Bell />
              Push Notifications
            </h1>
            <p>Control how you receive push notifications</p>
          </div>
          <div className="">
            {[
              { value: "all", label: "All notifications" },
              { value: "urgent", label: "Urgent only" },
              { value: "off", label: "Off" },
            ].map(({ value, label }) => (
              <label
                key={value}
                className="flex items-center gap-3 px-3 py-1 hover:bg-gray-100 rounded-lg hover:bg-muted cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name="pushNotifications"
                  value={value}
                  checked={pushNotifications === value}
                  onChange={(e) => {
                    setPushNotifications(e.target.value);
                    onChange?.();
                  }}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sound Alerts */}
        <div className="bg-gray-50 rounded-lg p-5">
          <div className="pb-5">
            <h1 className="flex items-center gap-2 text-base font-bold">
              <Volume2 />
              Sound Alerts
            </h1>
            <p>Enable sound for new orders</p>
          </div>
          <div className="space-y-4">
            <div className="w-full">
              <label htmlFor="soundSelect">Select Sound</label>
              <Select
                options={[
                  { label: "Silent", value: "silent" },
                  { label: "Bell", value: "bell" },
                  { label: "Chime", value: "chime" },
                  { label: "Notification", value: "notification" },
                  { label: "Alert", value: "alert" },
                ]}
                value={sound}
                triggerStyle="w-full py-1.5 text-sm"
                onChange={setSound}
              />
            </div>
            <div className="w-full py-2 text-sm px-3 rounded-lg bg-secondary/50 flex justify-between items-center">
              <label htmlFor="vibrate" className="w-full cursor-pointer">
                Enable vibration
              </label>
              <input
                type="checkbox"
                onChange={() => {}}
                id="vibrate"
                className="w-5 h-5 rounded cursor-pointer accent-primary text-white "
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
