"use client";

import { useState } from "react";
import GeneralSettings from "@/components/parts/settings/sections/general-settings";
import AlertsSettings from "@/components/parts/settings/sections/alerts-settings";
import InventorySettings from "@/components/parts/settings/sections/inventory-settings";
import ReportingSettings from "@/components/parts/settings/sections/reporting-settings";
import PaymentsSettings from "@/components/parts/settings/sections/payments-settings";
import TaxationSettings from "@/components/parts/settings/sections/taxation-settings";
import ShippingSettings from "@/components/parts/settings/sections/shipping-settings";
import SecuritySettings from "@/components/parts/settings/sections/security-settings";
import HardwareSettings from "@/components/parts/settings/sections/hardware-settings";
import SettingsTabNavigation from "@/components/parts/settings/settings-tab-navigation";
import { toast } from "sonner";
import Button from "@/components/ui/Button";

type SettingSection =
  | "general"
  | "alerts"
  | "inventory"
  | "reporting"
  | "payments"
  | "taxation"
  | "shipping"
  | "security"
  | "hardware";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingSection>("general");
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setHasChanges(false);
    toast.success("Success", {
      description: "Settings saved successfully!",
      className: "bg-green-50 text-success border border-green-200",
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
  };

  const renderSection = () => {
    switch (activeSection) {
      case "general":
        return <GeneralSettings onChange={() => setHasChanges(true)} />;
      case "alerts":
        return <AlertsSettings onChange={() => setHasChanges(true)} />;
      case "inventory":
        return <InventorySettings onChange={() => setHasChanges(true)} />;
      case "reporting":
        return <ReportingSettings onChange={() => setHasChanges(true)} />;
      case "payments":
        return <PaymentsSettings onChange={() => setHasChanges(true)} />;
      case "taxation":
        return <TaxationSettings onChange={() => setHasChanges(true)} />;
      case "shipping":
        return <ShippingSettings onChange={() => setHasChanges(true)} />;
      case "security":
        return <SecuritySettings onChange={() => setHasChanges(true)} />;
      case "hardware":
        return <HardwareSettings onChange={() => setHasChanges(true)} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg">
      <SettingsTabNavigation
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="w-full p-5 text-gray-600">{renderSection()}</div>
      </div>

      {hasChanges && (
        <div className="fixed bottom-6 right-10 z-40">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-all shadow-lg"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  );
}
