export type Theme = 'light' | 'dark'
export type FontSize = 'small' | 'medium' | 'large'
export type Language = 'English' | 'Spanish' | 'French' | 'German'
export type AIModel = 'gpt-4' | 'gpt-3.5-turbo' | 'claude-2' | 'palm-2' | 'mistral'

export interface Settings {
  theme: Theme
  fontSize: FontSize
  language: Language
  soundNotifications: boolean
  autoScroll: boolean
  enterToSend: boolean
  defaultModel: AIModel
  apiKeys: {
    grok: string
    anthropic: string
    gemini: string
    mistral: string
  }
}

