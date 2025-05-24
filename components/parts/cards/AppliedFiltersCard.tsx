"use client";

import React from "react";

export default function AppliedFiltersCard() {
  return (
    <div className="p-5 bg-white rounded-lg mb-5">
      <h1 className="min-w-60 text-accent/90 pb-2">Applied filters:</h1>
      <div className="flex flex-wrap w-full">
        <p className="text-accent/50">
          Once you apply any filters, they will apear here.
        </p>
      </div>
    </div>
  );
}
