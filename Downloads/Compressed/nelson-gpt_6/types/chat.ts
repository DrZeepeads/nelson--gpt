export interface Message {
  id: string
  chat_id: string
  content: string
  role: "user" | "assistant" | "system"
  created_at: string
}

export interface Chat {
  id: string
  title: string
  messages: Message[]
  created_at: string
  updated_at: string
}

