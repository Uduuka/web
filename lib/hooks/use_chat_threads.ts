import { useEffect, useState } from "react";
import { ChatHead, Message } from "../types";
import { createClient } from "../supabase/client";

export const useChatThread = (thread: ChatHead) => {
    const supabase = createClient()
    const [messages, setMessages] = useState<Message[]>(thread.messages ?? [])
    useEffect(()=>{
        if(!thread.id) return;
        const channels = supabase.channel(thread.id)
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'chat_messages' },
            (payload) => {
                const { ad_id, text, sender_id, status } = payload.new
                const msg = { ad_id, text, sender_id, status }
                setMessages([...messages, msg])
            }
        )
        .subscribe()

        return ()=>{
            channels.unsubscribe()
        }
    }, [thread, messages])

    return {messages, setMessages}
}