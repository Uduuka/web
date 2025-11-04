"use client";

import { useAppStore } from "@/lib/store";
import SidePane from "./SidePane";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ChatForm from "../forms/ChatForm";

export default function ChatPanel() {
  const router = useRouter();
  const { activechatThread, setActivechatThread, chatThreads, setChatThreads } =
    useAppStore();

  const closePane = () => {
    setActivechatThread(undefined);
  };

  const handleMaximise = () => {
    closePane();
    router.push(`/dashboard/chat?chat=${activechatThread?.you.user_id}`);
  };

  const handleClose = () => {
    closePane();
    const heads = chatThreads?.filter((head) => head !== activechatThread);
    setChatThreads(heads);
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
            <h1 className="text-background">
              {activechatThread?.you.full_name}
            </h1>
            <p className="text-xs font-light">
              last seen {new Date().toDateString()}
            </p>
          </div>
        </div>
      }
    >
      <ChatForm />
    </SidePane>
  );
}
