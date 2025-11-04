"use client";

import Button from "@/components/ui/Button";
import { useBradcramps } from "@/lib/hooks/use_data";
import { Plus, Store } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React, { ReactNode } from "react";

export default function StoreLayout({ children }: { children: ReactNode }) {
  const { bradcramp } = useBradcramps();
  const pathname = usePathname();
  const storeID = useParams()["storeID"] as string;
  return (
    <>
      <div className="p-5 space-y-5">
        {!pathname.startsWith("/dashboard/chat") && (
          <div className="px-5 flex items-center justify-between rounded-lg bg-white h-10">
            <h1 className="text-lg flex gap-2 items-center justify-center font-[200] text-gray-500">
              <Link href={`/dashboard`} className="hover:underline">
                Dashboard
              </Link>
              {pathname === "/dashboard" && (
                <>
                  |{" "}
                  <span className="text-sm capitalize pt-0.5">
                    Account overview
                  </span>
                </>
              )}
              {bradcramp && (
                <>
                  <span className="text-sm">/</span>
                  <span className="text-sm capitalize">{bradcramp}</span>
                </>
              )}
            </h1>

            <div className="w-fit flex gap-2">
              <Link
                href={`/dashboard/ads/create${
                  storeID ? `?store=${storeID}` : ""
                }`}
              >
                <Button className="bg-transparent text-primary py-1 gap-1 text-xs border border-primary">
                  <Plus size={15} />
                  Post new ad
                </Button>
              </Link>
              <Link href="/dashboard/stores/create">
                <Button className="bg-transparent text-primary py-1 gap-2 text-xs border border-primary">
                  <Store size={15} />
                  Create a store
                </Button>
              </Link>
            </div>
          </div>
        )}
        {children}
      </div>
    </>
  );
}
