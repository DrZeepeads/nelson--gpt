"use client"

import { useEffect, useRef } from "react"
import { useChats } from "@/hooks/use-chats"
import { useSettings } from "@/hooks/use-settings"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { WelcomeScreen } from "@/components/welcome-screen"
import { format } from "date-fns"
import { Info } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

export function Chat() {
  const { activeChat, chats } = useChats()
  const { fontSize, autoScroll } = useSettings()
  const scrollRef = useRef<HTMLDivElement>(null)

  const activeMessages = chats.find((chat) => chat.id === activeChat)?.messages ?? []

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [activeMessages.length, autoScroll])

  const fontSizeClass = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  }[fontSize]

  if (!activeChat) {
    return <WelcomeScreen />
  }

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded shadow-md"
          role="alert"
        >
          <div className="flex items-center">
            <Info className="h-5 w-5 mr-2" />
            <p className="font-bold">Pediatric Assistant</p>
          </div>
          <p className="mt-2">
            This AI is trained on Nelson's Book of Pediatrics and can provide information on pediatric topics. Always
            consult with a healthcare professional for medical advice.
          </p>
        </motion.div>
        <AnimatePresence initial={false}>
          {activeMessages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={cn("flex items-start space-x-2", message.role === "user" ? "justify-end" : "justify-start")}
            >
              {message.role === "assistant" && (
                <Avatar className="mt-1">
                  <AvatarImage src="/ai-avatar.png" alt="AI" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "rounded-lg p-4 max-w-[80%] shadow-md",
                  message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900",
                  fontSizeClass,
                )}
              >
                {message.image && (
                  <div className="mb-2">
                    <Image
                      src={message.image || "/placeholder.svg"}
                      alt="Uploaded image"
                      width={200}
                      height={200}
                      className="rounded-md max-w-full h-auto"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.onerror = null // Prevent infinite loop
                        target.src = "/placeholder.svg"
                      }}
                    />
                  </div>
                )}
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
                <span className="text-xs opacity-50 mt-2 block">{format(new Date(message.timestamp), "HH:mm")}</span>
              </div>
              {message.role === "user" && (
                <Avatar className="mt-1">
                  <AvatarImage src="/user-avatar.png" alt="User" />
                  <AvatarFallback>Me</AvatarFallback>
                </Avatar>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  )
}

