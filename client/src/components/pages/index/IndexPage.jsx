import { Link } from 'react-router-dom';
import Header from '../../layout/Header';

const IndexPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0d1221] to-[#0a0e1a] pb-10">
      <Header />
      <main className="w-full px-8 py-0">
        {/* Top Section - Two Columns */}
        <div className="grid grid-cols-12 gap-8 mb-16 mt-8">
          {/* Top Left Column - Text Content */}
          <div className="col-span-5 flex flex-col justify-center">
            {/* 1. Title */}
            <h1 className="text-5xl md:text-6xl text-white mb-6 leading-tight font-medium">
              Donde tu ruta es la más{' '}
              <span className="relative inline-block">
                eficiente
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#7bc4f0] rounded-full"></span>
              </span>
            </h1>

            {/* 3. First Paragraph */}
            <p className="text-white/90 text-base mb-4 leading-relaxed">
              Planea tu viaje sin estrés: encuentra la mejor ruta, ahorra tiempo y llega puntual.
            </p>

            {/* 4. Second Paragraph */}
            <p className="text-white/80 text-sm mb-8 leading-relaxed">
              Con BusTrackSV, tus trayectos en bus se convierten en experiencias más predecibles y rápidas.
              Observa en el mapa dónde está tu bus, recibe alertas de llegada y toma decisiones inteligentes
              para no perder tiempo. Porque tu viaje no empieza cuando subes al bus, empieza cuando sabes
              exactamente a qué hora llegará.
            </p>

            {/* 5. Button with arrows */}
            <Link
              to="/map"
              className="inline-flex items-center gap-3 bg-[#7bc4f0] text-white px-6 py-3 rounded-lg font-medium text-base hover:bg-[#6ab3e0] transition-all duration-300 w-fit shadow-lg"
            >
              Busca tu ruta
              <span className="text-lg">»</span>
              <span className="text-lg">»</span>
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
        <div className="grid grid-cols-12 gap-12 items-center mt-20">
          {/* Bottom Left Column - Icon Cards (Wider) */}
          <div className="col-span-7 flex items-center justify-center">
            <div className="grid grid-cols-3 gap-6 w-full">
              {/* Large card - Map Route icon (Left side) */}
              <div className="col-span-2 bg-[#1a2234]/40 backdrop-blur-sm rounded-3xl transition-all duration-300 aspect-[4/3] h-[330px] w-full flex items-center justify-center p-8 border border-[#7bc4f0]/40 hover:border-[#7bc4f0]/70 hover:bg-[#1a2234]/60">
                <svg viewBox="0 0 100 60" fill="none" stroke="#7bc4f0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                  {/* Winding S-shaped path */}
                  <path d="M10 50 Q25 25, 40 35 Q55 45, 70 20 Q85 15, 90 30" />
                  {/* Location pin 1 - teardrop shape with circle inside (bottom-left curve) */}
                  <g transform="translate(40, 35)">
                    <path d="M0 -4.5 A2.5 2.5 0 1 1 0 4.5 L0 6.5 Z" fill="none" stroke="#7bc4f0" strokeWidth="2.5" />
                    <circle cx="0" cy="0" r="2" fill="none" stroke="#7bc4f0" strokeWidth="2" />
                  </g>
                  {/* Location pin 2 - teardrop shape with circle inside (center, higher point) */}
                  <g transform="translate(70, 20)">
                    <path d="M0 -4.5 A2.5 2.5 0 1 1 0 4.5 L0 6.5 Z" fill="none" stroke="#7bc4f0" strokeWidth="2.5" />
                    <circle cx="0" cy="0" r="2" fill="none" stroke="#7bc4f0" strokeWidth="2" />
                  </g>
                  {/* Location pin 3 - teardrop shape with circle inside (top-right curve) */}
                  <g transform="translate(90, 30)">
                    <path d="M0 -4.5 A2.5 2.5 0 1 1 0 4.5 L0 6.5 Z" fill="none" stroke="#7bc4f0" strokeWidth="2.5" />
                    <circle cx="0" cy="0" r="2" fill="none" stroke="#7bc4f0" strokeWidth="2" />
                  </g>
                </svg>
              </div>

              {/* Small cards - Right side */}
              <div className="flex flex-col gap-6">
                {/* Top right card - Monitor icon */}
                <div className="bg-[#1a2234]/40 backdrop-blur-sm rounded-3xl transition-all duration-300 aspect-square h-[153px] flex items-center justify-center p-6 border border-[#7bc4f0]/40 hover:border-[#7bc4f0]/70 hover:bg-[#1a2234]/60">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#7bc4f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                    {/* Monitor screen */}
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    {/* Monitor stand */}
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                    {/* Magnifying glass inside screen (top right) */}
                    <circle cx="16" cy="8" r="3.5" />
                    <line x1="19" y1="11" x2="21.5" y2="13.5" strokeWidth="2" />
                    {/* Three horizontal lines (text/data) to the left and below magnifying glass */}
                    <line x1="6" y1="11" x2="11" y2="11" strokeWidth="1.5" />
                    <line x1="6" y1="13" x2="11" y2="13" strokeWidth="1.5" />
                    <line x1="6" y1="15" x2="11" y2="15" strokeWidth="1.5" />
                  </svg>
                </div>

                {/* Bottom right card - Clock icon */}
                <div className="bg-[#1a2234]/40 backdrop-blur-sm rounded-3xl transition-all duration-300 aspect-square h-[153px] flex items-center justify-center p-6 border border-[#7bc4f0]/40 hover:border-[#7bc4f0]/70 hover:bg-[#1a2234]/60">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#7bc4f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                    {/* Clock circle */}
                    <circle cx="12" cy="12" r="9" />
                    {/* Clock hands - short hand pointing to 10, long hand pointing to 2 */}
                    <line x1="12" y1="12" x2="10.5" y2="9.5" strokeWidth="2" />
                    <line x1="12" y1="12" x2="14.5" y2="10" strokeWidth="2" />
                    {/* Checkmark at bottom right, partially overlapping clock */}
                    <path d="M16 18 L18 20 L22 16" strokeWidth="2" />
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
            <p className="text-white/80 text-base leading-relaxed">
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
