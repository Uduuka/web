"use client";

import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import FormInput from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface InventorySettingsProps {
  onChange?: () => void;
}

interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
}

const lowStockLevels = [
  { id: "1", comodity: "Apples", level: 50, units: "pieces" },
  { id: "2", comodity: "Bananas", level: 100, units: "banches" },
  { id: "3", comodity: "Oranges", level: 150, units: "pieces" },
  { id: "4", comodity: "Grapes", level: 10, units: "banches" },
  { id: "5", comodity: "Mangoes", level: 50, units: "pieces" },
];

export default function InventorySettings({
  onChange,
}: InventorySettingsProps) {
  const [lowStockThresholds, setLowStockThresholds] = useState(lowStockLevels);
  const [generateBarcodes, setGenerateBarcodes] = useState(true);
  const [allowScanning, setAllowScanning] = useState(true);
  const [printLabels, setPrintLabels] = useState(true);
  const [autoReorder, setAutoReorder] = useState(false);
  const [allowNegativeStock, setAllowNegativeStock] = useState("ask");
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: "1",
      name: "Main Distributor",
      contact: "+256701234567",
      email: "sales@distributor.ug",
    },
  ]);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contact: "",
    email: "",
  });

  const addSupplier = () => {
    if (newSupplier.name && newSupplier.contact && newSupplier.email) {
      setSuppliers([
        ...suppliers,
        { id: Date.now().toString(), ...newSupplier },
      ]);
      setNewSupplier({ name: "", contact: "", email: "" });
      onChange?.();
    }
  };

  const removeSupplier = (id: string) => {
    setSuppliers(suppliers.filter((s) => s.id !== id));
    onChange?.();
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-5 rounded-lg text-gray-600">
        <h1 className="text-3xl font-bold mb-2">Inventory Settings</h1>
        <p className="text-muted-foreground">
          Configure inventory management options
        </p>
      </div>

      <div className="flex gap-5 flex-col md:flex-row">
        {/* Low Stock Alert */}
        <div className=" bg-gray-50 w-full py-5 rounded-lg space-y-5">
          <div className="px-5">
            <h1 className="text-base font-bold">Low Stock Configuration</h1>
            <p>Set the threshold for low stock alerts</p>
          </div>
          <div className="flex px-5 items-center justify-between pt-5 rounded-lg hover:bg-muted transition-colors">
            <label className="cursor-pointer">Enable auto reorder</label>
            <input
              type="checkbox"
              checked={autoReorder}
              onChange={(e) => {
                setAutoReorder(e.target.checked);
                onChange?.();
              }}
              className="w-5 h-5 rounded cursor-pointer accent-primary"
            />
          </div>
          <div className="">
            <div className="w-full flex gap-5 bg-gray-200 px-5 py-2 justify-between items-center">
              <label className="font-bold">Comodity</label>
              <label className="font-bold">Threshold</label>
            </div>
            {lowStockThresholds.map((item) => (
              <div
                key={item.id}
                className="w-full flex gap-5 px-5 py-1 justify-between items-center odd:bg-gray-100"
              >
                <label htmlFor="threshold">{item.comodity}</label>

                <FormInput
                  id="threshold"
                  type="number"
                  value={item.level ?? ""}
                  onChange={(e) => {
                    setLowStockThresholds(
                      lowStockThresholds.map((lst) =>
                        lst.id === item.id
                          ? { ...lst, level: Number(e.target.value) }
                          : lst
                      )
                    );
                    onChange?.();
                  }}
                  className="w-16"
                  min="1"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-5 w-full">
          {/* Barcode Settings */}
          <div className="p-5 bg-gray-50 rounded-lg">
            <div className="pb-5">
              <h1 className="text-base font-bold">Barcode Settings</h1>
              <p>Configure barcode generation and scanning</p>
            </div>
            <div className="space-y-2">
              {[
                {
                  key: "generateBarcodes",
                  label: "Auto-generate barcodes",
                  state: generateBarcodes,
                  setState: setGenerateBarcodes,
                },
                {
                  key: "allowScanning",
                  label: "Allow barcode scanning",
                  state: allowScanning,
                  setState: setAllowScanning,
                },
                {
                  key: "printLabels",
                  label: "Print barcode labels",
                  state: printLabels,
                  setState: setPrintLabels,
                },
              ].map(({ key, label, state, setState }) => (
                <div
                  key={key}
                  className="flex items-center justify-between px-5 py-1 hover:bg-gray-100 rounded-lg hover:bg-muted transition-colors"
                >
                  <label className="cursor-pointer">{label}</label>
                  <input
                    type="checkbox"
                    checked={state}
                    onChange={(e) => {
                      setState(e.target.checked);
                      onChange?.();
                    }}
                    className="w-5 h-5 rounded cursor-pointer accent-primary"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Negative Stock */}
          <div className="p-5 bg-gray-50 rounded-lg">
            <div className="pb-5">
              <h1 className="text-base font-bold">Negative Stock Policy</h1>
            </div>
            <div className="space-y-2">
              {[
                { value: "allow", label: "Allow negative stock" },
                { value: "deny", label: "Deny negative stock" },
                { value: "ask", label: "Ask manager approval" },
              ].map(({ value, label }) => (
                <label
                  key={value}
                  className="flex items-center gap-3 px-5 hover:bg-gray-100 py-1 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="negativeStock"
                    value={value}
                    checked={allowNegativeStock === value}
                    onChange={(e) => {
                      setAllowNegativeStock(e.target.value);
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
      {/* Suppliers */}
      <div className="p-5 bg-gray-50 rounded-lg">
        <div className="pb-5">
          <h1 className="text-base font-bold">Suppliers</h1>
          <p>Manage your product suppliers</p>
        </div>
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="space-y-3 w-full">
            {suppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="p-4 border border-border rounded-lg flex justify-between items-start"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground">{supplier.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {supplier.contact}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {supplier.email}
                  </p>
                </div>
                <button
                  onClick={() => removeSupplier(supplier.id)}
                  className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="p-5 space-y-3 w-full max-w-96 bg-white rounded-lg">
            <h4 className="font-medium">Add New Supplier</h4>
            <FormInput
              placeholder="Supplier name"
              value={newSupplier.name}
              onChange={(e) =>
                setNewSupplier({ ...newSupplier, name: e.target.value })
              }
            />
            <FormInput
              placeholder="Contact number"
              value={newSupplier.contact}
              onChange={(e) =>
                setNewSupplier({ ...newSupplier, contact: e.target.value })
              }
            />
            <FormInput
              placeholder="Email"
              type="email"
              value={newSupplier.email}
              onChange={(e) =>
                setNewSupplier({ ...newSupplier, email: e.target.value })
              }
            />
            <Button
              onClick={addSupplier}
              className="w-full bg-primary hover:bg-orange-400 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Supplier
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
