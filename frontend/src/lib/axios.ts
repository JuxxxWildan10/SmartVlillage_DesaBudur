import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      if (config.headers && typeof config.headers.set === 'function') {
        config.headers.set("Authorization", `Bearer ${token}`);
      } else {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        if (!window.location.pathname.startsWith("/auth/")) {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user_nik");
          localStorage.removeItem("user_name");
          localStorage.removeItem("user_role");
          window.location.href = `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
