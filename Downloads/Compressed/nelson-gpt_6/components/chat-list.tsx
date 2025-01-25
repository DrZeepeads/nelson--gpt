'use client'

import { MessageSquare, Trash2 } from 'lucide-react'
import { useChats } from '@/hooks/use-chats'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatDistanceToNow } from 'date-fns'

export function ChatList() {
  const { chats, activeChat, setActiveChat, deleteChat } = useChats()

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-2 p-2">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`group flex items-center space-x-2 rounded-lg px-3 py-2 hover:bg-gray-800 ${
              chat.id === activeChat ? 'bg-gray-800' : ''
            }`}
          >
            <Button
              variant="ghost"
              className="flex-1 justify-start space-x-2 px-0 hover:bg-transparent"
              onClick={() => setActiveChat(chat.id)}
            >
              <MessageSquare className="h-4 w-4" />
              <span className="truncate">{chat.title}</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100"
              onClick={() => deleteChat(chat.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

