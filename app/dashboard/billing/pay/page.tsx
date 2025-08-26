import PayementRequestForm from "@/components/parts/forms/PayementRequestForm";
import Button from "@/components/ui/Button";
import { getProfile } from "@/lib/actions";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; method?: string }>;
}) {
  const { plan, method } = await searchParams;

  const ammount = "30,000";
  const { data, error } = await getProfile();

  if (error) {
    return (
      <div className="flex flex-col gap-5 text-accent">
        <div className="flex justify-center items-center py-20">
          <div className="bg-red-50 p-5 shadow rounded-lg text-error font-light text-center">
            <p>
              An error occured while fetching subscription data. <br /> Check
              your internet conectivity and try again or contact support.
            </p>
            <Link href="#">
              <Button className="bg-primary text-background mt-3 mx-auto">
                Contact support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return redirect(`/dashboard/profile?next=pay&sq=plan=${plan}`);
  }

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
