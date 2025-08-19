import PayementRequestForm from "@/components/parts/forms/PayementRequestForm";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; method?: string }>;
}) {
  const { plan, method } = await searchParams;

  const ammount = "30,000";

  return (
    <div className="p-5">
      <div className="p-5 bg-white max-w-lg mx-auto text-accent rounded-lg shadow text-center">
        <h1 className="text-2xl font-bold mb-2">Payement details</h1>

        <p className="mt-2 text-primary font-bold max-w-[20rem] mx-auto">
          You're subscribing to the {plan} plan <br />
          <span className="font-[700] text-2xl">at Ugx {ammount}</span>
          <br />
          per month
        </p>
        <div className="p-5 text-center space-y-5 border-4 transition-all duration-500   rounded-lg border-primary w-fit mx-auto mt-5">
          <h1 className="text-xl font-bold">Select a payement method</h1>
          <div className="flex gap-5 justify-center items-center">
            <div className="flex flex-col gap-1">
              <Link
                href={`?plan=${plan}&method=mtn`}
                className="p-0 shadow hover:shadow-2xl transition-all duration-500 rounded-lg overflow-hidden"
              >
                <Image
                  height={100}
                  width={100}
                  src="/logos/mtn.jpg"
                  alt="MTN"
                  className="w-full max-w-20 h-auto hover:scale-110 transition-all duration-500"
                />
              </Link>
              <div
                className={`h-1 bg-amber-400 rounded transition-all duration-500 w-0 ${
                  method === "mtn" ? "w-full" : "w-0"
                }`}
              ></div>
            </div>
            <h1 className="text-xl font-bold">Or</h1>
            <div className="flex flex-col gap-1">
              <Link
                href={`?plan=${plan}&method=airtel`}
                className="p-0 shadow hover:shadow-2xl transition-all duration-500 rounded-lg overflow-hidden"
              >
                <Image
                  height={100}
                  width={100}
                  src="/logos/airtel.jpg"
                  alt="Airtel"
                  className="w-full max-w-20 h-auto hover:scale-110 transition-all duration-500"
                />
              </Link>
              <div
                className={`h-1 bg-red-600 rounded transition-all duration-500 w-0 ${
                  method === "airtel" ? "w-full" : "w-0"
                }`}
              ></div>
            </div>
          </div>
          <PayementRequestForm />
        </div>
      </div>
    </div>
  );
}
