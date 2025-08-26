"use client";

import Button from "@/components/ui/Button";
import { useBradcramps } from "@/lib/hooks/use_data";
import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";

export default function StoreLayout({ children }: { children: ReactNode }) {
  const { bradcramp } = useBradcramps();
  const pathname = usePathname();
  return (
    <>
      <div className="p-5 space-y-5">
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

          {pathname.includes("/ads") && !pathname.includes("/create") ? (
            <Link href="/dashboard/ads/create">
              <Button className="bg-primary py-1 gap-1 text-xs text-background">
                <Plus size={15} />
                Post new ad
              </Button>
            </Link>
          ) : pathname.startsWith("/dashboard/stores") &&
            !pathname.startsWith("/dashboard/create") ? (
            <Link href="/dashboard/stores/create">
              <Button className="bg-primary py-1 text-xs text-background">
                <Plus size={15} />
                Create a store
              </Button>
            </Link>
          ) : (
            <></>
          )}
        </div>
        {children}
      </div>
    </>
  );
}
