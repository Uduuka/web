"use client";

import ChatForm from "@/components/parts/forms/ChatForm";
import ScrollArea from "@/components/parts/layout/ScrollArea";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/Input";
import { fetchThreads, getUser } from "@/lib/actions";
import { useAppStore } from "@/lib/store";
import { ChatHead } from "@/lib/types";
import Image from "next/image";
import React, { useEffect, useState, useTransition } from "react";

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
    <div className="p-5 space-y-5">
      <div className="p-5 bg-white rounded-lg ">
        <h1 className="text-accent">My chats</h1>
      </div>
      <div className="flex gap-5">
        <div className="flex flex-col space-y-2 bg-white rounded-lg p-2 w-[25rem] h-[77vh]">
          <FormInput
            className="w-full px-3 text-xs py-2 text-accent"
            wrapperStyle="border-accent"
            placeholder="Search for chat threads"
          />
          <ScrollArea maxHeight="100%" className="flex-1">
            <div className="h-max w-full space-y-2">
              {threads?.map((t, i) => {
                const isSeller = t.seller_id === profile?.user_id;
                return (
                  <Button
                    className="flex gap-2 w-full justify-start bg-transparent hover:bg-secondary/30"
                    key={i}
                    onClick={() => {
                      setActiveThread(t);
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
                      <h2 className="text-xs">
                        {isSeller ? t.seller.username : t.buyer.username}
                      </h2>
                      <p className="text-xs font-light text-accent/80 line-clamp-1">
                        Last message will be here
                      </p>
                    </div>
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </div>
        <div className="bg-white w-full rounded-lg h-[77vh]">
          {activeThread ? (
            <ChatForm thread={activeThread} />
          ) : (
            <div className=""></div>
          )}
        </div>
      </div>
    </div>
  );
}
