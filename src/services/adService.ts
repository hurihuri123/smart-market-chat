import { API_BASE_URL } from "@/constants/api";

export interface AdUploadResponse {
  ad_id: number;
  media_urls: string[];
}

export async function uploadAdMedia(files: File[]): Promise<AdUploadResponse> {
  if (!files.length) {
    throw new Error("No files provided for upload");
  }

  const formData = new FormData();

  for (const file of files) {
    formData.append("media", file);
  }

  const token = localStorage.getItem("auth_token");

  const res = await fetch(`${API_BASE_URL}/ads`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Ad media upload failed: ${res.status}`);
  }

  return (await res.json()) as AdUploadResponse;
}

