"use client";

import Button from "@/components/ui/Button";
import { useAppStore } from "@/lib/store";
import { ChatThread, Listing } from "@/lib/types";
import React, { useEffect } from "react";
import { BsChatRightText } from "react-icons/bs";

export default function OpenChat({ thread }: { thread: ChatThread }) {
  const { setActivechatThread, setChatThreads, chatThreads } = useAppStore();

  const handleStartChat = () => {
    if (
      chatThreads &&
      !Boolean(
        chatThreads?.find(
          (t) =>
            t.me.user_id === thread.me.user_id &&
            t.you.user_id === thread.you.user_id
        )
      )
    ) {
      setChatThreads([...chatThreads, thread]);
    }
    setActivechatThread(thread);
  };
  return (
    <Button
      onClick={handleStartChat}
      className="bg-accent w-full hover:bg-accent/90 text-background disabled:opacity-30 disabled:cursor-not-allowed"
    >
      <BsChatRightText className="mr-2 h-4 w-4" /> Live chat
    </Button>
  );
}
