"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useState, useRef, useEffect, ComponentProps } from "react";
import Button from "./Button";

interface SelectOptions<T> {
  value: T;
  label: string;
}

interface SelectProps<T> {
  options: SelectOptions<T>[];
  value: T;
  onChange: (value: T) => void;
  triggerStyle?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function Select<T>({
  options,
  value,
  onChange,
  placeholder = "Select",
  className,
  triggerStyle,
  disabled,
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen && event.key !== "Enter" && event.key !== " ") return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setIsOpen(true);
        setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        event.preventDefault();
        setIsOpen(true);
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (isOpen && focusedIndex >= 0) {
          onChange(options[focusedIndex].value);
          setIsOpen(false);
          setFocusedIndex(-1);
        } else {
          setIsOpen(!isOpen);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setFocusedIndex(-1);
        buttonRef.current?.focus();
        break;
    }
  };

  // Focus menu item when navigating with keyboard
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && menuRef.current) {
      const items = menuRef.current.querySelectorAll("li");
      items[focusedIndex]?.focus();
    }
  }, [focusedIndex, isOpen]);

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || placeholder;

  return (
    <div
      className={cn("relative rounded-md", className)}
      ref={selectRef}
      onKeyDown={handleKeyDown}
      aria-disabled={disabled}
    >
      <Button
        type="button"
        disabled={disabled}
        ref={buttonRef}
        className={cn(
          "py-1 px-2 rounded-md text-xs shadow flex items-center gap-5 justify-between",
          triggerStyle
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span>{selectedLabel}</span>
        <svg
          className={`w-4 h-4 transition-all transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </Button>
      {isOpen && (
        <ul
          ref={menuRef}
          className="absolute z-10 mt-1 w-full bg-background shadow-md rounded-md text-uduuka-gray text-sm"
          role="listbox"
          aria-activedescendant={
            focusedIndex >= 0 ? `option-${focusedIndex}` : undefined
          }
        >
          {options.map((option, index) => (
            <li
              key={`${option.value}`}
              id={`option-${index}`}
              className={`px-3 cursor-pointer hover:bg-secondary/10 text-xs py-2 items-center flex justify-between gap-1 ${
                index === focusedIndex ? "bg-secondary" : ""
              }`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
                setFocusedIndex(-1);
                buttonRef.current?.focus();
              }}
              role="option"
              aria-selected={option.value === value}
              tabIndex={-1}
            >
              {option.label}
              {value === option.value && <Check size={16} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
