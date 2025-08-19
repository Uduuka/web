"use client";

import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/Input";
import { useAppStore } from "@/lib/store";
import { Search } from "lucide-react";
import {
  redirect,
  useParams,
  usePathname,
  useSearchParams,
} from "next/navigation";
import React, { KeyboardEvent, useEffect, useState } from "react";

export default function SearchBar() {
  const search = useSearchParams().get("search");
  const adID = useParams()["adID"] as string | undefined;
  const pathname = usePathname();

  const { deviceWidth } = useAppStore();

  const [searchText, setSearchText] = useState(search ?? "");
  const [isMobile, setIsMobile] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    setIsMobile(deviceWidth! < 768);
  }, [deviceWidth]);

  const handleSearch = () => {
    setSearching(false);
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
    <div className="flex gap-2 justify-center items-center w-full relative">
      <FormInput
        placeholder="Search here"
        className="bg-background text-foreground w-full py-2 px-3"
        wrapperStyle="border-0 w-full max-w-lg"
        value={searchText}
        onKeyDown={handleKeyDown}
        onChange={(e) => setSearchText(e.target.value)}
        actionBtn={
          <Button
            onClick={handleSearch}
            className="rounded-none bg-background border-2 text-primary border-background"
          >
            <Search />
          </Button>
        }
      />
    </div>
  );
}
