"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import {
  Settings,
  Bell,
  Package,
  BarChart3,
  CreditCard,
  Calculator,
  Truck,
  Lock,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsTabNavigationProps {
  activeSection: string;
  onSectionChange: (section: any) => void;
}

const TAB_ITEMS = [
  { id: "general", label: "General", icon: Settings },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "reporting", label: "Reporting", icon: BarChart3 },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "taxation", label: "Taxation", icon: Calculator },
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "security", label: "Security", icon: Lock },
  { id: "hardware", label: "Hardware", icon: Zap },
];

export default function SettingsTabNavigation({
  activeSection,
  onSectionChange,
}: SettingsTabNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = (direction: "left" | "right") => {
    const container = document.getElementById("tabs-container");
    if (container) {
      const scrollAmount = 200;
      if (direction === "left") {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        setScrollPosition(scrollPosition - scrollAmount);
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
        setScrollPosition(scrollPosition + scrollAmount);
      }
    }
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("#tabs-container") && !target.closest("button")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Mobile menu toggle */}
      <div className="sm:hidden md:flex lg:hidden flex relative items-center justify-between border-b px-5 py-1">
        <span className="text-base font-bold text-gray-700">
          Store settings
        </span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        {/* Mobile dropdown menu */}
        {isOpen && (
          <div className="lg:hidden bg-white rounded-b-lg rounded-tr-lg w-full max-w-60 absolute shadow-2xl top-0 right-0">
            <nav className="flex flex-col">
              {TAB_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSectionChange(item.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-left transition-colors",
                      activeSection === item.id
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-foreground hover:bg-gray-100"
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Desktop horizontal tabs */}
      <div className="hidden sm:flex md:hidden lg:flex items-center border-b border-gray-300">
        <div
          id="tabs-container"
          className="flex-1 flex items-center overflow-x-auto scrollbar-hide"
        >
          <nav className="flex gap-0">
            {TAB_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-4 border-b-2 transition-colors whitespace-nowrap text-sm font-bold",
                    activeSection === item.id
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-600 hover:text-foreground hover:border-muted"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
