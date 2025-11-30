import { API_BASE_URL } from "@/constants/api";

export interface StoredMessage {
  id: number;
  user_id: number;
  content: string;
  created_at: string;
}

export interface MessagesResponse {
  messages: StoredMessage[];
}

export async function fetchUserMessages(): Promise<StoredMessage[]> {
  const token = localStorage.getItem("auth_token");
  if (!token) {
    return [];
  }

  const res = await fetch(`${API_BASE_URL}/messages`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch messages: ${res.status}`);
  }

  const data = (await res.json()) as MessagesResponse;
  return data.messages ?? [];
}


