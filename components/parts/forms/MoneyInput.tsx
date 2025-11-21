import FormGroup from "@/components/ui/FormGroup";
import NumberInput from "@/components/ui/NumberInput";
import { Currency } from "@/lib/types";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

export default function MoneyInput({
  money,
  setMoney,
  currency,
  label,
  actionBtn,
  placeholder,
  disabled,
  className,
  moneyStyle,
}: {
  money?: number;
  currency: Currency;
  setMoney: (m: number) => void;
  label?: string;
  actionBtn?: ReactNode;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  moneyStyle?: string;
}) {
  return (
    <FormGroup label={label ?? "Price"} className={cn("w-full ", className)}>
      <div
        className={cn(
          "flex items-center border border-gray-500 rounded-lg w-full font-bold ",
          moneyStyle
        )}
      >
        <span className="pl-2">{currency}</span>
        <NumberInput
          value={money}
          disabled={disabled}
          className={cn("w-full")}
          onChange={(n) => setMoney(n)}
          placeholder={placeholder ?? "Enter money here"}
        />
        {actionBtn}
      </div>
    </FormGroup>
  );
}
