import { GoogleGenerativeAI, Part } from "@google/generative-ai";

const MODEL_NAME = "gemini-pro-vision";

export async function generateGeminiResponse(messages: { role: string; content: string; image?: string }[], apiKey: string, image?: File) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const history = messages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: msg.image ? [{ text: msg.content }, { image: msg.image }] : [{ text: msg.content }],
  }));

  const latestMessage = messages[messages.length - 1];
  const parts: Part[] = [{ text: latestMessage.content }];

  if (image) {
    const imageData = await fileToGenerativePart(image);
    parts.push(imageData);
  }

  const result = await model.generateContent({
    contents: [{ role: 'user', parts }],
    generationConfig: {
      maxOutputTokens: 1000,
    },
  });

  const response = result.response;
  return response.text();
}

async function fileToGenerativePart(file: File): Promise<Part> {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });

  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}

