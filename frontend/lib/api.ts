// lib/api.ts

// Use environment variable for API URL in production, fallback to localhost
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://127.0.0.1:8000";

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  if (!res.ok) {
    const text = await res.text();
    // Return better error message if text is HTML (common in bad server errors)
    if (text.startsWith("<!DOCTYPE")) {
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }
    throw new Error(text || res.statusText || "API Request Failed");
  }

  return res.json();
}
