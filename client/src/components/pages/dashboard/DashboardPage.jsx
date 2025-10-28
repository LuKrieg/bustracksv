import Header from "../../layout/Header";
import { useState, useEffect } from "react";
import historialService from "../../../services/historialService";

/* ---------- Tarjeta estilo mock ---------- */
const StatCard = ({ title, iconSrc, value = 1 }) => (
  <div className="rounded-[18px] bg-[#a9c9e8] text-[#0f2b4a] px-8 py-6 shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
    <p className="text-[28px] font-extrabold tracking-tight mb-4">{title}</p>

    <div className="flex items-center">
      {/* ícono cuadrado azul */}
      <div className="h-[84px] w-[84px] rounded-[10px] bg-[#64a3d5] grid place-items-center">
        <img src={iconSrc} alt={title} className="h-[54px] w-[54px] object-contain" />
      </div>

      {/* número grande */}
      <span className="ml-auto text-[56px] leading-none font-extrabold text-[#102a5a]">
        {value}
      </span>
    </div>
  </div>
);

export default function DashboardPage() {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cargarHistorial = async () => {
    setLoading(true);
    const result = await historialService.obtenerHistorial(10); // Obtener últimas 10 búsquedas
    if (result.success) {
      setHistorial(result.data.historial);
    }
    setLoading(false);
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-SV', { day: '2-digit', month: '2-digit', year: '2-digit' });
  };

  const formatearHora = (fecha) => {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleTimeString('es-SV', { hour: '2-digit', minute: '2-digit', hour12: true });
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
                <StatCard title="Buses"   iconSrc="/busDashboard.png" value={1} />
                <StatCard title="Paradas" iconSrc="/Parada.png"       value={1} />
                <StatCard title="Rutas"   iconSrc="/Ruta.png"         value={1} />
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Historial (igual al mock) ---------- */}
        <section className="mt-10 pb-16">
          <div className="mx-auto max-w-[1100px] rounded-xl bg-[#1f2740] border border-[#1f2740] px-4 pt-5 pb-6 relative">
            
            {/* Píldora "Historial" EXACTA */}
            <div className="inline-flex items-center gap-4 rounded-[28px] px-6 py-3 bg-[#69AEE0] text-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.15)] mb-6">
              <span className="text-[24px] font-extrabold leading-none">Historial</span>
              <img src="/Reloj.png" alt="Reloj" className="h-8 w-8 object-contain" />
            </div>


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
                      <th className="px-6 py-3 text-left">Ruta</th>
                      <th className="px-6 py-3 text-left">Bus</th>
                      <th className="px-6 py-3 text-left">Parada</th>
                      <th className="px-6 py-3 text-left">Día</th>
                      <th className="px-6 py-3 text-left">Hora</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial.map((h, i) => (
                      <tr key={h.id || i} className={i % 2 ? "bg-[#6CA6DA]" : "bg-[#A9C8E8]"}>
                        <td className="px-6 py-3 text-[#0f2b4a] font-medium">{h.ruta || 'N/A'}</td>
                        <td className="px-6 py-3 text-[#0f2b4a] font-medium">{h.numero_ruta || 'N/A'}</td>
                        <td className="px-6 py-3 text-[#0f2b4a] font-medium">{h.parada || 'N/A'}</td>
                        <td className="px-6 py-3 text-[#0f2b4a] font-medium">{formatearFecha(h.fecha_busqueda)}</td>
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
    </div>
  );
}
