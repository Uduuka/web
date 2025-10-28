"use client";

import { useAppStore } from "@/lib/store";
import { ChatHead, Message, Profile } from "@/lib/types";
import React, {
  ComponentProps,
  use,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import ScrollArea from "../layout/ScrollArea";
import Button from "@/components/ui/Button";
import { FaRegImage } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { HiOutlineEmojiHappy, HiOutlineMicrophone } from "react-icons/hi";
import { MdSend } from "react-icons/md";
import { useChatThread } from "@/lib/hooks/use_chat_threads";
import { BsExclamationCircle } from "react-icons/bs";
import { Info } from "lucide-react";

interface FormProps extends ComponentProps<"div"> {
  thread: ChatHead;
  // profilePromise: Promise<{ data: Profile | null }>;
}

export default function ChatForm({ thread }: FormProps) {
  const [message, setMessage] = useState("");
  const { messages, setMessages } = useChatThread(thread);
  const [sendError, setSendError] = useState<string>();

  const [sending, startSending] = useTransition();
  // const { data: profile } = use(profilePromise);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    startSending(async () => {});
  };
  return (
    <div className="w-full h-full flex flex-col gap-3">
      <ScrollArea
        ref={scrollAreaRef}
        maxHeight="75%"
        className="w-full flex-1 overflow-y-scroll"
      >
        <div className="flex-1 flex flex-col gap-3 p-5">
          {/* {messages.map((message, index) => (
            <MessageBody
              message={message}
              key={index}
              isSender={message.sender_id === profile?.user_id}
            />
          ))} */}
        </div>
      </ScrollArea>
      <form action={handleSend} className="px-4 space-y-3">
        {sendError && (
          <div className="px-5 py-3 text-error bg-red-100 rounded-lg flex gap-2 justify-center">
            <Info size={15} />
            <p className="text-xs">{sendError}</p>
          </div>
        )}
        <div className="bg-background rounded-sm p-3">
          <textarea
            name="message"
            placeholder="Type a message here"
            rows={2}
            id=""
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            className="w-full text-sm h-full p-0 bg-background resize-none outline-none placeholder:text-accent/70 text-foreground"
          />
          <div className="flex gap-3 items-center">
            <Button
              type="button"
              className="text-slate-500 hover:text-sky-950 bg-transparent p-0 text-xl"
            >
              <FaRegImage />
            </Button>
            <Button
              type="button"
              className="text-slate-500 hover:text-sky-950 bg-transparent p-0 text-xl"
            >
              <ImAttachment />
            </Button>
            <Button
              type="button"
              className="text-slate-500 hover:text-sky-950 bg-transparent p-0 text-xl"
            >
              <HiOutlineEmojiHappy />
            </Button>
            <div className="w-full" />
            <Button
              type="button"
              className="text-slate-500 hover:text-sky-950 bg-transparent p-0 text-xl"
            >
              <HiOutlineMicrophone size={25} />
            </Button>
            <Button
              type="submit"
              className="py-1 px-2 bg-transparent text-accent hover:text-success"
            >
              <MdSend size={30} />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

const MessageBody = ({
  message,
  isSender,
}: {
  message: Message;
  isSender: boolean;
}) => {
  return (
    <div
      className={`w-fit max-w-[90%] flex items-center justify-between gap-2 rounded-lg px-5 py-2 text-sm font-thin ${
        isSender
          ? "bg-sky-100 text-sky-700"
          : "ml-auto bg-emerald-100 text-emerald-500"
      } `}
    >
      <p className="w-full">{message.text}</p>
      {message.status === "error" && isSender && (
        <span className="text-error font-extralight">
          <BsExclamationCircle />
        </span>
      )}
    </div>
  );
};
