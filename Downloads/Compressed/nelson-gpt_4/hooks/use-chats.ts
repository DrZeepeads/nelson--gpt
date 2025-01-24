"use client"

import { create } from "zustand"
import type { Chat, Message } from "@/types/chat"
import { generateMistralResponse } from "@/lib/mistral-api"
import { useSettings } from "@/hooks/use-settings"
import { supabase } from "@/lib/supabase"

interface ChatsState {
  chats: Chat[]
  activeChat: string | null
  createChat: () => Promise<void>
  deleteChat: (id: string) => Promise<void>
  addMessage: (chatId: string, message: Omit<Message, "id" | "timestamp">) => Promise<void>
  setActiveChat: (id: string | null) => void
  clearChats: () => Promise<void>
  sendMessage: (content: string) => Promise<void>
  fetchChats: () => Promise<void>
}

export const useChats = create<ChatsState>((set, get) => ({
  chats: [],
  activeChat: null,
  createChat: async () => {
    const { data: newChat, error } = await supabase.from("chats").insert({ title: "New Chat" }).select().single()

    if (error) {
      console.error("Error creating chat:", error)
      return
    }

    set((state) => ({
      chats: [newChat, ...state.chats],
      activeChat: newChat.id,
    }))
  },
  deleteChat: async (id) => {
    const { error } = await supabase.from("chats").delete().eq("id", id)

    if (error) {
      console.error("Error deleting chat:", error)
      return
    }

    set((state) => ({
      chats: state.chats.filter((chat) => chat.id !== id),
      activeChat: state.activeChat === id ? null : state.activeChat,
    }))
  },
  addMessage: async (chatId, message) => {
    const { data: newMessage, error } = await supabase
      .from("messages")
      .insert({ ...message, chat_id: chatId })
      .select()
      .single()

    if (error) {
      console.error("Error adding message:", error)
      return
    }

    set((state) => ({
      chats: state.chats.map((chat) => {
        if (chat.id !== chatId) return chat
        return {
          ...chat,
          messages: [...(chat.messages || []), newMessage],
          updated_at: new Date().toISOString(),
        }
      }),
    }))

    // Update the chat's updated_at timestamp
    await supabase.from("chats").update({ updated_at: new Date().toISOString() }).eq("id", chatId)
  },
  setActiveChat: (id) => set({ activeChat: id }),
  clearChats: async () => {
    const { error } = await supabase.from("chats").delete().not("id", "is", null)

    if (error) {
      console.error("Error clearing chats:", error)
      return
    }

    set({ chats: [], activeChat: null })
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
      const { data: messages } = await supabase
        .from("messages")
        .select("content, role")
        .eq("chat_id", state.activeChat)
        .order("created_at", { ascending: true })

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
    }
  },
  fetchChats: async () => {
    const { data: chats, error } = await supabase
      .from("chats")
      .select(`
        *,
        messages (*)
      `)
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("Error fetching chats:", error)
      return
    }

    set({ chats: chats || [] })
  },
}))

