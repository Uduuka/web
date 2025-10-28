"use client";

import Button from "@/components/ui/Button";
import Dropdown from "@/components/ui/Dropdown";
import { Category } from "@/lib/types";
import { Search } from "lucide-react";
import {
  redirect,
  useParams,
  usePathname,
  useSearchParams,
} from "next/navigation";
import React, { KeyboardEvent, use, useState } from "react";
import { IoMenu } from "react-icons/io5";
import CategoryButton from "../buttons/CategoryButton";
import ScrollArea from "../layout/ScrollArea";

export default function SearchBar({
  categoriesPromise,
}: {
  categoriesPromise?: Promise<{
    data: Category[] | null;
    error: { message: string } | null;
  }>;
}) {
  const search = useSearchParams().get("search");
  const adID = useParams()["adID"] as string | undefined;
  const pathname = usePathname();

  const [searchText, setSearchText] = useState(search ?? "");
  const { data: categories } = categoriesPromise
    ? use(categoriesPromise)
    : { data: [] };
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
    <div className="flex gap-2 justify-center items-center w-full relative">
      <div className="items-center flex w-full max-w-lg mx-auto">
        <Dropdown
          className="md:hidden p-0"
          align="left"
          trigger={
            <Button className="bg-background h-full text-gray-500 border-r rounded-r-none">
              <IoMenu size={24} />
            </Button>
          }
        >
          <div className="w-[90vw] max-w-60 bg-background text-gray-500 py-3 h-fit shadow-2xl rounded-lg">
            <ScrollArea className="px-3">
              {categories?.map((cat, i) => (
                <CategoryButton key={i} category={cat} />
              ))}
            </ScrollArea>
          </div>
        </Dropdown>
        <input
          value={searchText}
          onKeyDown={handleKeyDown}
          placeholder="Search here"
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
          className="bg-background md:rounded-l-lg text-base text-gray-600 w-full py-1 px-3 outline-none h-fit active:outline-none focus:outline-none border-none shadow-none"
        />
        <Button
          onClick={handleSearch}
          className="rounded-none bg-background rounded-r-lg text-primary border-background"
        >
          <Search />
        </Button>
      </div>
    </div>
  );
}
