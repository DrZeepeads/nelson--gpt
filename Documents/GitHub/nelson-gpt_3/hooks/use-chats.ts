"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { Chat, Message } from "@/types/chat"
import { generateMistralResponse } from "@/lib/mistral-api"
import { generateGeminiResponse } from "@/lib/gemini-api"
import { useSettings } from "@/hooks/use-settings"

interface ChatsState {
  chats: Chat[]
  activeChat: string | null
  createChat: () => void
  deleteChat: (id: string) => void
  addMessage: (chatId: string, message: Omit<Message, "id" | "timestamp">) => void
  setActiveChat: (id: string | null) => void
  clearChats: () => void
  sendMessage: (content: string, image?: File) => Promise<void>
}

export const useChats = create<ChatsState>()(
  persist(
    (set, get) => ({
      chats: [],
      activeChat: null,
      createChat: () => {
        const newChat: Chat = {
          id: Math.random().toString(36).slice(2),
          title: "New Chat",
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        set((state) => ({
          chats: [newChat, ...state.chats],
          activeChat: newChat.id,
        }))
      },
      deleteChat: (id) => {
        set((state) => ({
          chats: state.chats.filter((chat) => chat.id !== id),
          activeChat: state.activeChat === id ? null : state.activeChat,
        }))
      },
      addMessage: (chatId, message) => {
        set((state) => ({
          chats: state.chats.map((chat) => {
            if (chat.id !== chatId) return chat
            return {
              ...chat,
              messages: [
                ...chat.messages,
                {
                  ...message,
                  id: Math.random().toString(36).slice(2),
                  timestamp: Date.now(),
                  image: message.image || undefined,
                },
              ],
              updatedAt: Date.now(),
            }
          }),
        }))
      },
      setActiveChat: (id) => set({ activeChat: id }),
      clearChats: () => set({ chats: [], activeChat: null }),
      sendMessage: async (content: string, image?: File) => {
        const state = get()
        const { defaultModel, apiKeys } = useSettings.getState()
        if (!state.activeChat) return

        // Add user message
        let imageUrl
        if (image) {
          imageUrl = URL.createObjectURL(image)
        }
        state.addMessage(state.activeChat, {
          content,
          role: "user",
          image: imageUrl,
        })

        try {
          const messages = state.chats.find((chat) => chat.id === state.activeChat)?.messages || []

          // Add pediatric context to the messages
          const pediatricContext =
            "You are an AI assistant with expertise in pediatrics, based on Nelson's Book of Pediatrics. Provide accurate and helpful information for pediatric-related queries. If an image is provided, analyze it in the context of pediatric health."
          const contextualizedMessages = [
            { role: "system", content: pediatricContext },
            ...messages.map((msg) => ({
              role: msg.role,
              content: msg.content,
              image: msg.image,
            })),
          ]

          let apiResponse
          if (defaultModel === "gemini") {
            apiResponse = await generateGeminiResponse(contextualizedMessages, apiKeys.gemini, image)
          } else {
            // For Mistral, we'll need to implement image handling separately
            apiResponse = await generateMistralResponse(contextualizedMessages, defaultModel, apiKeys.mistral)
          }

          // Add AI response
          state.addMessage(state.activeChat, {
            content: apiResponse,
            role: "assistant",
          })
        } catch (error) {
          console.error("Error generating AI response:", error)
          state.addMessage(state.activeChat, {
            content: "I apologize, but I encountered an error while processing your request. Please try again later.",
            role: "assistant",
          })
        }
      },
    }),
    {
      name: "nelson-gpt-chats",
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

