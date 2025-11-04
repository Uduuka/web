"use client";

import React from "react";
import SearchBar from "../../forms/SearchBar";
import { Category } from "@/lib/types";
import { usePathname } from "next/navigation";

export default function MobileSearhBar({
  categoriesPromise,
}: {
  categoriesPromise: Promise<{
    data: Category[] | null;
    error: { message: string } | null;
  }>;
}) {
  const pathName = usePathname();

  if (pathName.startsWith("/dashboard")) {
    return null;
  }
  return (
    <div className="flex md:hidden px-5 pt-5">
      <SearchBar categoriesPromise={categoriesPromise} />
    </div>
  );
}
