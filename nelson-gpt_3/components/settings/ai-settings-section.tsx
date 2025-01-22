'use client'

import { useState } from "react"
import { Eye, EyeOff } from 'lucide-react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSettings } from "@/hooks/use-settings"
import { type AIModel } from "@/types/settings"

export function AISettingsSection() {
  const { defaultModel, apiKeys, updateSettings } = useSettings()
  const [showKeys, setShowKeys] = useState({
    openai: false,
    anthropic: false,
    google: false,
    grok: false,
    mistral: false,
    gemini: false,
  })

  const toggleVisibility = (key: keyof typeof showKeys) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <section className="space-y-4">
      <h3 className="text-xl font-semibold">AI Settings</h3>
      
      <div className="space-y-4">
        {Object.entries(apiKeys).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={`${key}ApiKey`}>{key.charAt(0).toUpperCase() + key.slice(1)} API Key</Label>
            <div className="relative">
              <Input
                id={`${key}ApiKey`}
                type={showKeys[key as keyof typeof showKeys] ? "text" : "password"}
                value={value}
                onChange={(e) => updateSettings({
                  apiKeys: {
                    ...apiKeys,
                    [key]: e.target.value
                  }
                })}
                className="pr-10"
                placeholder={`Enter ${key} API key`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => toggleVisibility(key as keyof typeof showKeys)}
              >
                {showKeys[key as keyof typeof showKeys] ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label>Default AI Model</Label>
        <Select
          value={defaultModel}
          onValueChange={(value: AIModel) => updateSettings({ defaultModel: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select default model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4">GPT-4 (OpenAI)</SelectItem>
            <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (OpenAI)</SelectItem>
            <SelectItem value="claude-2">Claude 2 (Anthropic)</SelectItem>
            <SelectItem value="palm-2">PaLM 2 (Google)</SelectItem>
            <SelectItem value="mistral">Mistral</SelectItem>
            <SelectItem value="gemini">Gemini (Google)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </section>
  )
}

