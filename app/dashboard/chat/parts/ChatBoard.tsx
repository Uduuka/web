"use client";

import ChatForm from "@/components/parts/forms/ChatForm";
import { useAppStore } from "@/lib/store";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function ChatBoard() {
  const chat_id = useSearchParams().get("chat");
  const { activechatThread, setActivechatThread, chatThreads } = useAppStore();
  useEffect(() => {
    setActivechatThread(chatThreads?.find((t) => t.you.user_id === chat_id));
  }, [chat_id, chatThreads]);

  if (!activechatThread) {
    return null;
  }
  return <ChatForm />;
}
