import FormGroup from "@/components/ui/FormGroup";
import FormInput from "@/components/ui/Input";
import NumberInput from "@/components/ui/NumberInput";
import { Currency } from "@/lib/types";
import { toMoney } from "@/lib/utils";
import React, { ReactNode } from "react";

export default function MoneyInput({
  money,
  setMoney,
  currency,
  label,
  actionBtn,
}: {
  money: number;
  currency: Currency;
  setMoney: (m: number) => void;
  label?: string;
  actionBtn?: ReactNode;
}) {
  return (
    <FormGroup label={label ?? "Price"} className=" w-full">
      <div className="flex items-center border border-gray-500 rounded-lg">
        <span className="pl-3">{currency}</span>
        <NumberInput value={money ?? ""} onChange={(n) => setMoney(n)} />
        {actionBtn}
      </div>
    </FormGroup>
  );
}
