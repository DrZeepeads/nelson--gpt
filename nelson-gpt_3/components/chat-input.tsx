"use client"

import { useState, useRef, useEffect } from "react"
import { Send, WifiOff, Loader2, Camera } from "lucide-react"
import { useChats } from "@/hooks/use-chats"
import { useSettings } from "@/hooks/use-settings"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

// Removed SUGGESTED_QUESTIONS constant

export function ChatInput() {
  const [input, setInput] = useState("")
  const [isOnline, setIsOnline] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  // Removed showSuggestions state

  const { activeChat, addMessage, sendMessage } = useChats()
  const { enterToSend, soundNotifications } = useSettings()
  const audioRef = useRef<HTMLAudioElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const handleSubmit = async () => {
    if ((!input.trim() && !selectedImage) || !activeChat || isLoading) return

    setIsLoading(true)

    try {
      await sendMessage(input.trim(), selectedImage || undefined)

      if (soundNotifications && audioRef.current) {
        audioRef.current.play()
      }

      setInput("")
      setSelectedImage(null)
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }

    if (!isOnline) {
      addMessage(activeChat, {
        content:
          "I'm sorry, but I'm currently offline. Your message has been saved and will be processed when you're back online.",
        role: "assistant",
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (enterToSend && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type.startsWith("image/")) {
        setSelectedImage(file)
      } else {
        toast({
          title: "Error",
          description: "Please select a valid image file.",
          variant: "destructive",
        })
      }
    }
  }

  // Removed handleSuggestionClick function

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border-t border-gray-800 p-4"
    >
      <div className="flex space-x-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isOnline ? "Send a message..." : "You're offline. Messages will be saved."}
          className="flex-1 min-h-[60px] max-h-[200px] bg-gray-800 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          disabled={isLoading}
        />
        <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} className="hidden" />
        <Button size="icon" variant="ghost" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
          <Camera className="h-5 w-5" />
        </Button>
        {/* Removed suggestion button */}
        <Button
          size="icon"
          variant="ghost"
          onClick={handleSubmit}
          disabled={(!input.trim() && !selectedImage) || !activeChat || isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isOnline ? (
            <Send className="h-5 w-5" />
          ) : (
            <WifiOff className="h-5 w-5" />
          )}
        </Button>
      </div>
      {/* Removed AnimatePresence block for suggestions */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="mt-2"
        >
          <Image
            src={URL.createObjectURL(selectedImage) || "/placeholder.svg"}
            alt="Selected image"
            width={200}
            height={200}
            className="max-w-xs h-auto rounded-md"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.onerror = null // Prevent infinite loop
              target.src = "/placeholder.svg"
            }}
          />
          <Button size="sm" variant="ghost" onClick={() => setSelectedImage(null)} className="mt-1">
            Remove
          </Button>
        </motion.div>
      )}
      <audio ref={audioRef} src="/message-sent.mp3" />
    </motion.div>
  )
}

