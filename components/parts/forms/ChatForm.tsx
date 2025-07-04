"use client";

import { useAppStore } from "@/lib/store";
import { ChatHead, Message } from "@/lib/types";
import React, {
  ComponentProps,
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
import { createChatThread, sendMessage } from "@/lib/actions";

interface FormProps extends ComponentProps<"div"> {
  thread: ChatHead;
}

const ms: Message[] = [
  {
    id: "msg_001",
    sender_id: "705dc745-a252-41a8-91ad-2954f483c305",
    text: "Hi there! Is the vintage record player still available?",
    created_at: "2025-07-03T10:00:00Z",
  },
  {
    id: "msg_002",
    sender_id: "276b3012-3bbb-4b25-9f20-53e222da40c5",
    text: "Yes, it is! It's in excellent condition. Are you interested?",
    created_at: "2025-07-03T10:05:00Z",
  },
  {
    id: "msg_003",
    sender_id: "705dc745-a252-41a8-91ad-2954f483c305",
    text: "Great! Could you tell me more about its features and if there are any noticeable flaws?",
    created_at: "2025-07-03T10:10:00Z",
  },
  {
    id: "msg_004",
    sender_id: "276b3012-3bbb-4b25-9f20-53e222da40c5",
    text: "It's a fully functional turntable with a built-in pre-amp. No major scratches or dents, just some minor wear typical for its age.",
    created_at: "2025-07-03T10:15:00Z",
  },
  {
    id: "msg_005",
    sender_id: "705dc745-a252-41a8-91ad-2954f483c305",
    text: "Sounds good. What's the asking price?",
    created_at: "2025-07-03T10:20:00Z",
  },
  {
    id: "msg_006",
    sender_id: "276b3012-3bbb-4b25-9f20-53e222da40c5",
    text: "I'm asking $150. Are you able to pick it up, or would you need it shipped?",
    created_at: "2025-07-03T10:25:00Z",
  },
  {
    id: "msg_007",
    sender_id: "705dc745-a252-41a8-91ad-2954f483c305",
    text: "I'd prefer shipping. How much would that be to Kampala, Uganda?",
    created_at: "2025-07-03T10:30:00Z",
  },
  {
    id: "msg_008",
    sender_id: "276b3012-3bbb-4b25-9f20-53e222da40c5",
    text: "Let me check shipping costs for you. I'll get back to you within the hour.",
    created_at: "2025-07-03T10:35:00Z",
  },
  {
    id: "msg_009",
    sender_id: "705dc745-a252-41a8-91ad-2954f483c305",
    text: "Perfect, thanks! Looking forward to hearing from you.",
    created_at: "2025-07-03T10:40:00Z",
  },
  {
    id: "msg_010",
    sender_id: "276b3012-3bbb-4b25-9f20-53e222da40c5",
    text: "Just checked! Shipping to Kampala would be an additional $40. Are you still interested?",
    created_at: "2025-07-03T11:00:00Z",
  },
];

export default function ChatForm({ thread }: FormProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(ms);
  const [sendError, setSendError] = useState<string>();

  const [sending, startSending] = useTransition();
  const { profile } = useAppStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  const handleSend = () => {
    startSending(async () => {
      const newMessage: Message = {
        text: message,
        sender_id: profile?.user_id!,
      };
      if (thread.id) {
        newMessage.thread_id = thread.id;
      } else {
        const { data } = await createChatThread({
          buyer_id: thread.buyer_id,
          seller_id: thread.seller_id,
        });
        if (!data?.length) {
          setSendError("Failed to send");
        } else {
          setSendError(undefined);
          newMessage.thread_id = data[0].id;
        }
      }
      if (!newMessage.thread_id) {
        return;
      }
      const { text, sender_id, thread_id } = newMessage;
      const { data } = await sendMessage({ text, sender_id, thread_id });
      if (data) {
        setMessages([...messages, data[0]]);
        scrollToBottom();
        setMessage("");
      }
    });
  };
  return (
    <div className="w-full h-full flex flex-col gap-3">
      <ScrollArea maxHeight="75%" className="w-full flex-1">
        <div className="flex-1 flex flex-col gap-3 p-5">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`w-fit max-w-[90%] rounded-lg px-5 py-2 ${
                message.sender_id === profile?.user_id
                  ? "bg-sky-100 text-sky-700"
                  : "ml-auto bg-emerald-100 text-emerald-500"
              }`}
            >
              {message.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <form action={handleSend} className="px-4">
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
