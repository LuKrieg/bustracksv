import historialService from './historialService';

/**
 * Helper para guardar búsquedas en el historial de manera consistente
 */
const historialHelper = {
  /**
   * Guardar una búsqueda de ruta en el historial
   * @param {Object} datos - Datos de la búsqueda
   * @param {string} datos.ruta - Nombre de la ruta buscada
   * @param {string} datos.numero_ruta - Número de la ruta (ejemplo: "R1", "101-D")
   * @param {string} datos.parada - Nombre de la parada
   * @param {number} datos.latitud_origen - Latitud del punto de origen
   * @param {number} datos.longitud_origen - Longitud del punto de origen
   * @param {number} datos.latitud_destino - Latitud del punto de destino
   * @param {number} datos.longitud_destino - Longitud del punto de destino
   * @param {Object} datos.metadata - Información adicional (opcional)
   */
  guardarBusquedaRuta: async (datos) => {
    try {
      const result = await historialService.guardarBusqueda({
        ruta: datos.ruta || null,
        numero_ruta: datos.numero_ruta || null,
        parada: datos.parada || null,
        latitud_origen: datos.latitud_origen || null,
        longitud_origen: datos.longitud_origen || null,
        latitud_destino: datos.latitud_destino || null,
        longitud_destino: datos.longitud_destino || null,
        tipo_busqueda: 'ruta',
        metadata: datos.metadata || {}
      });
      
      return result;
    } catch (error) {
      console.error('Error al guardar búsqueda de ruta:', error);
      return { success: false };
    }
  },

  /**
   * Guardar una búsqueda de parada en el historial
   */
  guardarBusquedaParada: async (datos) => {
    try {
      const result = await historialService.guardarBusqueda({
        parada: datos.parada,
        latitud_origen: datos.latitud || null,
        longitud_origen: datos.longitud || null,
        tipo_busqueda: 'parada',
        metadata: datos.metadata || {}
      });
      
      return result;
    } catch (error) {
      console.error('Error al guardar búsqueda de parada:', error);
      return { success: false };
    }
  },

  /**
   * Guardar una recomendación de ruta en el historial
   */
  guardarRecomendacion: async (recomendacion) => {
    try {
      // Extraer información de la recomendación
      const primerSegmento = recomendacion.segmentos?.[0];
      const ultimoSegmento = recomendacion.segmentos?.[recomendacion.segmentos.length - 1];
      
      const result = await historialService.guardarBusqueda({
        ruta: primerSegmento?.ruta?.nombre || null,
        numero_ruta: primerSegmento?.ruta?.numero_ruta || null,
        parada: primerSegmento?.paradaInicio?.nombre || null,
        latitud_origen: primerSegmento?.paradaInicio?.latitud || null,
        longitud_origen: primerSegmento?.paradaInicio?.longitud || null,
        latitud_destino: ultimoSegmento?.paradaFin?.latitud || null,
        longitud_destino: ultimoSegmento?.paradaFin?.longitud || null,
        tipo_busqueda: 'recomendacion',
        metadata: {
          transbordos: recomendacion.transbordos || 0,
          tiempo_total: recomendacion.tiempoTotalMinutos || 0,
          tarifa_total: recomendacion.tarifaTotal || 0,
          numero_segmentos: recomendacion.segmentos?.length || 0
        }
      });
      
      return result;
    } catch (error) {
      console.error('Error al guardar recomendación:', error);
      return { success: false };
    }
  },

  /**
   * Guardar múltiples búsquedas en lote (útil cuando se obtienen varias recomendaciones)
   */
  guardarVariasRecomendaciones: async (recomendaciones) => {
    try {
      // Guardar solo la mejor recomendación (primera) para evitar saturar el historial
      if (recomendaciones && recomendaciones.length > 0) {
        return await historialHelper.guardarRecomendacion(recomendaciones[0]);
      }
      return { success: false };
    } catch (error) {
      console.error('Error al guardar recomendaciones:', error);
      return { success: false };
    }
  },

  /**
   * Guardar búsqueda general (cuando no calza en otras categorías)
   */
  guardarBusquedaGeneral: async (datos) => {
    try {
      const result = await historialService.guardarBusqueda({
        ruta: datos.ruta || null,
        numero_ruta: datos.numero_ruta || null,
        parada: datos.parada || null,
        latitud_origen: datos.latitud_origen || null,
        longitud_origen: datos.longitud_origen || null,
        latitud_destino: datos.latitud_destino || null,
        longitud_destino: datos.longitud_destino || null,
        tipo_busqueda: 'general',
        metadata: datos.metadata || {}
      });
      
      return result;
    } catch (error) {
      console.error('Error al guardar búsqueda general:', error);
      return { success: false };
    }
  }
};

export default historialHelper;

// ============================================================================
// EJEMPLO DE USO
// ============================================================================

/*
// 1. En el componente de búsqueda de rutas (MapPage.jsx):

import historialHelper from '../services/historialHelper';

const buscarRuta = async () => {
  // ... realizar búsqueda de ruta ...
  
  const resultado = await apiClient.post('/api/recomendar-ruta', {
    inicioLat: origen.lat,
    inicioLng: origen.lng,
    destinoLat: destino.lat,
    destinoLng: destino.lng
  });
  
  if (resultado.data.exito) {
    // Guardar la mejor recomendación en el historial
    await historialHelper.guardarVariasRecomendaciones(resultado.data.recomendaciones);
    
    // O guardar una recomendación específica:
    // await historialHelper.guardarRecomendacion(resultado.data.recomendaciones[0]);
  }
};

// 2. Cuando se busca una parada específica:

const buscarParada = async (paradaNombre, lat, lng) => {
  // ... realizar búsqueda de parada ...
  
  await historialHelper.guardarBusquedaParada({
    parada: paradaNombre,
    latitud: lat,
    longitud: lng,
    metadata: {
      zona: 'Centro',
      tipo: 'Regular'
    }
  });
};

// 3. Cuando se selecciona una ruta:

const seleccionarRuta = async (ruta) => {
  // ... procesar selección de ruta ...
  
  await historialHelper.guardarBusquedaRuta({
    ruta: ruta.nombre,
    numero_ruta: ruta.numero_ruta,
    metadata: {
      empresa: ruta.empresa,
      tarifa: ruta.tarifa
    }
  });
};
*/






