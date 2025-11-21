"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Settings, Bell, Package, BarChart3, CreditCard, Calculator, Truck, Lock, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface SettingsSidebarProps {
  activeSection: string
  onSectionChange: (section: any) => void
}

const SIDEBAR_ITEMS = [
  { id: "general", label: "General", icon: Settings },
  { id: "alerts", label: "Alerts & Notifications", icon: Bell },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "reporting", label: "Reporting & Analytics", icon: BarChart3 },
  { id: "payments", label: "Payments & Tenders", icon: CreditCard },
  { id: "taxation", label: "Taxation", icon: Calculator },
  { id: "shipping", label: "Shipping & Deliveries", icon: Truck },
  { id: "security", label: "Security & Access", icon: Lock },
  { id: "hardware", label: "Hardware & Peripherals", icon: Zap },
]

export default function SettingsSidebar({ activeSection, onSectionChange }: SettingsSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => setIsOpen(!isOpen)

  return (
    <>
      {/* Mobile Toggle */}
      <button onClick={toggleSidebar} className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg hover:bg-muted">
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && <div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:relative w-64 h-screen bg-card border-r border-border overflow-y-auto transition-all duration-300 z-40",
          "md:translate-x-0 md:shadow-none",
          isOpen ? "translate-x-0 shadow-lg" : "-translate-x-full",
        )}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-8">Settings</h2>
          <nav className="space-y-2">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id)
                    setIsOpen(false)
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left",
                    activeSection === item.id ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted",
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </aside>
    </>
  )
}

// Keeping it for reference but it's not imported anymore
