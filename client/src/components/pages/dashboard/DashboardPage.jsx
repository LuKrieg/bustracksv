import { useMemo } from "react";

export default function DashboardPage() {
  const logo = "/logo_full.png";
  const iconBus = "/bus.png";
  const iconParada = "/cilindroCeleste.png"; // usa /map.png si luego lo tienen
  const iconRuta = "/calendar.png";

  const stats = useMemo(
    () => [
      { label: "Buses",   value: 1, icon: iconBus },
      { label: "Paradas", value: 1, icon: iconParada },
      { label: "Rutas",   value: 1, icon: iconRuta },
    ],
    []
  );

  const historial = useMemo(
  () => [
    { ruta: "25 av. norte",     bus: "36-C",  parada: "25 av norte",     dia: "03/10/25", hora: "12:00 PM" },
    { ruta: "Hospital Rosales", bus: "42-A",  parada: "Parque infantil", dia: "03/10/25", hora: "12:00 PM" },
    { ruta: "49 av. norte",     bus: "109-B", parada: "Metrocentro",     dia: "03/10/25", hora: "12:00 PM" },
    { ruta: "Autop. Comalapa",  bus: "12-B",  parada: "Paso el Jaguar",  dia: "03/10/25", hora: "12:00 PM" },
  ],
  []
);

  return (
    <div className="min-h-dvh relative bg-[#0b0f1a] text-slate-100">
      {/* borde celeste fino alrededor */}
      <div className="pointer-events-none absolute inset-0 border border-[#62b0e6]"></div>

      {/* barra superior */}
      <header className="flex items-center justify-between px-8 pt-6">
        <div className="flex items-center gap-4">
          <img src={logo} alt="BusTrackSV" className="h-12 w-auto" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-300">Hola, usuario</span>
          <div className="h-10 w-10 grid place-items-center rounded-full bg-[#6aaee0] text-[#0b1733] text-xl">
            ⍟
          </div>
        </div>
      </header>

      {/* título y subrayado */}
      <section className="px-8 mt-10">
        <h2 className="text-4xl sm:text-5xl font-semibold">Accesos rápidos con mapa</h2>
        <div className="mt-4 h-3 w-48 rounded-full bg-[#6aaee0]" />
      </section>

      {/* contenedor de tarjetas */}
      <section className="px-8 mt-10">
        <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl bg-[#9cc5e6]/60 p-4 shadow-[0_10px_40px_rgba(0,0,0,.25)]"
              >
                <div className="rounded-lg bg-[#cfe5f7] px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#1a3350] font-semibold text-lg">{s.label}</p>
                      <div className="mt-3 flex items-center gap-4">
                        <img src={s.icon} alt={s.label} className="h-12 w-12 object-contain" />
                        <span className="text-[#1a3350] text-3xl font-bold">1</span>
                      </div>
                    </div>
                    {/* espacio a la derecha para respirar como en el mock */}
                    <div className="w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* tabla historial */}
      <section className="px-8 mt-10 pb-16">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#3b4b6b] text-white px-5 py-2 text-lg">
            <span className="font-semibold">Historial</span>
            <span className="text-white/90">🕒</span>
          </div>

          <div className="mt-6 overflow-x-auto">
            <div className="rounded-2xl overflow-hidden border border-white/10">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-[#62b0e6] text-[#103052]">
                    <th className="px-6 py-3 text-left font-semibold">Ruta</th>
                    <th className="px-6 py-3 text-left font-semibold">Bus</th>
                    <th className="px-6 py-3 text-left font-semibold">Parada</th>
                    <th className="px-6 py-3 text-left font-semibold">Día</th>
                    <th className="px-6 py-3 text-left font-semibold">Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.map((h, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-[#9cc5e6]/40" : "bg-[#9cc5e6]/20"}>
                      <td className="px-6 py-4 text-slate-200">{h.ruta}</td>
                      <td className="px-6 py-4 text-slate-200">{h.bus}</td>
                      <td className="px-6 py-4 text-slate-200">{h.parada}</td>
                      <td className="px-6 py-4 text-slate-200">{h.dia}</td>
                      <td className="px-6 py-4 text-slate-200">{h.hora}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
