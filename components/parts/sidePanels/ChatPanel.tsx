"use client";

import { useAppStore } from "@/lib/store";
import SidePane from "./SidePane";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ChatForm from "../forms/ChatForm";

export default function ChatPanel() {
  const router = useRouter();
  const { activeChatHead, setActiveChatHead, chatHeads, setChatHeads } =
    useAppStore();

  const closePane = () => {
    setActiveChatHead(undefined);
  };

  const handleMaximise = () => {
    closePane();
    router.push(
      `/dashboard/chat?b=${activeChatHead?.buyer_id}&s=${activeChatHead?.seller_id}`
    );
  };

  const handleClose = () => {
    closePane();
    const heads = chatHeads?.filter((head) => head !== activeChatHead);
    setChatHeads(heads);
  };

  return (
    <SidePane
      triggerText="Live chat"
      triggerStyle="bg-accent w-full hover:bg-accent/90 text-background"
      onMinimise={closePane}
      onMaximise={handleMaximise}
      open={true}
      handleClose={handleClose}
      className="h-full flex flex-col"
      header={
        <div className="flex gap-2">
          <Image
            src={"/placeholder.svg"}
            height={100}
            width={100}
            alt="chat-head"
            className="h-10 w-10 rounded-full"
          />
          <div className="w-full">
            <h1 className="text-background">{activeChatHead?.title}</h1>
            <p className="text-xs font-light">
              last seen {new Date().toDateString()}
            </p>
          </div>
        </div>
      }
    >
      <ChatForm thread={activeChatHead!} />
    </SidePane>
  );
}
