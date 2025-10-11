import apiClient from "../api/client.js";

class AuthService {
  // Registrar nuevo usuario
  async register(userData) {
    try {
      const response = await apiClient.post("/register", {
        usuario: userData.usuario,
        password: userData.password,
      });

      return {
        success: true,
        message: response.data.message,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al registrar usuario",
        error: error.response?.data,
      };
    }
  }

  // Iniciar sesión
  async login(credentials) {
    try {
      const response = await apiClient.post("/login", {
        usuario: credentials.usuario,
        password: credentials.password,
      });

      const { token, usuario } = response.data;

      // Guardar token y datos del usuario en localStorage
      localStorage.setItem("bustracksv:token", token);
      localStorage.setItem(
        "bustracksv:user",
        JSON.stringify({
          usuario,
          token,
        })
      );

      return {
        success: true,
        message: response.data.message,
        user: {
          usuario,
          token,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al iniciar sesión",
        error: error.response?.data,
      };
    }
  }

  // Validar token y obtener información del usuario
  async validateToken() {
    try {
      const token = localStorage.getItem("bustracksv:token");
      if (!token) {
        return {
          success: false,
          message: "No hay token guardado",
        };
      }

      const response = await apiClient.get("/validate");

      const { usuario, id } = response.data;

      // Actualizar datos del usuario en localStorage
      localStorage.setItem(
        "bustracksv:user",
        JSON.stringify({
          id,
          usuario,
          token,
        })
      );

      return {
        success: true,
        user: {
          id,
          usuario,
          token,
        },
      };
    } catch (error) {
      // Si el token es inválido, limpiar localStorage
      this.logout();
      return {
        success: false,
        message: error.response?.data?.message || "Token inválido",
        error: error.response?.data,
      };
    }
  }

  // Obtener usuario guardado en localStorage
  getStoredUser() {
    try {
      const userData = localStorage.getItem("bustracksv:user");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error al obtener usuario guardado:", error);
      return null;
    }
  }

  // Cerrar sesión
  logout() {
    localStorage.removeItem("bustracksv:token");
    localStorage.removeItem("bustracksv:user");
  }

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    const token = localStorage.getItem("bustracksv:token");
    const user = this.getStoredUser();
    return !!(token && user);
  }

  // Obtener token actual
  getToken() {
    return localStorage.getItem("bustracksv:token");
  }
}

// Exportar instancia singleton
export default new AuthService();
