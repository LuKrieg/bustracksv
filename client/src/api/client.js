import axios from "axios";

// Configuración base del cliente Axios
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Crear instancia de Axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para requests - agregar token automáticamente
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("bustracksv:token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses - manejar errores globalmente
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si el token es inválido o expiró, limpiar localStorage
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("bustracksv:token");
      localStorage.removeItem("bustracksv:user");
      // Redirigir al login si no estamos ya ahí
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
