"use client";

import Button from "@/components/ui/Button";
import { fetchThread, getProfile } from "@/lib/actions";
import { useAppStore } from "@/lib/store";
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
  const { chatHeads, setChatHeads, setActiveChatHead, profile } = useAppStore();

  const startChat = async () => {
    if (!profile || !ad.seller) {
      console.log({ profile, seller: ad.seller });
      return;
    }
    let head = chatHeads?.find(
      (h) => h.buyer_id === buyer && h.seller_id === seller
    );

    if (!head) {
      const thread = await fetchThread({ seller, buyer });
      if (thread) {
        head = {
          ...thread,
          title: isSeller
            ? thread.buyer.username ?? "New chat"
            : thread.seller.username ?? "New chat",
        };
      } else {
        const s = isSeller ? profile : ad.seller;
        const b = isSeller ? (await getProfile(buyer)).data : profile;
        head = {
          seller_id: seller,
          seller: s,
          buyer: b,
          title: isSeller ? b.username : s.username,
          ad_id: ad.id,
          buyer_id: buyer,
          messages: [],
        };
      }
      setChatHeads(chatHeads ? [...chatHeads, head] : [head]);
    }
    setActiveChatHead(head);
  };

  return (
    <Button
      onClick={startChat}
      disabled={!Boolean(profile)}
      className="bg-accent w-full hover:bg-accent/90 text-background disabled:opacity-30 disabled:cursor-not-allowed"
    >
      <BsChatRightText className="mr-2 h-4 w-4" /> Live chat
    </Button>
  );
}
