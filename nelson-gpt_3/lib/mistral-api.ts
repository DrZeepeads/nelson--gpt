import { AIModel } from '@/types/settings'

const MISTRAL_API_ENDPOINT = 'https://api.mistral.ai/v1/chat/completions'

export async function generateMistralResponse(messages: { role: string; content: string }[], model: AIModel, apiKey: string) {
  const response = await fetch(MISTRAL_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model === 'mistral' ? 'mistral-tiny' : model, // You may need to adjust this based on Mistral's available models
      messages: messages,
    }),
  })

  if (!response.ok) {
    throw new Error(`Mistral API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

