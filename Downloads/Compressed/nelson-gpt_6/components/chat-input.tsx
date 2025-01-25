"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Send, WifiOff, Loader2, Mic, MicOff } from "lucide-react"
import { useChats } from "@/hooks/use-chats"
import { useSettings } from "@/hooks/use-settings"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { debounce } from "lodash"

export function ChatInput() {
  const [input, setInput] = useState("")
  const [isOnline, setIsOnline] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { activeChat, addMessage, sendMessage } = useChats()
  const { enterToSend, soundNotifications } = useSettings()
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [setIsOnline]) // Added setIsOnline to the dependency array

  const debouncedSendMessage = useCallback(
    debounce(async (content: string) => {
      if (!content.trim() || !activeChat || isLoading) return

      setIsLoading(true)

      try {
        await sendMessage(content.trim())

        if (soundNotifications && audioRef.current) {
          audioRef.current.play()
        }

        setInput("")
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
    }, 300),
    [activeChat, isLoading, sendMessage, soundNotifications, isOnline, addMessage, setIsOnline], //Added setIsOnline to the dependency array
  )

  const handleSubmit = async () => {
    if (!input.trim() || !activeChat || isLoading) return

    setIsLoading(true)
    setError(null)

    try {
      await sendMessage(input.trim())

      if (soundNotifications && audioRef.current) {
        audioRef.current.play()
      }

      setInput("")
    } catch (error) {
      console.error("Error sending message:", error)
      setError("Failed to send message. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (enterToSend && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      toast({
        title: "Voice Input Not Supported",
        description: "Your browser doesn't support voice input.",
        variant: "destructive",
      })
      return
    }

    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.continuous = false
    recognition.lang = "en-US"

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput((prevInput) => prevInput + " " + transcript)
    }

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    if (isListening) {
      recognition.stop()
    } else {
      recognition.start()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border-t border-gray-800 p-4"
    >
      <div className="flex space-x-2">
        <Button size="icon" variant="ghost" onClick={handleVoiceInput} className="mr-2" disabled={isLoading}>
          {isListening ? <MicOff className="h-5 w-5 text-red-500" /> : <Mic className="h-5 w-5" />}
        </Button>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isOnline ? "Send a message..." : "You're offline. Messages will be saved."}
          className="flex-1 min-h-[60px] max-h-[200px] bg-gray-800 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          disabled={isLoading}
        />
        <Button size="icon" variant="ghost" onClick={handleSubmit} disabled={!input.trim() || !activeChat || isLoading}>
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isOnline ? (
            <Send className="h-5 w-5" />
          ) : (
            <WifiOff className="h-5 w-5" />
          )}
        </Button>
      </div>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-2 text-red-500 text-sm"
        >
          {error}
        </motion.div>
      )}
      <audio ref={audioRef} src="/message-sent.mp3" />
    </motion.div>
  )
}

