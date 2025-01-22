export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: number
  image?: string
}

export interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}

