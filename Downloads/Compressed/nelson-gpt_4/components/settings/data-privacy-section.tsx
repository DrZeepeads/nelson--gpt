'use client'

import { Button } from "@/components/ui/button"
import { useSettings } from "@/hooks/use-settings"

export function DataPrivacySection() {
  const { clearConversations, exportHistory } = useSettings()

  return (
    <section className="space-y-4">
      <h3 className="text-xl font-semibold">Data & Privacy</h3>
      
      <div className="space-y-4">
        <Button 
          variant="destructive" 
          className="w-full"
          onClick={() => clearConversations()}
        >
          Clear All Conversations
        </Button>
        
        <Button 
          variant="secondary" 
          className="w-full"
          onClick={() => exportHistory()}
        >
          Export Chat History
        </Button>
      </div>
    </section>
  )
}

