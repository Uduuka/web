"use client";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { ChatThread, Message, Profile } from "@/lib/types";
import Image from "next/image";
import { getProfile } from "@/lib/actions";
import { useAppStore } from "@/lib/store";

export default function ThreadButton({
  thread,
}: {
  thread: { me: Profile; you: string; messages: Message[] };
}) {
  const [chatThread, setChatThread] = useState<ChatThread>();
  const { setChatThreads, setActivechatThread, chatThreads } = useAppStore();
  useEffect(() => {
    (async () => {
      const { data: you } = await getProfile(thread.you);
      if (!you) {
        return;
      }
      setChatThread({ ...thread, you });
      if (chatThreads?.find((t) => t.you.user_id === you.user_id)) return;
      setChatThreads([...(chatThreads ?? []), { ...thread, you }]);
    })();
  }, []);
  return (
    <Button
      onClick={() => {
        setActivechatThread(chatThread);
      }}
      className={`flex gap-2 w-fit sm:w-full min-w-40 relative justify-start bg-gray-100 hover:bg-gray-200`}
    >
      <Image
        src={chatThread?.you.avatar_url ?? `/placeholder.svg`}
        alt="chat"
        height={100}
        width={100}
        className="h-10 w-10 rounded-full"
      />
      <div className="fex flex-col items-start text-left">
        <h2 className="text-xs flex gap-2 w-fit">
          <span className="w-full capitalize">{chatThread?.you.full_name}</span>
        </h2>
        {/* <p className="text-xs font-light text-accent/80 line-clamp-1">
          {chatThread?.messages?.pop()?.text}
        </p> */}
      </div>
    </Button>
  );
}
