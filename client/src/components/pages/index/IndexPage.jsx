import { Link } from 'react-router-dom';
import Header from '../../layout/Header';

const IndexPage = () => {
  return (
    <div className="min-h-screen bg-bg-primary pb-10">
      <Header />
      <main className="w-full px-8 py-0">
        {/* Top Section - Two Columns */}
        <div className="grid grid-cols-12 gap-8 mb-4">
          {/* Top Left Column - Text Content */}
          <div className="col-span-5 flex flex-col justify-center">
            {/* 1. Title */}
            <h1 className="text-5xl md:text-6xl text-text-primary mb-6 leading-tight">
              Donde tu ruta es la más <span className="font-bold">eficiente</span>
            </h1>

            {/* 2. Decorative Rectangle */}
            <div className="w-40 h-3 bg-accent-light-blue mb-6 rounded-sm"></div>

            {/* 3. First Paragraph */}
            <p className="text-text-primary text-lg mb-6 leading-relaxed">
              Planea tu viaje sin estrés: encuentra la mejor ruta, ahorra tiempo y llega puntual.
            </p>

            {/* 4. Second Paragraph */}
            <p className="text-text-secondary text-lg mb-8 leading-relaxed">
              Con BusTrackSV, tus trayectos en bus se convierten en experiencias más predecibles y rápidas.
              Observa en el mapa dónde está tu bus, recibe alertas de llegada y toma decisiones inteligentes
              para no perder tiempo. Porque tu viaje no empieza cuando subes al bus, empieza cuando sabes
              exactamente a qué hora llegará.
            </p>

            {/* 5. Button with arrows */}
            <Link
              to="/register"
              className="inline-flex items-center gap-3 bg-accent-light-blue text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-all duration-300 w-fit"
            >
              Busca tu ruta
              <img src="/flechas_seguir.png" alt="Flechas seguir" className="w-6 h-6" />
            </Link>
          </div>

          {/* Top Right Column - 3D Elements (Wider) */}
          <div className="col-span-7 relative min-h-[600px]">
            {/* Cilindro Celeste - Top left */}
            <img
              src="/cilindroCeleste.png"
              alt="Cilindro Celeste"
              className="absolute top-0 left-8 z-5 hover:scale-105 transition-transform duration-300"
              style={{ width: '260px', height: '260px' }}
            />

            {/* Cilindro Blanco - Right of cilindroCeleste, at middle height */}
            <img
              src="/cilindroBlanco.png"
              alt="Cilindro Blanco"
              className="absolute top-22 left-70 z-5 hover:scale-105 transition-transform duration-300"
              style={{ width: '125px', height: '100px' }}
            />

            {/* Barra Azul - Below cilindroCeleste */}
            <img
              src="/barraAzul.png"
              alt="Barra Azul"
              className="absolute top-64 left-16 z-5 transform -rotate-12 hover:scale-105 transition-transform duration-300"
              style={{ width: '100px', height: '80px' }}
            />

            {/* Bus - Between cilindroBlanco and barraAzul, lower part */}
            <img
              src="/bus.png"
              alt="Bus"
              className="absolute z-4 top-30 left-52 transform rotate-2 hover:scale-105 transition-transform duration-300"
              style={{ width: '500px', height: 'auto' }}
            />

            {/* Estrella Violeta - Bottom right corner */}
            <img
              src="/estrellaVioleta.png"
              alt="Estrella Violeta"
              className="absolute bottom-8 right-8 z-5 hover:scale-105 transition-transform duration-300"
              style={{ width: '150px', height: '150px' }}
            />
          </div>
        </div>

        {/* Bottom Section - Two Columns */}
        <div className="grid grid-cols-12 gap-20 items-center">
          {/* Bottom Left Column - Icon Cards (Wider) */}
          <div className="col-span-7 flex items-center justify-center">
            <div className="grid grid-cols-3 gap-6 w-full">
              {/* Large card - Map Route icon (Left side) */}
              <div className="col-span-2 bg-[#131b2e] rounded-3xl transition-all duration-300 aspect-[4/3] h-[330px] w-full flex items-center justify-center p-8 hover:scale-[1.02] shadow-2xl border border-white/5 group">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)] group-hover:drop-shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all">
                  <path d="M3 17l6-6 4 4 8-8" />
                  <path d="M19 7v4" />
                  <path d="M19 7h-4" />
                  <path d="M12 19.5c0 1.38-1.12 2.5-2.5 2.5S7 20.88 7 19.5 8.12 17 9.5 17s2.5 1.12 2.5 2.5z" />
                  <path d="M9.5 17V11" />
                  <path d="M20.5 6.5c0 1.38-1.12 2.5-2.5 2.5S15.5 7.88 15.5 6.5 16.62 4 18 4s2.5 1.12 2.5 2.5z" />
                </svg>
              </div>

              {/* Small cards - Right side */}
              <div className="flex flex-col gap-6">
                {/* Top right card - Monitor icon */}
                <div className="bg-[#131b2e] rounded-3xl transition-all duration-300 aspect-square h-[153px] flex items-center justify-center p-6 hover:scale-[1.02] shadow-2xl border border-white/5 group">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-3/4 h-3/4 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)] group-hover:drop-shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                    <circle cx="10" cy="10" r="3" />
                    <line x1="12.5" y1="12.5" x2="14" y2="14" />
                  </svg>
                </div>

                {/* Bottom right card - Clock icon */}
                <div className="bg-[#131b2e] rounded-3xl transition-all duration-300 aspect-square h-[153px] flex items-center justify-center p-6 hover:scale-[1.02] shadow-2xl border border-white/5 group">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-3/4 h-3/4 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)] group-hover:drop-shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                    <path d="M16 18l2 2 4-4" className="text-cyan-400" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Right Column - Text Content */}
          <div className="col-span-5 flex flex-col justify-center">
            {/* 1. Title Paragraph */}
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Viaja, monitorea,<br />
              llega a tiempo.
            </h2>

            {/* 2. Second Paragraph */}
            <p className="text-slate-400 text-lg leading-relaxed">
              Cada minuto cuenta. Por eso te ofrecemos datos actualizados al instante para que sepas qué bus
              tomar, en qué momento estará en tu parada y cuál es la mejor ruta para llegar a tu destino sin
              complicaciones. Nuestra misión es que moverte en transporte público sea tan confiable como
              mirar el reloj.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IndexPage;
