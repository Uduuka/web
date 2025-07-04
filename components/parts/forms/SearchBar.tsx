"use client";

import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/Input";
import {
  redirect,
  useParams,
  usePathname,
  useSearchParams,
} from "next/navigation";
import React, { KeyboardEvent, KeyboardEventHandler, useState } from "react";

export default function SearchBar() {
  const search = useSearchParams().get("search");
  const adID = useParams()["adID"] as string | undefined;
  const pathname = usePathname();

  const [searchText, setSearchText] = useState(search ?? "");

  const handleSearch = () => {
    if (!searchText) {
      redirect(pathname);
    }
    if (pathname === "/" || adID) {
      redirect(`/ads?search=${searchText}`);
    } else {
      redirect(`${pathname}?search=${searchText}`);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <div className="flex gap-2 justify-center items-center">
      <FormInput
        placeholder="Search here"
        className="bg-background text-foreground w-full py-2 px-3 min-w-96"
        wrapperStyle="border-0 w-full max-w-lg"
        value={searchText}
        onKeyDown={handleKeyDown}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <Button
        onClick={handleSearch}
        className="bg-background hover:bg-secondary text-sm text-primary py-2 px-3 border-l-2 border-secondary"
      >
        Search
      </Button>
    </div>
  );
}
