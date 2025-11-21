"use client";

import { cn } from "@/lib/utils";
import React, { useState, useEffect, ComponentProps } from "react";

interface NumberInputProps {
  value?: number;
  onChange?: (value: number) => void;
  placeholder?: string;
  className?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
}

const NumberInput: React.FC<NumberInputProps> = ({
  value: propValue,
  onChange,
  placeholder = "Enter a number",
  className = "",
  min,
  max,
  disabled,
}) => {
  const [displayValue, setDisplayValue] = useState<string>("");

  // Format number with commas
  const formatNumber = (num?: number): string => {
    return num?.toLocaleString("en-US") ?? "";
  };

  // Parse comma-separated string to number
  const parseNumber = (str: string): number => {
    const cleaned = str.replace(/,/g, "");
    return parseFloat(cleaned) || 0;
  };

  // Sync prop value to display value
  useEffect(() => {
    if (propValue !== undefined) {
      setDisplayValue(propValue === 0 ? "0" : formatNumber(propValue));
    }
  }, [propValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;

    // Allow only numbers and commas (commas will be auto-inserted)
    const cleaned = input.replace(/[^0-9]/g, "");

    if (cleaned === "") {
      setDisplayValue("");
      onChange?.(0);
      return;
    }

    const numValue = parseInt(cleaned, 10);

    // Respect min/max
    if (
      (min !== undefined && numValue < min) ||
      (max !== undefined && numValue > max)
    ) {
      return;
    }

    setDisplayValue(formatNumber(numValue));
    onChange?.(numValue);
  };

  const handleBlur = () => {
    if (displayValue === "" || displayValue === "0") {
      setDisplayValue("0");
      onChange?.(0);
    }
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={cn(
        "rounded-md px-3 py-1 focus:outline-none focus:ring-0 border-0",
        className
      )}
      disabled={disabled}
      min={min}
      max={max}
    />
  );
};

export default NumberInput;
