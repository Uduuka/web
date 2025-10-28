"use client";

import { PlaceOrder } from "@/components/parts/cards/PlaceOrder";
import ShoppingCart from "@/components/parts/cards/ShoppingCart";
import Button from "@/components/ui/Button";
import { Profile, Store } from "@/lib/types";
import { Check } from "lucide-react";
import Link from "next/link";
import React, { use, useState } from "react";

export default function ClientPage({
  profilePromise,
}: {
  profilePromise: Promise<{
    data: Profile | null;
    error: { message: string } | null;
  }>;
}) {
  const [success, setSuccess] = useState<{ message: string; store: Store }>();
  const { data } = use(profilePromise);

  return (
    <div className="p-5 flex gap-5 flex-col-reverse sm:flex-row md:flex-col-reverse lg:flex-row">
      <div className="w-full h-[80vh] flex flex-col overflow-hidden bg-white rounded-lg">
        {success ? (
          <div className="p-5 bg-green-50 text-success flex flex-col items-center justify-center min-h-60">
            <p className="w-full text-xs max-w-sm flex gap-1">
              <Check size={15} /> {success.message}
            </p>
            <div className="flex gap-5 pt-5 w-full justify-center items-center">
              <Link
                href={`/stores/${success.store.id}`}
                className="w-fit block"
              >
                <Button className="bg-transparent line-clamp-1 text-success border hover:bg-success hover:text-background border-success">
                  Continue shopping
                </Button>
              </Link>
              {success.message.toLowerCase().includes("inquiry") && (
                <Link
                  href={`/dashboard/invoices?sid=${success.store.id}`}
                  className="w-fit block"
                >
                  <Button className="bg-transparent line-clamp-1 border hover:bg-success hover:text-background border-success text-success">
                    Go to invoices
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <ShoppingCart mode="page" />
        )}
      </div>
      <div className="w-full sm:max-w-[24rem] md:max-w-full lg:max-w-[24rem] bg-white h-fit p-5 rounded-lg">
        <PlaceOrder setSuccess={setSuccess} profile={data} />
      </div>
    </div>
  );
}
