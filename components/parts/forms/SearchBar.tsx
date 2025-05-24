"use client";

import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/Input";
import { useAppStore } from "@/lib/store";
import React, { useState } from "react";

export default function SearchBar() {
  const [searchText, setSearchText] = useState("");
  const { filters, setfilters } = useAppStore();
  const handleSearch = () => {
    setfilters({ ...filters, search: searchText });
  };
  return (
    <div className="flex gap-2 justify-center items-center">
      <FormInput
        placeholder="Search here"
        className="bg-background text-foreground w-full py-2 px-3 min-w-96"
        wrapperStyle="border-0 w-full max-w-lg"
        value={searchText}
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
