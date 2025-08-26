"use client";

import React, { useEffect, useState, useTransition } from "react";
import ChatForm from "@/components/parts/forms/ChatForm";
import ScrollArea from "@/components/parts/layout/ScrollArea";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/Input";
import { fetchThreads } from "@/lib/actions";
import { useChatThread } from "@/lib/hooks/use_chat_threads";
import { useAppStore } from "@/lib/store";
import { ChatHead, Message } from "@/lib/types";
import Image from "next/image";
import { Info } from "lucide-react";

export default function page() {
  const [threads, setThreads] = useState<ChatHead[]>();
  const [activeThread, setActiveThread] = useState<ChatHead>();

  const [fetchingThreads, startFetchingThreads] = useTransition();

  useEffect(() => {
    startFetchingThreads(async () => {
      const { data } = await fetchThreads();

      if (data) {
        setThreads(data as ChatHead[]);
      }
    });
  }, []);

  const { profile } = useAppStore();

  return (
    <div className="space-y-5">
      <div className="flex gap-5 flex-col sm:flex-row">
        <div className="flex flex-col space-y-2 bg-white rounded-lg p-2 w-full sm:w-[25rem] sm:h-[77vh]">
          <FormInput
            className="w-full px-3 text-xs py-2 text-accent"
            wrapperStyle="border-accent"
            placeholder="Search for chat threads"
          />

          <ScrollArea maxHeight="100%" maxWidth="100%" className="flex-1">
            <div className="h-max w-full">
              {(threads?.length ?? 0) > 0 ? (
                threads?.map((t, i) => {
                  const isSeller = t.seller_id === profile?.user_id;
                  return (
                    <ThreadButton
                      key={i}
                      thread={t}
                      isActive={activeThread === t}
                      activate={setActiveThread}
                      title={
                        (isSeller ? t.buyer.name : t.seller.name) ?? "New chat"
                      }
                    />
                  );
                })
              ) : (
                <p className="text-gray-400 flex items-start gap-1 p-5">
                  <Info width={100} />
                  <span>
                    You {"don't"} have any chat threads and you {"aren't"}{" "}
                    connected to any sellers or buyers. Past chat or connections
                    will appear here
                  </span>
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
        <div className="bg-white w-full rounded-lg h-[77vh] pt-5 flex flex-col justify-center items-center">
          {activeThread ? (
            <ChatForm thread={activeThread} />
          ) : (
            <p className="text-gray-400 flex items-start justify-start gap-1 p-5">
              <Info size={20} />
              <span>Select a chat head to start chating.</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const ThreadButton = ({
  thread,
  isActive,
  activate,
  title,
}: {
  thread: ChatHead;
  isActive: boolean;
  title: string;
  activate: (t: ChatHead) => void;
}) => {
  const { messages } = useChatThread(thread);
  const { profile } = useAppStore();

  const [unread, setUnread] = useState(0);
  const [lastMessage, setLastMessage] = useState<Message>();

  useEffect(() => {
    const ur = messages.filter(
      (m) => m.sender_id !== profile?.user_id && m.status !== "read"
    );
    setUnread(ur.length);
    setLastMessage(messages[messages.length - 1]);
  }, [messages]);
  return (
    <Button
      className={`flex gap-2 w-fit sm:w-full relative justify-start bg-transparent hover:bg-secondary/50  relative${
        isActive && "bg-secondary/70"
      }`}
      onClick={() => {
        activate(thread);
      }}
    >
      <Image
        src={`/placeholder.svg`}
        alt="chat"
        height={100}
        width={100}
        className="h-10 w-10 rounded-full"
      />
      <div className="fex flex-col items-start text-left">
        <h2 className="text-xs flex gap-2 w-fit">
          <span className="w-full">{title}</span>
          {/* {unread > 0 && <span className="text-emerald-400">{unread}</span>} */}
        </h2>
        <p className="text-xs font-light text-accent/80 line-clamp-1">
          {lastMessage?.text}
        </p>
      </div>
      {unread > 0 && (
        <span className="p-1 rounded-full absolute -top-2 -right-2 bg-primary text-background">
          {unread}
        </span>
      )}
    </Button>
  );
};
