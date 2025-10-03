"use client";

import Button from "@/components/ui/Button";
import FormGroup from "@/components/ui/FormGroup";
import FormInput from "@/components/ui/Input";
import { requestToPay } from "@/lib/actions";
import { toMoney } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from "react";

export default function PayementRequestForm() {
  const method = useSearchParams().get("method") as "mtn" | "airtel";
  const plan = useSearchParams().get("plan") as "pro" | "entreprise";

  const [months, setMonths] = useState(1);
  const [ammount, setAmmount] = useState(30000);
  const [number, setNumber] = useState("");

  const [payementError, setPayementError] = useState<string>();

  useEffect(() => {
    setAmmount(() => 30000 * months);
  }, [months]);

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!isNaN(Number(value)) && value.length <= 10) {
      setNumber(value);
    }
  };

  const handleSubmit = async () => {
    if (!method || !["mtn", "airtel"].includes(method)) {
      setPayementError("Insuficient details");
      console.log("Insuficient details");
      return;
    }
    const details = { plan, provider: method, phone: number, months };
    const { error, data } = await requestToPay(details);
    console.log({ error, data });
    if (error) {
      setPayementError(`Failed to initiate payements. ${error.message ?? ""}`);
      return;
    }

    console.log({ data });
  };

  if (!method) {
    return null;
  }

  return (
    <form action={handleSubmit}>
      {payementError && (
        <div className="bg-red-50 px-4 py-2 rounded-lg text-error text-center">
          {payementError}
        </div>
      )}
      <div className="space-y-4 max-w-sm">
        <FormGroup label="Mobile number" className="text-left">
          <FormInput
            className=""
            value={number}
            onChange={handleNumberChange}
            wrapperStyle="border-2"
            placeholder={`Enter an ${method} number`}
          />
        </FormGroup>
        <div className="flex gap-4">
          <FormGroup label="Months" className="text-left w-fit">
            <div className="flex gap-3 items-center border-2 rounded-md py-1 px-3 border-secondary">
              <h1 className="w-fit">{months}</h1>
              <div className="flex">
                <Button
                  type="button"
                  onClick={() => setMonths((months) => months + 1)}
                  className="p-1 bg-transparent hover:bg-secondary"
                >
                  <Plus size={10} />
                </Button>
                <Button
                  type="button"
                  disabled={months < 2}
                  onClick={() => setMonths((months) => months - 1)}
                  className="p-1 bg-transparent hover:bg-secondary"
                >
                  <Minus size={10} />
                </Button>
              </div>
            </div>
          </FormGroup>
          <FormGroup label="Ammount" className="text-left">
            <FormInput
              className=""
              value={toMoney(ammount.toString())}
              icon={<span className="px-2">Ugx</span>}
              onChange={() => {}}
              wrapperStyle="border-2"
            />
          </FormGroup>
        </div>
      </div>
      <div className="flex gap-5 pt-5 justify-center">
        <Button
          type="submit"
          disabled={!number || number.length < 10}
          className="bg-primary w-full text-background shadow disabled:opacity-20"
        >
          Pay now
        </Button>
        <Link href={`/dashboard/billing/pay?plan=${plan}`} className="w-full">
          <Button className="border-error border-2 bg-transparent w-full text-error shadow">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
