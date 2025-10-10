import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../layout/Header';

/* =========================================================
   Modal base (oscurecedor + contenedor)
========================================================= */
const Backdrop = ({ children, onClose }) => (
  <div
    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
    onClick={onClose}
  >
    <div
      className="absolute inset-0 flex items-center justify-center p-4"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  </div>
);

/* =========================================================
   Modal: Comienza tu viaje
========================================================= */
const NewTripModal = ({ onClose, onConfirm }) => {
  return (
    <Backdrop onClose={onClose}>
      <div className="relative z-50 w-full max-w-4xl rounded-2xl bg-[#141a2a] text-white shadow-2xl border border-[#2a3551]">
        {/* X cerrar */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 h-10 w-10 rounded-full bg-white text-[#141a2a] grid place-items-center shadow-lg"
          aria-label="Cerrar"
          title="Cerrar"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
          {/* Lado izquierdo */}
          <div>
            <h3 className="text-2xl md:text-3xl font-semibold">Comienza tu viaje</h3>
            <div className="h-2 w-24 rounded-md bg-[#5aa4e0] mt-3 mb-8" />

            {/* Select 1 */}
            <div className="mb-6">
              <p className="text-sm text-[#a9b2c7] mb-2">Selecciona el destino</p>
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-lg bg-[#0f1422] border border-[#2a3551] px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#5aa4e0]"
                  defaultValue=""
                >
                  <option value="" disabled>Destino</option>
                  <option>Destino A</option>
                  <option>Destino B</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#92a1c3]">▾</span>
              </div>
            </div>

            {/* Select 2 */}
            <div className="mb-10">
              <p className="text-sm text-[#a9b2c7] mb-2">Rutas de inicio</p>
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-lg bg-[#0f1422] border border-[#2a3551] px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#5aa4e0]"
                  defaultValue=""
                >
                  <option value="" disabled>Rutas de inicio</option>
                  <option>Ruta 1</option>
                  <option>Ruta 2</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#92a1c3]">▾</span>
              </div>
            </div>

            {/* Botón confirmar */}
            <button
              onClick={() => onConfirm?.()}
              className="w-full rounded-lg bg-[#5aa4e0] hover:bg-[#6db0e6] text-[#0d1220] font-semibold py-3 transition-colors"
            >
              Comenzar viaje
            </button>
          </div>

          {/* Lado derecho: mini mapa (placeholder) */}
          <div className="rounded-xl overflow-hidden border border-[#2a3551] bg-[#0f1422]">
            <div className="aspect-[4/3] w-full grid place-items-center text-[#7f8db0]">
              {/* Aquí va tu mapa embebido cuando lo tengas */}
              <span className="text-sm">Mapa de previsualización</span>
            </div>
          </div>
        </div>
      </div>
    </Backdrop>
  );
};

/* =========================================================
   Modal: Viaje comenzado
========================================================= */
const SuccessModal = ({ onClose }) => {
  return (
    <Backdrop onClose={onClose}>
      <div className="relative z-50 w-full max-w-4xl rounded-2xl bg-[#141a2a] text-white shadow-2xl border border-[#3a78c0]">
        {/* X cerrar */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 h-10 w-10 rounded-full bg-white text-[#141a2a] grid place-items-center shadow-lg"
          aria-label="Cerrar"
          title="Cerrar"
        >
          ✕
        </button>

        <div className="p-10 md:p-14">
          <h3 className="text-3xl md:text-4xl font-semibold text-center">Viaje comenzado</h3>
          <div className="h-2 w-28 bg-[#5aa4e0] rounded-md mx-auto mt-3 mb-10" />

          <div className="grid place-items-center py-6">
            {/* Check circular grande */}
            <div className="relative h-48 w-48 grid place-items-center">
              <div className="absolute inset-0 rounded-full border-[10px] border-[#1ea6ff]/40" />
              <svg viewBox="0 0 24 24" className="h-28 w-28 text-[#1ea6ff]">
                <path
                  fill="currentColor"
                  d="M9.5 16.2 5.8 12.5l-1.4 1.4 5.1 5.1 10-10-1.4-1.4z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Backdrop>
  );
};

/* =========================================================
   Modal: Hubo un error
========================================================= */
const ErrorModal = ({ onClose }) => {
  return (
    <Backdrop onClose={onClose}>
      <div className="relative z-50 w-full max-w-2xl rounded-2xl bg-[#141a2a] text-white shadow-2xl border border-[#2a3551]">
        {/* X cerrar */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 h-10 w-10 rounded-full bg-white text-[#141a2a] grid place-items-center shadow-lg"
          aria-label="Cerrar"
          title="Cerrar"
        >
          ✕
        </button>

        <div className="p-10 md:p-12">
          <h3 className="text-2xl md:text-3xl font-semibold text-center">Hubo un error</h3>
          <div className="h-2 w-24 bg-[#5aa4e0] rounded-md mx-auto mt-3 mb-8" />

          <div className="grid place-items-center py-4">
            {/* X circular */}
            <div className="relative h-28 w-28 grid place-items-center">
              <div className="absolute inset-0 rounded-full border-[8px] border-[#1ea6ff]/40" />
              <svg viewBox="0 0 24 24" className="h-16 w-16 text-[#1ea6ff]">
                <path
                  fill="currentColor"
                  d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Backdrop>
  );
};

/* =========================================================
   Página: Buses (MapPage)
========================================================= */
const MapPage = () => {
  const navigate = useNavigate();
  const [modal, setModal] = useState('none'); // none | newTrip | success | error

  const openNewTrip = () => setModal('newTrip');
  const closeModal = () => setModal('none');

  // Cambia "true" por "false" para probar el modal de error
  const handleCreateTrip = (ok = true) => {
    if (ok) setModal('success');
    else setModal('error');
  };

  return (
    <div className="min-h-screen bg-bg-primary bg-[#0b1020]">
      <Header />

      <main className="w-full px-6 md:px-10 py-10 max-w-7xl mx-auto">
        {/* Título y subrayado */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-text-primary text-white text-2xl md:text-3xl font-semibold">
              Buses
            </h1>
            <div className="h-1 w-28 bg-[#5aa4e0] rounded-md mt-3" />
          </div>

          {/* (X) Cerrar: vuelve a accesos rápidos */}
          <button
            onClick={() => navigate(-1)}
            className="h-10 w-10 rounded-full bg-[#162036] border border-[#2a3551] text-white/90 hover:bg-[#1b2745] grid place-items-center"
            aria-label="Volver"
            title="Volver"
          >
            ✕
          </button>
        </div>

        {/* Contenedor del mapa + acciones */}
        <div className="mt-8 rounded-2xl bg-[#12182a] border border-[#2a3551] shadow-xl p-5 md:p-6 relative">
          {/* Cabecera */}
          <div className="flex items-center justify-between gap-4">
            <p className="text-text-secondary text-[#a9b2c7] text-sm">
              Tu mapa en tiempo real
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={openNewTrip}
                className="flex items-center gap-2 rounded-lg bg-[#5aa4e0] hover:bg-[#6db0e6] text-[#0d1220] font-medium px-4 py-2 transition-colors"
              >
                <span className="text-sm">Nuevo recorrido</span>
                <span className="text-base leading-none">＋</span>
              </button>
            </div>
          </div>

          {/* X flotante del panel mapa */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white text-[#141a2a] grid place-items-center shadow"
            aria-label="Cerrar panel"
            title="Cerrar panel"
          >
            ✕
          </button>

          {/* Espacio del mapa */}
          <div className="mt-5 rounded-xl overflow-hidden border border-[#2a3551] bg-[#0f1422]">
            {/* Aquí integra tu mapa real (Leaflet/Google/etc.) */}
            <div className="h-[360px] w-full grid place-items-center text-[#7f8db0]">
              <span className="text-sm">Aquí va tu mapa en tiempo real</span>
            </div>
          </div>
        </div>
      </main>

      {/* MODALES */}
      {modal === 'newTrip' && (
        <NewTripModal
          onClose={closeModal}
          onConfirm={() => handleCreateTrip(true)} // cambia a false para ver “Hubo un error”
        />
      )}
      {modal === 'success' && <SuccessModal onClose={closeModal} />}
      {modal === 'error' && <ErrorModal onClose={closeModal} />}
    </div>
  );
};

export default MapPage;
