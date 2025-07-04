"use client";

import Button from "@/components/ui/Button";
import { fetchAds, testView } from "@/lib/dev_db/db";
import React from "react";

export default function TestButon() {
  return (
    <Button onClick={fetchAds} className="bg-primary text-background">
      TestButon
    </Button>
  );
}
