import { Button } from "@/components/ui/button"
import { useChats } from "@/hooks/use-chats"

export function WelcomeScreen() {
  const { createChat } = useChats()

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to Nelson-GPT</h1>
      <p className="text-xl mb-4">Your AI-powered pediatric assistant</p>
      <Button onClick={createChat} size="lg">
        Start a New Chat
      </Button>
    </div>
  )
}

