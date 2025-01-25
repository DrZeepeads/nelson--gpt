"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useChats } from "@/hooks/use-chats"
import { useSettings } from "@/hooks/use-settings"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { WelcomeScreen } from "@/components/welcome-screen"
import { format } from "date-fns"
import { Info, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Virtuoso } from "react-virtuoso"

export function Chat() {
  const { activeChat, chats } = useChats()
  const { fontSize, autoScroll } = useSettings()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isTyping, setIsTyping] = useState(false)

  const activeMessages = chats.find((chat) => chat.id === activeChat)?.messages ?? []

  const MessageComponent = React.memo(({ message, index }: { message: any; index: number }) => (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={cn("flex items-start space-x-4", message.role === "user" ? "justify-end" : "justify-start")}
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
          message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900",
          fontSizeClass,
        )}
      >
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "")
              return !inline && match ? (
                <SyntaxHighlighter style={atomDark} language={match[1]} PreTag="div" {...props}>
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            },
            p: ({ children }) => <p className="mb-2">{children}</p>,
            ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
            li: ({ children }) => <li className="mb-1">{children}</li>,
            h1: ({ children }) => <h1 className="text-2xl font-bold mb-2">{children}</h1>,
            h2: ({ children }) => <h2 className="text-xl font-bold mb-2">{children}</h2>,
            h3: ({ children }) => <h3 className="text-lg font-bold mb-2">{children}</h3>,
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-2">{children}</blockquote>
            ),
          }}
        >
          {message.content}
        </ReactMarkdown>
        <span className="text-xs opacity-50 mt-2 block">{format(new Date(message.timestamp), "HH:mm")}</span>
      </div>
      {message.role === "user" && (
        <Avatar className="mt-1">
          <AvatarImage src="/user-avatar.png" alt="User" />
          <AvatarFallback>Me</AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  ))

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
    setIsTyping(false)
  }, [autoScroll])

  const fontSizeClass = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  }[fontSize]

  if (!activeChat) {
    return <WelcomeScreen />
  }

  const renderItem = useCallback(
    (index: number, message: any) => <MessageComponent message={message} index={index} />,
    [],
  )

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="max-w-3xl mx-auto space-y-6">
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
        <Virtuoso
          style={{ height: "calc(100vh - 200px)" }}
          data={activeMessages}
          itemContent={renderItem}
          followOutput={"smooth"}
          alignToBottom
        />
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex items-start space-x-4 justify-start"
          >
            <Avatar className="mt-1">
              <AvatarImage src="/ai-avatar.png" alt="AI" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div className="rounded-lg p-4 bg-gray-100 text-gray-900">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          </motion.div>
        )}
      </div>
    </ScrollArea>
  )
}

