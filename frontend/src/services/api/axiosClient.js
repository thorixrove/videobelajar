import axios from "axios";


const baseURL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/+$/, "");

if (!baseURL) {
  console.error(
    "VITE_API_BASE_URL belum diatur. Buat file .env di root project lalu isi URL Firebase Realtime Database.",
  );
}

const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Ubah error Axios menjadi pesan yang mudah dipahami pengguna.
function toFriendlyMessage(error) {
  if (!baseURL) return "URL API belum diatur. Periksa file .env.";
  if (error.code === "ECONNABORTED") return "Permintaan terlalu lama. Coba lagi.";
  if (!error.response) return "Tidak dapat terhubung ke server. Periksa koneksi internet.";

  switch (error.response.status) {
    case 401:
    case 403:
      return "Akses ditolak. Periksa Rules pada Firebase Realtime Database.";
    case 404:
      return "Data tidak ditemukan.";
    default:
      return `Terjadi kesalahan pada server (${error.response.status}).`;
  }
}

// Request interceptor: tempat terpusat untuk header, logging, dan otorisasi.
apiClient.interceptors.request.use(
  (config) => {
    // Contoh otorisasi terpusat (Firebase memakai query ?auth=<token>):
    // const token = localStorage.getItem("token");
    // if (token) config.params = { ...config.params, auth: token };

    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: logging dan penanganan error terpusat.
apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`[API] ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error("[API] error:", error.response?.status ?? error.code, error.config?.url);
    }
    return Promise.reject(new Error(toFriendlyMessage(error)));
  },
);

export default apiClient;