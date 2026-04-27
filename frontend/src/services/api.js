import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cc_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("cc_token");
      localStorage.removeItem("cc_user");
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (payload) => api.post("/auth/register", payload),
  login: (payload) => api.post("/auth/login", payload),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (payload) => api.put("/auth/profile", payload),
  submitVerification: (payload) => api.post("/auth/profile/verify", payload),
  requestOtp: (payload) => api.post("/auth/recovery/request", payload),
  verifyOtp: (payload) => api.post("/auth/recovery/verify", payload),
};

export const assistantApi = {
  getFaqs: (params) => api.get("/faqs", { params }),
  searchFaqs: (q, category) => api.get("/faqs/search", { params: { q, category } }),
  queryFaqs: (payload) => api.post("/faqs/query", payload),
};

export const eventApi = {
  list: (params = {}) => api.get("/events", { params }),
  myEvents: () => api.get("/events/my"),
  create: (payload) => api.post("/events", payload),
  register: (id) => api.post(`/events/${id}/register`),
};

export const chatApi = {
  rooms: (params = {}) => api.get("/chats", { params }),
  messages: (chatId) => api.get(`/chats/${chatId}/messages`),
  sendMessage: (chatId, payload) => api.post(`/chats/${chatId}/messages`, payload),
};

export const reportApi = {
  submit: (payload) => api.post("/reports", payload),
  myReports: () => api.get("/reports/my"),
  allReports: () => api.get("/reports"),
  resolve: (id, payload = {}) => api.put(`/reports/${id}`, payload),
};

export const adminApi = {
  allReports: () => api.get("/reports"),
  moderationLogs: () => api.get("/admin/logs"),
  knowledgeBase: (params = {}) => api.get("/admin/knowledge", { params }),
  createKnowledge: (payload) => api.post("/admin/knowledge", payload),
  updateKnowledge: (id, payload) => api.patch(`/admin/knowledge/${id}`, payload),
  deleteKnowledge: (id) => api.delete(`/admin/knowledge/${id}`),
  resolveReport: (id, payload = {}) => api.put(`/reports/${id}`, payload),
  suspendUser: (id) => api.delete(`/users/${id}`),
  seedFaqs: () => api.post("/admin/seed/faqs"),
};
