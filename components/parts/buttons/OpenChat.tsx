"use client";

import Button from "@/components/ui/Button";
import { Listing } from "@/lib/types";
import React from "react";
import { BsChatRightText } from "react-icons/bs";

interface ChatProps {
  ad: Listing;
  seller: string;
  buyer: string;
  isSeller: boolean;
}

export default function OpenChat({ ad, seller, buyer, isSeller }: ChatProps) {
  return (
    <Button className="bg-accent w-full hover:bg-accent/90 text-background disabled:opacity-30 disabled:cursor-not-allowed">
      <BsChatRightText className="mr-2 h-4 w-4" /> Live chat
    </Button>
  );
}
