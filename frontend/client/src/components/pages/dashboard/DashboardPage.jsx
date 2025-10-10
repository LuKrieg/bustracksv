import Header from "../../layout/Header";
import { useMemo } from "react";

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
  // Cambia la fecha si lo querés 2022 como en el mock
  const FECHA = "03/10/25"; // para 2022: "03/10/22"
  const HORA  = "12:00 PM";

  const historial = useMemo(
    () => [
      { ruta: "25 av. norte", bus: "36-C",  parada: "25 av norte",     dia: FECHA, hora: HORA },
      { ruta: "Hospital Rosales", bus: "42-A",  parada: "Parque infantil", dia: FECHA, hora: HORA },
      { ruta: "49 av. norte", bus: "109-B", parada: "Metrocentro",     dia: FECHA, hora: HORA },
      { ruta: "Autop. Comalapa", bus: "12-B",  parada: "Paso el Jaguar",  dia: FECHA, hora: HORA },
    ],
    [FECHA, HORA]
  );

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
                        <tr key={i} className={i % 2 ? "bg-[#6CA6DA]" : "bg-[#A9C8E8]"}>
                          <td className="px-6 py-3 text-[#0f2b4a] font-medium">{h.ruta}</td>
                          <td className="px-6 py-3 text-[#0f2b4a] font-medium">{h.bus}</td>
                          <td className="px-6 py-3 text-[#0f2b4a] font-medium">{h.parada}</td>
                          <td className="px-6 py-3 text-[#0f2b4a] font-medium">{h.dia}</td>
                          <td className="px-6 py-3 text-[#0f2b4a] font-medium">{h.hora}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
