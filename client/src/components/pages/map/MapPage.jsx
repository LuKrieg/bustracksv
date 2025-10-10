import { useState } from 'react';
import Header from '../../layout/Header';

/* ---------- Modal base (fondo + tarjeta) ---------- */
const Modal = ({ open, onClose, widthClass = 'max-w-2xl', children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Card */}
      <div
        className={`relative mx-auto mt-20 rounded-2xl bg-[#1B2236] text-white shadow-2xl ${widthClass} w-[92%]`}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
};

/* ---------- Iconos (SVG puros) ---------- */
const CloseButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white text-[#1B2236] shadow-md hover:opacity-90"
    aria-label="Cerrar"
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </button>
);

const BigCheck = () => (
  <div className="mx-auto grid place-items-center">
    <div className="relative h-48 w-48 md:h-64 md:w-64">
      <div className="absolute inset-0 rounded-full border-[12px] border-[#12A4FF]/70" />
      <div className="absolute inset-[18%] rounded-full border-[12px] border-[#0B79FF]" />
      <svg
        className="absolute inset-0 m-auto"
        width="170"
        height="170"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M7 12l3 3 7-7"
          stroke="#08A6FF"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  </div>
);

const BigCross = () => (
  <div className="mx-auto grid place-items-center">
    <div className="relative h-48 w-48 md:h-64 md:w-64">
      <div className="absolute inset-0 rounded-full border-[12px] border-[#12A4FF]/70" />
      <div className="absolute inset-[18%] rounded-full border-[12px] border-[#0B79FF]" />
      <svg
        className="absolute inset-0 m-auto"
        width="170"
        height="170"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M7 7l10 10M17 7 7 17"
          stroke="#08A6FF"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  </div>
);

/* ---------- Mini “mapa” decorativo (place-holder) ---------- */
const MiniMap = () => (
  <div className="h-[150px] w-[180px] rounded-xl bg-[#E9F3FF] p-2 shadow-inner">
    <div className="h-full w-full rounded-lg bg-[url('https://tile.openstreetmap.org/3/4/4.png')] bg-cover bg-center" />
    {/* Pins rojos */}
    <span className="absolute -mt-[130px] ml-8 inline-block h-4 w-4 rounded-full border-2 border-white bg-[#E53935]" />
    <span className="absolute -mt-[85px] ml-[120px] inline-block h-4 w-4 rounded-full border-2 border-white bg-[#E53935]" />
  </div>
);

/* ---------- MODAL 1: Comienza tu viaje ---------- */
const StartTripModal = ({ open, onClose, onSubmit }) => {
  return (
    <Modal open={open} onClose={onClose} widthClass="max-w-3xl">
      <CloseButton onClick={onClose} />
      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-[1fr_200px] md:gap-10 md:p-8">
        <div>
          <h3 className="mb-4 text-[18px] font-semibold">Comienza tu viaje</h3>

          {/* Selects */}
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs text-white/70">Selecciona el destino</label>
              <div className="relative">
                <select className="w-full rounded-md border border-white/10 bg-[#12182A] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#4FB3FF]">
                  <option>Destino</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/60">
                  ▼
                </span>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs text-white/70">Ruta de inicio</label>
              <div className="relative">
                <select className="w-full rounded-md border border-white/10 bg-[#12182A] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#4FB3FF]">
                  <option>Ruta de inicio</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/60">
                  ▼
                </span>
              </div>
            </div>
          </div>

          {/* Botón */}
          <button
            onClick={onSubmit}
            className="mt-5 w-[210px] rounded-md bg-[#3EA8FF] py-2 text-sm font-semibold text-white hover:bg-[#4FB3FF]"
          >
            Comenzar viaje
          </button>
        </div>

        {/* Mini mapa a la derecha */}
        <div className="relative hidden place-items-start md:grid">
          <MiniMap />
        </div>
      </div>
    </Modal>
  );
};

/* ---------- MODAL 2: Viaje comenzado ---------- */
const TripStartedModal = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose} widthClass="max-w-2xl">
      <CloseButton onClick={onClose} />
      <div className="p-8 text-center md:p-12">
        <h3 className="text-white/90">Viaje comenzado</h3>
        <div className="mx-auto mt-2 h-2 w-28 rounded-full bg-[#4FB3FF]" />
        <div className="mt-6">
          <BigCheck />
        </div>
      </div>
    </Modal>
  );
};

/* ---------- MODAL 3: Hubo un error ---------- */
const ErrorModal = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose} widthClass="max-w-4xl">
      <CloseButton onClick={onClose} />
      <div className="p-6 text-center md:p-10">
        <h2 className="text-2xl font-semibold text-white">Hubo un error</h2>
        <div className="mx-auto mt-3 h-2 w-36 rounded-md bg-[#4FB3FF]" />
        <div className="mt-6">
          <BigCross />
        </div>
      </div>
    </Modal>
  );
};

/* ================================================================== */
/*                           PÁGINA DEL MAPA                          */
/* ================================================================== */
const MapPage = () => {
  const [startOpen, setStartOpen] = useState(false);
  const [okOpen, setOkOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />

      {/* Contenido del mapa (placeholder) */}
      <main className="relative mx-auto w-full max-w-[1200px] px-6 pb-16 pt-8">
        <p className="text-text-primary text-2xl">Map</p>

        {/* Botones demo para mostrar los modales (elimina si ya disparas desde la UI real) */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => setStartOpen(true)}
            className="rounded-lg bg-[#3EA8FF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4FB3FF]"
          >
            Abrir “Comienza tu viaje”
          </button>
          <button
            onClick={() => setOkOpen(true)}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
          >
            Abrir “Viaje comenzado”
          </button>
          <button
            onClick={() => setErrorOpen(true)}
            className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-600"
          >
            Abrir “Hubo un error”
          </button>
        </div>

        {/* Aquí iría tu componente real del mapa */}
        <div className="mt-8 h-[520px] w-full rounded-2xl bg-[#0E1426] ring-1 ring-white/5" />
      </main>

      {/* Modales */}
      <StartTripModal
        open={startOpen}
        onClose={() => setStartOpen(false)}
        onSubmit={() => {
          setStartOpen(false);
          setOkOpen(true); // comportamiento típico tras confirmar
        }}
      />
      <TripStartedModal open={okOpen} onClose={() => setOkOpen(false)} />
      <ErrorModal open={errorOpen} onClose={() => setErrorOpen(false)} />
    </div>
  );
};

export default MapPage;


