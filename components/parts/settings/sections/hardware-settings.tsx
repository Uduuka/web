"use client";

import { useState } from "react";
import { Printer, Barcode, Scale, PanelBottomOpen } from "lucide-react";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/Input";
import FormGroup from "@/components/ui/FormGroup";

interface HardwareSettingsProps {
  onChange?: () => void;
}

export default function HardwareSettings({ onChange }: HardwareSettingsProps) {
  const [receiptPrinter, setReceiptPrinter] = useState("epson-tm-m30");
  const [cashDrawerAuto, setCashDrawerAuto] = useState(true);
  const [barcodeScanner, setBarcodeScanner] = useState("usb-scanner");
  const [testScanValue, setTestScanValue] = useState("");
  const [weighingScaleEnabled, setWeighingScaleEnabled] = useState(true);
  const [polDisplayMessage, setPolDisplayMessage] = useState("Welcome to POS");

  const printers = [
    { value: "epson-tm-m30", label: "Epson TM-M30" },
    { value: "star-tsp143", label: "Star TSP143" },
    { value: "zebra-gk420", label: "Zebra GK420" },
  ];

  const scanners = [
    { value: "usb-scanner", label: "USB Barcode Scanner" },
    { value: "mobile-scanner", label: "Mobile Scanner App" },
    { value: "not-detected", label: "Not Detected" },
  ];

  return (
    <div className="space-y-6">
      <div className="p-5 bg-gray-50 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Hardware & Peripherals</h1>
        <p className="text-muted-foreground">
          Configure and manage POS hardware devices
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 ">
        {/* Receipt Printer */}
        <div className="p-5 bg-gray-50 rounded-lg">
          <div className="pb-5">
            <h1 className="flex items-center text-base font-bold gap-2">
              <Printer className="w-5 h-5" />
              Receipt Printer
            </h1>
          </div>
          <div className="space-y-4">
            <FormGroup className="" label="Select Printer">
              <Select
                value={receiptPrinter}
                onChange={(value) => {
                  setReceiptPrinter(value);
                  onChange?.();
                }}
                options={printers.map((p) => ({
                  value: p.value,
                  label: p.label,
                }))}
                triggerStyle="w-full py-1.5 text-sm"
              />
            </FormGroup>
            <div className="flex gap-5">
              <Button className="w-full bg-gray-500 hover:bg-gray-600 text-white">
                Test Print
              </Button>
              <Button className="w-full bg-primary hover:bg-orange-600 text-white">
                Add Printer
              </Button>
            </div>
          </div>
        </div>

        {/* Cash Drawer */}
        <div className="p-5 bg-gray-50 rounded-lg space-y-5">
          <div className="space-y-3">
            <h1 className="flex items-center text-base font-bold gap-2">
              <PanelBottomOpen className="w-5 h-5" />
              Cash Drawer
            </h1>
            <div>
              <div className="flex items-center justify-between px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg hover:bg-muted transition-colors">
                <label htmlFor="ocs" className="cursor-pointer w-full">
                  Auto-open on cash sales
                </label>
                <input
                  type="checkbox"
                  id="ocs"
                  checked={cashDrawerAuto}
                  onChange={(e) => {
                    setCashDrawerAuto(e.target.checked);
                    onChange?.();
                  }}
                  className="w-5 h-5 rounded cursor-pointer accent-primary"
                />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="flex items-center text-base font-bold gap-2">
              <Scale className="w-5 h-5" />
              Weighing Scale
            </h1>

            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
              <label className="cursor-pointer">
                Enable weighing scale integration
              </label>
              <input
                type="checkbox"
                checked={weighingScaleEnabled}
                onChange={(e) => {
                  setWeighingScaleEnabled(e.target.checked);
                  onChange?.();
                }}
                className="w-5 h-5 rounded cursor-pointer accent-primary"
              />
            </div>
          </div>
        </div>

        {/* Barcode Scanner */}
        <div className="p-5 bg-gray-50 rounded-lg">
          <div className="pb-5">
            <h1 className="flex items-center gap-2 text-base font-bold">
              <Barcode className="w-5 h-5" />
              Barcode Scanner
            </h1>
          </div>
          <div className="space-y-4">
            <FormGroup label="Detected Device" className="w-full">
              <Select
                value={barcodeScanner}
                onChange={(value) => {
                  setBarcodeScanner(value);
                  onChange?.();
                }}
                options={scanners.map((s) => ({
                  value: s.value,
                  label: s.label,
                }))}
                triggerStyle="w-full py-1.5 text-sm"
              />
            </FormGroup>
            <div>
              <label htmlFor="testScan">Test Scan Field</label>
              <FormInput
                id="testScan"
                placeholder="Scan a barcode to test"
                value={testScanValue}
                onChange={(e) => setTestScanValue(e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
