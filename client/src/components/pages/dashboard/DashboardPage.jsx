import Header from "../../layout/Header";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import historialService from "../../../services/historialService";
import detalleService from "../../../services/detalleService";
import apiClient from "../../../api/client";
import DetailModal from "./DetailModal";

/* ---------- Tarjeta estilo mock ---------- */
const StatCard = ({ title, iconSrc, value = 1, onClick }) => {
  // Mapeo de títulos a rutas de iconos para asegurar que se carguen correctamente
  const iconMap = {
    'Buses': '/busDashboard.png',
    'Paradas': '/Parada.png',
    'Rutas': '/Ruta.png'
  };
  
  const iconPath = iconMap[title] || iconSrc;
  
  return (
    <div 
      className="rounded-[18px] bg-[#a9c9e8] text-[#0f2b4a] px-8 py-6 shadow-[0_8px_24px_rgba(0,0,0,0.15)] cursor-pointer hover:bg-[#9bb3d6] transition-colors duration-200"
      onClick={onClick}
    >
      <p className="text-[28px] font-extrabold tracking-tight mb-4">{title}</p>

      <div className="flex items-center">
        {/* ícono cuadrado azul */}
        <div className="h-[84px] w-[84px] rounded-[10px] bg-[#64a3d5] grid place-items-center">
          <img 
            src={iconPath} 
            alt={title} 
            className="h-[54px] w-[54px] object-contain"
            loading="eager"
            onError={(e) => {
              console.error(`Error al cargar imagen para ${title}:`, iconPath);
            }}
          />
        </div>

        {/* número grande */}
        <span className="ml-auto text-[56px] leading-none font-extrabold text-[#102a5a]">
          {value}
        </span>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState({ buses: 0, paradas: 0, rutas: 0 });
  
  // Estados para el modal de detalles
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalTipo, setModalTipo] = useState(null); // 'paradas', 'rutas', 'buses'
  const [modalTitulo, setModalTitulo] = useState('');
  const [modalDatos, setModalDatos] = useState([]);
  const [cargandoModal, setCargandoModal] = useState(false);

  const cargarEstadisticas = async () => {
    try {
      const response = await apiClient.get('/api/estadisticas');
      if (response.data && response.data.success) {
        setEstadisticas({
          buses: response.data.buses || 0,
          paradas: response.data.paradas || 0,
          rutas: response.data.rutas || 0
        });
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  // Handler para abrir el modal con los datos correspondientes
  const handleAbrirModal = async (tipo) => {
    setModalTipo(tipo);
    setModalTitulo(tipo.charAt(0).toUpperCase() + tipo.slice(1));
    setCargandoModal(true);
    setModalAbierto(true);
    
    try {
      let resultado;
      if (tipo === 'paradas') {
        resultado = await detalleService.obtenerParadasDetalle();
      } else if (tipo === 'rutas') {
        resultado = await detalleService.obtenerRutasDetalle();
      } else if (tipo === 'buses') {
        resultado = await detalleService.obtenerBusesDetalle();
      }
      
      if (resultado.success) {
        console.log('Datos cargados exitosamente:', tipo, resultado.data?.length || 0, 'elementos');
        setModalDatos(resultado.data || []);
      } else {
        console.error('Error al cargar datos:', resultado.message);
        setModalDatos([]);
      }
    } catch (error) {
      console.error('Error al cargar datos del modal:', error);
      console.error('Detalles del error:', error.response?.data || error.message);
      setModalDatos([]);
    } finally {
      setCargandoModal(false);
    }
  };

  // Handler para cerrar el modal
  const handleCerrarModal = () => {
    setModalAbierto(false);
    setModalTipo(null);
    setModalTitulo('');
    setModalDatos([]);
  };

  const cargarHistorial = async () => {
    setLoading(true);
    const result = await historialService.obtenerHistorial(); // Obtener todas las búsquedas
    if (result.success) {
      let historialOrdenado = result.data.historial || [];
      
      // Ordenar por fecha descendente (más recientes primero)
      historialOrdenado.sort((a, b) => {
        const fechaA = new Date(a.fecha_busqueda);
        const fechaB = new Date(b.fecha_busqueda);
        return fechaB - fechaA; // Descendente
      });
      
      // Limitar a 10 resultados más recientes
      historialOrdenado = historialOrdenado.slice(0, 10);
      
      setHistorial(historialOrdenado);
    }
    setLoading(false);
  };

  // Recargar historial cada vez que se navega al Dashboard
  useEffect(() => {
    if (location.pathname === '/dashboard') {
      cargarHistorial();
      cargarEstadisticas();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Recargar historial cuando la ventana recupera el foco o se hace visible
  useEffect(() => {
    if (location.pathname !== '/dashboard') return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        cargarHistorial();
      }
    };

    const handleFocus = () => {
      cargarHistorial();
    };

    // Page Visibility API - detectar cuando la página se vuelve visible
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Window focus - detectar cuando la ventana recupera el foco
    window.addEventListener('focus', handleFocus);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    try {
      // Parsear la fecha correctamente
      // Si viene como string SQLite 'YYYY-MM-DD HH:MM:SS', tratarlo como hora local de El Salvador
      let date;
      if (typeof fecha === 'string') {
        // Parsear: 'YYYY-MM-DD HH:MM:SS' o 'YYYY-MM-DDTHH:MM:SS'
        const dateStr = fecha.replace('T', ' ');
        const [datePart, timePart] = dateStr.split(' ');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hour = 0, minute = 0, second = 0] = timePart ? timePart.split(':').map(Number) : [0, 0, 0];
        
        // Interpretar como hora local de El Salvador (UTC-6)
        // Cuando guardamos '2025-10-31 19:45:00' como hora local de El Salvador
        // En UTC eso sería '2025-11-01 01:45:00' (19:45 + 6 horas)
        // Para recrear el Date correcto que muestre 19:45 en El Salvador,
        // creamos Date.UTC sumando 6 horas a la hora local
        date = new Date(Date.UTC(year, month - 1, day, hour + 6, minute, second));
      } else {
        date = new Date(fecha);
      }
      
      // Formatear usando zona horaria de El Salvador
      const fechaElSalvador = new Intl.DateTimeFormat('es-SV', {
        timeZone: 'America/El_Salvador',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
      return fechaElSalvador;
    } catch (error) {
      console.error('Error al formatear fecha:', error, fecha);
      return 'N/A';
    }
  };

  const formatearHora = (fecha) => {
    if (!fecha) return 'N/A';
    try {
      // Parsear la fecha correctamente
      let date;
      if (typeof fecha === 'string') {
        const dateStr = fecha.replace('T', ' ');
        const [datePart, timePart] = dateStr.split(' ');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hour = 0, minute = 0, second = 0] = timePart ? timePart.split(':').map(Number) : [0, 0, 0];
        
        // Interpretar como hora local de El Salvador (UTC-6)
        // Convertir hora local de El Salvador a UTC sumando 6 horas
        date = new Date(Date.UTC(year, month - 1, day, hour + 6, minute, second));
      } else {
        date = new Date(fecha);
      }
      
      // Formatear usando zona horaria de El Salvador
      const horaElSalvador = new Intl.DateTimeFormat('es-SV', {
        timeZone: 'America/El_Salvador',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).format(date);
      return horaElSalvador;
    } catch (error) {
      console.error('Error al formatear hora:', error, fecha);
      return 'N/A';
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white">
      <Header />

      <main className="px-8 mt-10">
        {/* Título y subrayado */}
        <h1 className="text-4xl sm:text-[44px] font-semibold">Accesos rápidos con mapa</h1>
        <div className="mt-3 h-[10px] w-40 rounded-full bg-[#6aaee0]" />

        {/* ---------- Panel de tarjetas ---------- */}
        <section className="mt-10">
          <div className="mx-auto max-w-[1100px]">
            <div className="rounded-[16px] bg-[#1e263b]/90 border border-white/10 px-10 py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <StatCard 
                  title="Buses" 
                  iconSrc="/busDashboard.png" 
                  value={estadisticas.buses}
                  onClick={() => handleAbrirModal('buses')}
                />
                <StatCard 
                  title="Paradas" 
                  iconSrc="/Parada.png" 
                  value={estadisticas.paradas}
                  onClick={() => handleAbrirModal('paradas')}
                />
                <StatCard 
                  title="Rutas" 
                  iconSrc="/Ruta.png" 
                  value={estadisticas.rutas}
                  onClick={() => handleAbrirModal('rutas')}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Historial (igual al mock) ---------- */}
        <section className="mt-10 pb-16">
          <div className="mx-auto max-w-[1100px] rounded-xl bg-[#1f2740] border border-[#1f2740] px-4 pt-5 pb-6 relative">
            
            {/* Píldora "Historial" EXACTA */}
            <button
              onClick={cargarHistorial}
              className="inline-flex items-center gap-4 rounded-[28px] px-6 py-3 bg-[#69AEE0] text-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.15)] mb-6 cursor-pointer hover:bg-[#5EA0D6] transition-colors duration-200 active:scale-95"
              title="Refrescar historial"
            >
              <span className="text-[24px] font-extrabold leading-none">Historial</span>
              <img src="/Reloj.png" alt="Reloj" className="h-8 w-8 object-contain" />
            </button>


            {/* Tarjeta azul clara con tabla redondeada */}
            <div className="relative z-[1] mx-auto max-w-[980px] rounded-[14px] overflow-hidden bg-[#77AEDD]">
              {loading ? (
                <div className="py-10 text-center text-[#0f2b4a]">
                  <p className="text-lg font-semibold">Cargando historial...</p>
                </div>
              ) : historial.length === 0 ? (
                <div className="py-10 text-center text-[#0f2b4a]">
                  <p className="text-lg font-semibold">No hay búsquedas en tu historial</p>
                  <p className="text-sm mt-2">Comienza a buscar rutas en el mapa para ver tu historial aquí</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#5EA0D6] text-white font-semibold">
                      <th className="px-6 py-3 text-left">Origen</th>
                      <th className="px-6 py-3 text-left">Destino</th>
                      <th className="px-6 py-3 text-left">Hora</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial.map((h, i) => (
                      <tr 
                        key={h.id || i} 
                        className={`${i % 2 ? "bg-[#6CA6DA]" : "bg-[#A9C8E8]"} cursor-pointer hover:bg-[#5EA0D6] transition-colors`}
                        onClick={() => {
                          // Navegar al mapa con datos del historial
                          navigate('/map', { state: { historial: h } });
                        }}
                      >
                        <td className="px-6 py-3 text-[#0f2b4a] font-medium">{h.metadata?.origenNombre || 'N/A'}</td>
                        <td className="px-6 py-3 text-[#0f2b4a] font-medium">{h.metadata?.destinoNombre || 'N/A'}</td>
                        <td className="px-6 py-3 text-[#0f2b4a] font-medium">{formatearHora(h.fecha_busqueda)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Modal de detalles */}
      <DetailModal
        isOpen={modalAbierto}
        onClose={handleCerrarModal}
        title={modalTitulo}
        data={modalDatos}
        type={modalTipo}
        loading={cargandoModal}
      />
    </div>
  );
}
