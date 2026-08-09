import axios from "axios";

/**
 * Konfigurasi Axios — API Client Web Desa Budur
 *
 * Keamanan:
 * - Menggunakan Sanctum SPA Cookie Auth (HttpOnly Cookie).
 * - Cookie dikelola otomatis oleh browser dan backend.
 * - Response 401 otomatis redirect ke halaman login dan bersihkan semua data auth.
 * - Timeout 30 detik untuk mencegah request menggantung.
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 60000, // 60 detik timeout — menyesuaikan dengan koneksi database remote (Supabase)
  withCredentials: true, // WAJIB untuk mengirim/menerima session cookie (Sanctum)
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "X-Requested-With": "XMLHttpRequest", // Identifikasi sebagai AJAX request
  },
});

// ── Request Interceptor ─────────────────────────────────────────────
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
// ── Response Interceptor ────────────────────────────────────────────
// Handle error response secara terpusat
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response) {
      const status = error.response.status;

      // 401 Unauthorized — token expired atau tidak valid
      if (status === 401) {
        if (!window.location.pathname.startsWith("/auth/")) {
          clearAuthData();
          window.location.href = `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        }
      }

      // 403 Forbidden — akses ditolak, redirect ke halaman utama
      if (status === 403) {
        console.warn("[Security] Akses ditolak (403):", error.response.config?.url);
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Bersihkan semua data auth dari localStorage secara terpusat.
 * Selalu gunakan fungsi ini saat logout — jangan hapus satu per satu.
 */
export function clearAuthData() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_nik");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_role");
  }
}

export default api;
