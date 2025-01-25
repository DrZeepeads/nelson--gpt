import type { AIModel } from "@/types/settings"

const MISTRAL_API_ENDPOINT = "https://api.mistral.ai/v1/chat/completions"

export async function generateMistralResponse(
  messages: { role: string; content: string }[],
  model: AIModel,
  apiKey: string,
) {
  try {
    const response = await fetch(MISTRAL_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model === "mistral" ? "mistral-tiny" : model,
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Mistral API error: ${response.statusText} - ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error("Error in generateMistralResponse:", error)
    throw error
  }
}

