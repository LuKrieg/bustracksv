import apiClient from "../api/client.js";

class RouteService {
  // Obtener todas las rutas con información completa
  async getRutas() {
    try {
      const response = await apiClient.get("/api/rutas");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al obtener rutas",
        error: error.response?.data,
      };
    }
  }

  // Obtener una ruta específica por ID o número
  async getRuta(identificador) {
    try {
      const response = await apiClient.get(`/api/rutas/${identificador}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al obtener ruta",
        error: error.response?.data,
      };
    }
  }

  // Obtener todas las paradas con información completa
  async getParadas() {
    try {
      const response = await apiClient.get("/api/paradas");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al obtener paradas",
        error: error.response?.data,
      };
    }
  }

  // Obtener una parada específica por ID o código
  async getParada(identificador) {
    try {
      const response = await apiClient.get(`/api/paradas/${identificador}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al obtener parada",
        error: error.response?.data,
      };
    }
  }

  // Buscar rutas cercanas a una ubicación
  async getRutasCercanas(lat, lng, radio = 500, limite = 10) {
    try {
      const response = await apiClient.get("/api/rutas-cercanas", {
        params: { lat, lng, radio, limite }
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al buscar rutas cercanas",
        error: error.response?.data,
      };
    }
  }

  // Buscar paradas cercanas a una ubicación
  async getParadasCercanas(lat, lng, radio = 500, limite = 10) {
    try {
      const response = await apiClient.get("/api/paradas-cercanas", {
        params: { lat, lng, radio, limite }
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al buscar paradas cercanas",
        error: error.response?.data,
      };
    }
  }

  // Recomendar mejor ruta entre dos puntos (ALGORITMO INTELIGENTE)
  async recomendarRuta(inicioLat, inicioLng, destinoLat, destinoLng, radio = 500) {
    try {
      const response = await apiClient.post("/api/recomendar-ruta", {
        inicioLat,
        inicioLng,
        destinoLat,
        destinoLng,
        radio
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al recomendar ruta",
        error: error.response?.data,
      };
    }
  }

  // Buscar rutas por proximidad (legacy - mantener compatibilidad)
  async buscarRutas(origen, destino) {
    try {
      // Usar el nuevo endpoint de recomendación
      const response = await this.recomendarRuta(
        origen.lat, 
        origen.lng, 
        destino.lat, 
        destino.lng
      );
      
      if (response.success) {
        // Adaptar respuesta al formato anterior
        return {
          success: true,
          data: {
            paradasOrigen: response.data.paradasOrigen || [],
            paradasDestino: response.data.paradasDestino || [],
            rutasRecomendadas: response.data.recomendaciones?.map(r => r.ruta) || [],
            recomendaciones: response.data.recomendaciones || [],
            estadisticas: response.data.estadisticas
          }
        };
      }
      
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al buscar rutas",
        error: error.response?.data,
      };
    }
  }

  // Convertir coordenadas de GeoJSON a formato Leaflet
  convertGeoJSONToLeaflet(geoJSON) {
    if (!geoJSON || !geoJSON.coordinates) return null;
    
    if (geoJSON.type === "Point") {
      return [geoJSON.coordinates[1], geoJSON.coordinates[0]];
    }
    
    if (geoJSON.type === "LineString") {
      return geoJSON.coordinates.map(coord => [coord[1], coord[0]]);
    }
    
    return null;
  }

  // Calcular distancia entre dos puntos (fórmula de Haversine)
  calcularDistancia(lat1, lng1, lat2, lng2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  toRad(deg) {
    return deg * (Math.PI/180);
  }

  // Crear icono personalizado para paradas
  crearIconoParada(tipo = 'Regular') {
    const colores = {
      'Terminal': '#22c55e',     // verde
      'TransferHub': '#3b82f6',  // azul
      'Regular': '#f59e0b'       // naranja
    };
    
    const color = colores[tipo] || colores['Regular'];
    
    return {
      iconUrl: `data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="14" fill="${color}" stroke="#fff" stroke-width="2"/>
          <circle cx="16" cy="16" r="6" fill="#fff"/>
        </svg>
      `)}`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    };
  }

  // Formatear tiempo en formato legible
  formatearTiempo(minutos) {
    if (minutos < 60) {
      return `${minutos} min`;
    }
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas}h ${mins}min`;
  }

  // Formatear distancia en formato legible
  formatearDistancia(metros) {
    if (metros < 1000) {
      return `${Math.round(metros)}m`;
    }
    return `${(metros / 1000).toFixed(1)}km`;
  }
}

// Exportar instancia singleton
export default new RouteService();
