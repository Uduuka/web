"use client";

import OpenChat from "@/components/parts/buttons/OpenChat";
import Button from "@/components/ui/Button";
import { useAppStore } from "@/lib/store";
import { Message, Profile } from "@/lib/types";
import React, { use } from "react";
import { RxShare1 } from "react-icons/rx";
import { SlDislike, SlLike } from "react-icons/sl";
import { VscFeedback } from "react-icons/vsc";

export default function SellerCard({
  sellerPromise,
  userPromise,
  messagesPromise,
}: {
  sellerPromise: Promise<{
    data: Profile | null;
    error: { message: string } | null;
  }>;
  userPromise: Promise<{
    data: Profile | null;
    error: { message: string } | null;
  }>;
  messagesPromise: Promise<{
    data: Message[] | null;
    error: { message: string } | null;
  }>;
}) {
  const { data: you } = use(sellerPromise);
  const { data: me } = use(userPromise);
  const { data: messages, error } = use(messagesPromise);

  if (!me || !you || me.user_id == you.user_id || error) {
    return null;
  }

  return (
    <div className="bg-white flex-1 p-5 rounded-lg w-full">
      <h1 className="text-accent border-b ">Seller details</h1>
      {you && (
        <div className="flex-1 flex flex-col h-full py-5 ">
          <h1 className="text-accent/80 pb-2 capitalize">{you.full_name}</h1>
          <p className="text-accent/60 text-xs">{you.about}</p>

          <div className="flex-1">
            <div className="flex gap-5 py-4">
              <Button className="bg-secondary w-full hover:bg-secondary/90 text-xs">
                Show contacts
              </Button>
              <OpenChat thread={{ me, you, messages: messages ?? [] }} />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button className="bg-transparent hover:bg-accent/50 text-accent/80 hover:text-background  h-6 w-6 p-0 rounded-sm">
              <RxShare1 size={18} />
            </Button>{" "}
            <Button className="bg-transparent hover:bg-accent/50 text-accent/80 hover:text-background  h-6 w-6 p-0 rounded-sm">
              <SlLike size={18} />
            </Button>{" "}
            <Button className="bg-transparent hover:bg-accent/50 text-accent/80 hover:text-background  h-6 w-6 p-0 rounded-sm">
              <SlDislike size={18} />
            </Button>{" "}
            <Button className="bg-transparent hover:bg-accent/50 text-accent/80 hover:text-background  h-6 w-6 p-0 rounded-sm">
              <VscFeedback size={18} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
