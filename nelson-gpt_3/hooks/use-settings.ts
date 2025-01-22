'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type Settings } from '@/types/settings'

interface Settings {
  theme: 'dark' | 'light';
  fontSize: 'small' | 'medium' | 'large';
  language: string;
  soundNotifications: boolean;
  pushNotifications: boolean;
  autoScroll: boolean;
  enterToSend: boolean;
  defaultModel: string;
  apiKeys: {
    openai: string;
    anthropic: string;
    google: string;
    grok: string;
    mistral: string;
    gemini: string;
  }
}

interface SettingsState extends Settings {
  updateSettings: (settings: Partial<Settings>) => void
  clearConversations: () => Promise<void>
  exportHistory: () => Promise<void>
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      fontSize: 'medium',
      language: 'English',
      soundNotifications: true,
      pushNotifications: false,
      autoScroll: true,
      enterToSend: true,
      defaultModel: 'mistral',
      apiKeys: {
        openai: '',
        anthropic: '',
        google: '',
        grok: '',
        mistral: '',
        gemini: 'AIzaSyDT8oDlzStSg_hyYHfsx3-sfZk6kzPG3z0',
      },
      updateSettings: (newSettings) => set((state) => ({
        ...state,
        ...newSettings,
      })),
      clearConversations: async () => {
        // Implementation for clearing conversations
        await new Promise(resolve => setTimeout(resolve, 500))
      },
      exportHistory: async () => {
        // Implementation for exporting chat history
        const history = { /* chat history data */ }
        const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'chat-history.json'
        a.click()
        URL.revokeObjectURL(url)
      },
    }),
    {
      name: 'nelson-gpt-settings',
    }
  )
)

