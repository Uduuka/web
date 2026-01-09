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
      <div className="space-y-5 p-3">{children}</div>
    </>
  );
}
