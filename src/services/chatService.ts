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

export async function sendStrategyMessage(message: string, conversationId?: string | null): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE_URL}/chat/strategy`, {
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

export async function sendStrategyBriefAndMedia(conversationId?: string | null): Promise<ChatResponse> {
  const token = localStorage.getItem("auth_token");
  if (!token) {
    throw new Error("Missing auth token for strategy brief and media call");
  }

  const res = await fetch(`${API_BASE_URL}/chat/strategy/brief_and_media`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      message: "",
      ...(conversationId ? { conversation_id: conversationId } : {}),
    }),
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return (await res.json()) as ChatResponse;
}