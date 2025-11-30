import apiClient from "../api/client.js";

class HistorialService {
  // Obtener historial de búsquedas del usuario
  async obtenerHistorial(limite = 20) {
    try {
      const response = await apiClient.get("/historial", {
        params: {
          limite: limite
        }
      });
      
      // El servidor devuelve { historial: [...], total: ... }
      // Normalizamos para que sea consistente con otros servicios
      return {
        success: true,
        data: {
          historial: response.data.historial || [],
          total: response.data.total || 0
        }
      };
    } catch (error) {
      console.error("Error al obtener historial:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error al obtener historial",
        data: {
          historial: [],
          total: 0
        }
      };
    }
  }

  // Guardar una búsqueda en el historial
  async guardarBusqueda(datosBusqueda) {
    try {
      const { ruta, numero_ruta, parada } = datosBusqueda;
      
      const response = await apiClient.post("/historial", {
        ruta: ruta || null,
        numero_ruta: numero_ruta || null,
        parada: parada || null
      });
      
      return {
        success: true,
        message: response.data.message || "Búsqueda guardada en el historial",
        data: {
          id: response.data.id,
          fecha: response.data.fecha
        }
      };
    } catch (error) {
      console.error("Error al guardar búsqueda:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error al guardar búsqueda en el historial"
      };
    }
  }

  // Eliminar una búsqueda del historial
  async eliminarBusqueda(id) {
    try {
      const response = await apiClient.delete(`/historial/${id}`);
      
      return {
        success: true,
        message: response.data.message || "Búsqueda eliminada del historial"
      };
    } catch (error) {
      console.error("Error al eliminar búsqueda:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error al eliminar búsqueda del historial"
      };
    }
  }

  // Limpiar todo el historial del usuario
  async limpiarHistorial() {
    try {
      const response = await apiClient.delete("/historial");
      
      return {
        success: true,
        message: response.data.message || "Historial limpiado exitosamente"
      };
    } catch (error) {
      console.error("Error al limpiar historial:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error al limpiar historial"
      };
    }
  }
}

// Exportar instancia singleton
export default new HistorialService();


