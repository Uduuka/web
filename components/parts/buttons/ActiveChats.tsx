"use client";

import Button from "@/components/ui/Button";
import Popup from "@/components/ui/Popup";
import React from "react";
import ChatPanel from "../sidePanels/ChatPanel";
import { useAppStore } from "@/lib/store";
import Image from "next/image";
import { BsChatRightText } from "react-icons/bs";

export default function ActiveChats() {
  const { chatHeads, activeChatHead, setActiveChatHead } = useAppStore();

  if (activeChatHead) {
    return <ChatPanel />;
  }

  if (chatHeads && chatHeads.length > 0) {
    return (
      <div className="fixed bottom-5 right-5">
        <Popup
          trigger={
            <Button className="bg-accent text-background shadow-lg h-10 w-10 relative rounded-full">
              <BsChatRightText size={30} />
              <span className="absolute h-4 w-4 bg-primary text-background top-0 -right-2 rounded-full text-xs justify-center items-center">
                {chatHeads.length}
              </span>
            </Button>
          }
          align="diagonal-left"
          contentStyle="w-60 bg-secondary h-fit max-h-96"
        >
          <div className="">
            {chatHeads?.map((head, index) => (
              <Button
                key={index}
                className="bg-accent w-full text-background justify-start gap-2"
                onClick={() => {
                  setActiveChatHead(head);
                }}
              >
                <Image
                  src={"/placeholder.svg"}
                  height={100}
                  width={100}
                  alt="chat-head"
                  className="h-10 w-10 rounded-full"
                />
                <span className="flex flex-col gap-0.5 text-xs text-left">
                  <span>{head.title}</span>
                  <span className="font-light line-clamp-1 text-background/50">
                    Last message will appear here
                  </span>
                </span>
              </Button>
            ))}
          </div>
        </Popup>
      </div>
    );
  }

  return null;
}
