"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  align?: "center" | "left" | "right";
}

export default function Dropdown({
  trigger,
  children,
  className = "",
  align = "left",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard events
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  };

  // Focus management
  useEffect(() => {
    if (isOpen && contentRef.current) {
      const focusable = contentRef.current.querySelectorAll(
        'a, button, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length) {
        (focusable[0] as HTMLElement).focus();
      }
    }
  }, [isOpen]);

  const setPosition = () => {
    return align === "left"
      ? "left-0"
      : align === "right"
      ? "right-0"
      : "left-[50%] translate-x-[-50%]";
  };

  return (
    <div
      className={`relative ${className}`}
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-controls="dropdown-content"
      >
        {trigger}
      </div>
      {isOpen && (
        <div
          id="dropdown-content"
          ref={contentRef}
          className={cn("absolute z-10 top-full pt-2", setPosition())}
          role="menu"
          aria-labelledby="dropdown-trigger"
        >
          {children}
        </div>
      )}
    </div>
  );
}
