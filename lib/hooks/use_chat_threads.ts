import { useEffect, useState } from "react";
import { ChatThread, Message } from "../types";
import { createClient } from "../supabase/client";
import { useAppStore } from "../store";

export const useChatThread = () => {
    const {activechatThread} = useAppStore()
    const [messages, setMessages] = useState<Message[]>(activechatThread?.messages ?? [])
    if (!activechatThread) {
        return {messages, setMessages}
    }
    const supabase = createClient()
    useEffect(()=>{
        const channels = supabase.channel('chat')
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `receiver_id=eq.${activechatThread.me.user_id}` },
            (payload) => {
                const { sender_id, receiver_id, text, id } = payload.new
                const msg = { sender_id, receiver_id, text, id }
                setMessages([...messages, msg])
            }
        )
        .subscribe()

        return ()=>{
            channels.unsubscribe()
        }
    }, [activechatThread, messages])

    return {messages, setMessages}
}