import apiClient from "../api/client.js";

class RouteService {
  // Obtener todas las paradas
  async getParadas() {
    try {
      const response = await apiClient.get("/api/paradas");

      // El servidor devuelve un array directamente, pero necesitamos normalizarlo
      const paradas = Array.isArray(response.data) ? response.data : [];

      // Agregar total_rutas si no existe (para compatibilidad con el código)
      const paradasConRutas = await Promise.all(
        paradas.map(async (parada) => {
          try {
            // Intentar obtener el conteo de rutas para esta parada
            // Por ahora, retornamos la parada sin modificar
            return {
              ...parada,
              latitud: parseFloat(parada.latitud),
              longitud: parseFloat(parada.longitud),
              total_rutas: parada.total_rutas || 0
            };
          } catch (error) {
            return {
              ...parada,
              latitud: parseFloat(parada.latitud),
              longitud: parseFloat(parada.longitud),
              total_rutas: 0
            };
          }
        })
      );

      return {
        success: true,
        data: paradasConRutas
      };
    } catch (error) {
      console.error("Error al obtener paradas:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error al obtener paradas",
        data: []
      };
    }
  }

  // Obtener todas las rutas
  async getRutas() {
    try {
      const response = await apiClient.get("/api/rutas");
      return {
        success: true,
        data: Array.isArray(response.data) ? response.data : []
      };
    } catch (error) {
      console.error("Error al obtener rutas:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error al obtener rutas",
        data: []
      };
    }
  }

  // Obtener paradas cercanas a una ubicación
  async getParadasCercanas(lat, lng, radio = 500) {
    try {
      const response = await apiClient.get("/api/paradas-cercanas", {
        params: {
          lat,
          lng,
          radio,
          limite: 10
        }
      });

      if (response.data.success && response.data.paradas) {
        // Normalizar la respuesta: el servidor devuelve paradas con distancia_metros
        // pero MapPage espera distancia
        const paradas = response.data.paradas.map(parada => ({
          ...parada,
          distancia: parada.distancia_metros || 0,
          latitud: parseFloat(parada.latitud),
          longitud: parseFloat(parada.longitud)
        }));

        return {
          success: true,
          data: paradas
        };
      } else {
        return {
          success: false,
          message: response.data.message || "No se encontraron paradas cercanas",
          data: []
        };
      }
    } catch (error) {
      console.error("Error al obtener paradas cercanas:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error al obtener paradas cercanas",
        data: []
      };
    }
  }

  // Recomendar ruta entre dos puntos
  async recomendarRuta(inicioLat, inicioLng, destinoLat, destinoLng, radio = 5000) {
    try {
      const response = await apiClient.post("/api/recomendar-ruta", {
        inicioLat,
        inicioLng,
        destinoLat,
        destinoLng,
        radio
      });

      // El servidor devuelve exito (no success) y recomendaciones directamente
      // Normalizar la respuesta para que siempre sea success: true cuando hay respuesta del servidor
      // (incluso si no hay recomendaciones, para que MapPage pueda mostrar el mensaje)
      return {
        success: true,
        data: {
          recomendaciones: response.data.recomendaciones || [],
          mensaje: response.data.mensaje || (response.data.exito ? "Rutas encontradas" : "No se encontraron rutas"),
          sugerencia: response.data.exito === false
            ? (response.data.sugerenciasOrigen || response.data.sugerenciasDestino
              ? "Intenta con paradas cercanas con más conexiones"
              : "")
            : "",
          paradasSugeridas: response.data.exito === false
            ? [
              ...(response.data.sugerenciasOrigen || []).map(p => p.nombre || p),
              ...(response.data.sugerenciasDestino || []).map(p => p.nombre || p)
            ]
            : [],
          origen: response.data.origen,
          destino: response.data.destino,
          paradasOrigen: response.data.paradasOrigen || [],
          paradasDestino: response.data.paradasDestino || [],
          estadisticas: response.data.estadisticas || {}
        }
      };
    } catch (error) {
      console.error("Error al recomendar ruta:", error);

      // El servidor puede devolver success: false en el catch
      if (error.response?.data?.success === false) {
        return {
          success: false,
          error: {
            mensaje: error.response.data.message || "Error al buscar rutas",
            sugerencia: ""
          },
          message: error.response.data.message || "Error al buscar rutas"
        };
      }

      return {
        success: false,
        message: error.response?.data?.message || "Error al buscar rutas",
        error: {
          mensaje: error.response?.data?.message || "Error al buscar rutas",
          sugerencia: ""
        }
      };
    }
  }
}

// Exportar instancia singleton
export default new RouteService();

