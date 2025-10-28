import apiClient from '../api/client';

const historialService = {
  // Guardar búsqueda en el historial
  guardarBusqueda: async (busquedaData) => {
    try {
      const response = await apiClient.post('/historial', busquedaData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al guardar búsqueda:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al guardar búsqueda'
      };
    }
  },

  // Obtener historial del usuario
  obtenerHistorial: async (limite = 20, offset = 0) => {
    try {
      const response = await apiClient.get('/historial', {
        params: { limite, offset }
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al obtener historial:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener historial'
      };
    }
  },

  // Eliminar una búsqueda del historial
  eliminarBusqueda: async (id) => {
    try {
      const response = await apiClient.delete(`/historial/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al eliminar búsqueda:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al eliminar búsqueda'
      };
    }
  },

  // Limpiar todo el historial
  limpiarHistorial: async () => {
    try {
      const response = await apiClient.delete('/historial');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al limpiar historial:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al limpiar historial'
      };
    }
  }
};

export default historialService;



