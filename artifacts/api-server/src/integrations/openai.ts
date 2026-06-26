import { AI_CONFIG } from "../config/ai";
import { logger } from "../lib/logger";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatResponse {
  content: string;
  tokens: { prompt: number; completion: number; total: number };
}

export async function chatCompletion(
  messages: ChatMessage[],
  opts?: { maxTokens?: number; temperature?: number; model?: string }
): Promise<ChatResponse> {
  const { openai } = AI_CONFIG;
  if (!openai.apiKey) {
    logger.warn("OpenAI API key not configured");
    return { content: "AI service not configured.", tokens: { prompt: 0, completion: 0, total: 0 } };
  }

  const res = await fetch(`${openai.baseUrl}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${openai.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: opts?.model ?? openai.model,
      messages,
      max_tokens: opts?.maxTokens ?? openai.maxTokens,
      temperature: opts?.temperature ?? openai.temperature,
    }),
  });

  const data = await res.json() as {
    choices: { message: { content: string } }[];
    usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
    error?: { message: string };
  };

  if (data.error) throw new Error(data.error.message);

  return {
    content: data.choices[0]?.message.content ?? "",
    tokens: {
      prompt: data.usage?.prompt_tokens ?? 0,
      completion: data.usage?.completion_tokens ?? 0,
      total: data.usage?.total_tokens ?? 0,
    },
  };
}

export async function moderateContent(text: string): Promise<{ flagged: boolean; categories: Record<string, boolean> }> {
  const { openai } = AI_CONFIG;
  if (!openai.apiKey) return { flagged: false, categories: {} };

  const res = await fetch(`${openai.baseUrl}/moderations`, {
    method: "POST",
    headers: { Authorization: `Bearer ${openai.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ input: text }),
  });

  const data = await res.json() as { results: { flagged: boolean; categories: Record<string, boolean> }[] };
  return data.results[0] ?? { flagged: false, categories: {} };
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const { openai } = AI_CONFIG;
  if (!openai.apiKey) return [];

  const res = await fetch(`${openai.baseUrl}/embeddings`, {
    method: "POST",
    headers: { Authorization: `Bearer ${openai.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "text-embedding-3-small", input: text }),
  });

  const data = await res.json() as { data: { embedding: number[] }[] };
  return data.data[0]?.embedding ?? [];
}
