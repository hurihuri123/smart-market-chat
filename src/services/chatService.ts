import { API_BASE_URL } from "@/constants/api";

export interface ChatResponse {
  message: string;
  conversation_id: string;
  is_complete: boolean;
  strategy_schema?: unknown | null;
}

export async function sendChatMessage(message: string, conversationId?: string | null): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      ...(conversationId ? { conversation_id: conversationId } : {}),
    }),
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return (await res.json()) as ChatResponse;
}
