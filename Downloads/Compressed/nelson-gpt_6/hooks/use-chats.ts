"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Chat, Message } from "@/types/chat"
import { generateMistralResponse } from "@/lib/mistral-api"
import { useSettings } from "@/hooks/use-settings"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import { produce } from "immer"

interface ChatsState {
  chats: Chat[]
  activeChat: string | null
  createChat: () => Promise<void>
  deleteChat: (id: string) => Promise<void>
  addMessage: (chatId: string, message: Omit<Message, "id" | "created_at">) => Promise<void>
  setActiveChat: (id: string | null) => void
  clearChats: () => Promise<void>
  sendMessage: (content: string) => Promise<void>
  fetchChats: () => Promise<void>
}

export const useChats = create<ChatsState>()(
  persist(
    (set, get) => ({
      chats: [],
      activeChat: null,
      createChat: async () => {
        try {
          const { data: newChat, error } = await supabase.from("chats").insert({ title: "New Chat" }).select().single()

          if (error) throw error

          set((state) => ({
            chats: [{ ...newChat, messages: [] }, ...state.chats],
            activeChat: newChat.id,
          }))
        } catch (error) {
          console.error("Error creating chat:", error)
          toast({
            title: "Error",
            description: "Failed to create a new chat. Please try again.",
            variant: "destructive",
          })
        }
      },
      deleteChat: async (id) => {
        try {
          const { error } = await supabase.from("chats").delete().eq("id", id)

          if (error) throw error

          set((state) => ({
            chats: state.chats.filter((chat) => chat.id !== id),
            activeChat: state.activeChat === id ? null : state.activeChat,
          }))
        } catch (error) {
          console.error("Error deleting chat:", error)
          toast({
            title: "Error",
            description: "Failed to delete the chat. Please try again.",
            variant: "destructive",
          })
        }
      },
      addMessage: async (chatId, message) => {
        try {
          const { data: newMessage, error } = await supabase
            .from("messages")
            .insert({ ...message, chat_id: chatId })
            .select()
            .single()

          if (error) throw error

          set(
            produce((state: ChatsState) => {
              const chat = state.chats.find((c) => c.id === chatId)
              if (chat) {
                chat.messages.push(newMessage)
                chat.updated_at = new Date().toISOString()
              }
            }),
          )

          await supabase.from("chats").update({ updated_at: new Date().toISOString() }).eq("id", chatId)
        } catch (error) {
          console.error("Error adding message:", error)
          toast({
            title: "Error",
            description: "Failed to add the message. Please try again.",
            variant: "destructive",
          })
        }
      },
      setActiveChat: (id) => set({ activeChat: id }),
      clearChats: async () => {
        try {
          const { error } = await supabase.from("chats").delete().not("id", "is", null)

          if (error) throw error

          set({ chats: [], activeChat: null })
        } catch (error) {
          console.error("Error clearing chats:", error)
          toast({
            title: "Error",
            description: "Failed to clear chats. Please try again.",
            variant: "destructive",
          })
        }
      },
      sendMessage: async (content: string) => {
        const state = get()
        const { defaultModel, apiKeys } = useSettings.getState()
        if (!state.activeChat) return

        await state.addMessage(state.activeChat, {
          content,
          role: "user",
        })

        try {
          const { data: messages, error } = await supabase
            .from("messages")
            .select("content, role")
            .eq("chat_id", state.activeChat)
            .order("created_at", { ascending: true })

          if (error) throw error

          const pediatricContext =
            "You are an AI assistant with expertise in pediatrics, based on Nelson's Book of Pediatrics. Provide accurate and helpful information for pediatric-related queries."
          const contextualizedMessages = [{ role: "system", content: pediatricContext }, ...(messages || [])]

          const apiResponse = await generateMistralResponse(contextualizedMessages, defaultModel, apiKeys.mistral)

          await state.addMessage(state.activeChat, {
            content: apiResponse,
            role: "assistant",
          })
        } catch (error) {
          console.error("Error generating AI response:", error)
          await state.addMessage(state.activeChat, {
            content: "I apologize, but I encountered an error while processing your request. Please try again later.",
            role: "assistant",
          })
          toast({
            title: "Error",
            description: "Failed to generate AI response. Please try again.",
            variant: "destructive",
          })
        }
      },
      fetchChats: async () => {
        try {
          const { data: chats, error: chatsError } = await supabase
            .from("chats")
            .select("*")
            .order("updated_at", { ascending: false })

          if (chatsError) throw chatsError

          const chatsWithMessages = await Promise.all(
            chats.map(async (chat) => {
              const { data: messages, error: messagesError } = await supabase
                .from("messages")
                .select("*")
                .eq("chat_id", chat.id)
                .order("created_at", { ascending: true })

              if (messagesError) throw messagesError

              return { ...chat, messages: messages || [] }
            }),
          )

          set({ chats: chatsWithMessages })
        } catch (error) {
          console.error("Error fetching chats:", error)
          toast({
            title: "Error",
            description: "Failed to fetch chats. Please refresh the page or try again later.",
            variant: "destructive",
          })
        }
      },
    }),
    {
      name: "nelson-gpt-chats",
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
    },
  ),
)

