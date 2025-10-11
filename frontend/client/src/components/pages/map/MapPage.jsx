import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../layout/Header';

const MapPage = () => {
  const navigate = useNavigate();

  // Si ya tienes tus propios estados/modales, puedes conservarlos.
  // Aquí sólo dejo un estado para abrir el modal de "Comienza tu viaje".
  const [isStartOpen, setIsStartOpen] = useState(false);

  const openStart = () => setIsStartOpen(true);
  const closeStart = () => setIsStartOpen(false);

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />

      {/* Página Buses */}
      <main className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        {/* Título de página + botón de cerrar (volver) */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-text-primary text-4xl md:text-[42px] font-semibold">
              Buses
            </h1>
            <div className="h-1.5 w-36 rounded-md bg-accent-light-blue mt-3" />
          </div>

          {/* Cerrar (volver a Accesos rápidos) */}
          <button
            onClick={() => navigate(-1)}
            className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white/5
                       ring-1 ring-white/10 text-text-primary hover:bg-white/10 transition"
            aria-label="Cerrar"
            title="Cerrar"
          >
            <span className="text-2xl font-semibold">×</span>
          </button>
        </div>

        {/* Tarjeta principal */}
        <section
          className="relative rounded-2xl border border-white/5 bg-[#0E1523]/80 backdrop-blur
                     shadow-[0_10px_30px_rgba(0,0,0,.35)] p-5 md:p-6"
        >
          {/* Encabezado dentro de la tarjeta: título grande + botón nuevo recorrido */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-text-primary text-2xl md:text-3xl font-semibold">
              Tu mapa en tiempo real
            </h2>

            <button
              onClick={openStart}
              className="inline-flex items-center gap-2 rounded-lg bg-accent-blue px-5 py-2.5
                         text-white font-medium hover:bg-accent-light-blue transition"
            >
              Nuevo recorrido
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20
                                text-white text-lg leading-none">+</span>
            </button>
          </div>

          {/* Área del mapa */}
          <div
            className="rounded-xl bg-[#0B1320] ring-1 ring-white/5
                       h-[420px] md:h-[460px] flex items-center justify-center
                       text-text-secondary/70 text-center"
          >
            Aquí va tu mapa en tiempo real
          </div>

          {/* Botón salir del recorrido (esquina inferior derecha) */}
          <button
            className="absolute bottom-4 right-4 rounded-lg bg-accent-blue px-5 py-2.5
                       text-white font-medium hover:bg-accent-light-blue transition"
          >
            Salir del recorrido
          </button>
        </section>
      </main>

      {/* --- Modal "Comienza tu viaje" (usa el tuyo si ya lo tienes) --- */}
      {isStartOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60
                     backdrop-blur-sm"
        >
          <div
            className="relative w-[95%] md:w-[900px] rounded-2xl border border-white/10
                       bg-[#121A2A]/95 p-6 md:p-8 shadow-2xl"
          >
            <button
              onClick={closeStart}
              className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center
                         rounded-full bg-white/10 ring-1 ring-white/15 text-white hover:bg-white/20"
              aria-label="Cerrar modal"
              title="Cerrar"
            >
              <span className="text-2xl leading-none">×</span>
            </button>

            <h3 className="text-text-primary text-3xl md:text-[32px] font-semibold">
              Comienza tu viaje
            </h3>
            <div className="h-1 w-28 rounded-md bg-accent-light-blue mt-3 mb-6" />

            {/* Columna izquierda: selects + botón (placeholder) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block text-text-secondary text-sm">Selecciona el destino</label>
                <div className="rounded-lg bg-[#0B1320] ring-1 ring-white/10 px-4 py-3 text-text-primary">
                  Destino
                </div>

                <label className="block text-text-secondary text-sm mt-4">Rutas de inicio</label>
                <div className="rounded-lg bg-[#0B1320] ring-1 ring-white/10 px-4 py-3 text-text-primary">
                  Rutas de inicio
                </div>

                <button
                  className="mt-6 w-full rounded-lg bg-accent-blue px-6 py-3 text-white
                             font-medium hover:bg-accent-light-blue transition"
                >
                  Comenzar viaje
                </button>
              </div>

              {/* derecha: previsualización del mapa */}
              <div className="rounded-xl bg-[#0B1320] ring-1 ring-white/10 h-[260px] md:h-full
                              flex items-center justify-center text-text-secondary/70">
                Mapa de previsualización
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPage;
