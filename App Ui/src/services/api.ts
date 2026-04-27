const BASE = "/api";

function authHeaders(token?: string | null): HeadersInit {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function getToken(): string | null {
  return localStorage.getItem("cc_token");
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: authHeaders(getToken()),
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data as T;
}

// Events
export const eventApi = {
  list: () => request<{ events: unknown[] }>("/events"),
  myEvents: () => request<{ events: unknown[] }>("/events/my"),
  create: (body: unknown) =>
    request("/events", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  register: (id: string) =>
    request(`/events/${id}/register`, { method: "POST" }),
};

// Chats
export const chatApi = {
  rooms: () => request<{ rooms: unknown[] }>("/chats"),
  messages: (id: string) => request<{ messages: unknown[] }>(`/chats/${id}/messages`),
  sendMessage: (id: string, text: string, extra?: { type?: string; fileData?: string; fileName?: string }) =>
    request(`/chats/${id}/messages`, {
      method: "POST",
      body: JSON.stringify({ text, ...(extra ?? {}) }),
    }),
};

// Admin
export const adminApi = {
  reports: () => request<{ reports: unknown[] }>("/admin/reports"),
  users: () => request<{ users: unknown[] }>("/admin/users"),
  stats: () => request("/admin/stats"),
};

// Reports
export const reportApi = {
  submit: (body: unknown) =>
    request("/reports", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  list: () => request<{ reports: unknown[] }>("/reports"),
};
