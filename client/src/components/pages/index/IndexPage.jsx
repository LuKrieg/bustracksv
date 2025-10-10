import { Link } from 'react-router-dom';
import Header from '../../layout/Header';

const IndexPage = () => {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />
      <main className="w-full px-8 py-12">
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
        <div className="grid grid-cols-12 gap-20">
          {/* Bottom Left Column - Decorative Squares (Wider) */}
          <div className="col-span-7 flex items-center justify-center">
            <div className="grid grid-cols-3 gap-4 w-full">
              {/* Large square - Left side (80% of column) */}
              <div className="col-span-2 bg-gray-800 rounded-xl opacity-60 hover:opacity-80 transition-opacity duration-300 aspect-[4/3] h-[330px] w-full"></div>
              
              {/* Small squares - Right side */}
              <div className="flex flex-col gap-2">
                {/* Top right square */}
                <div className="bg-gray-800 rounded-xl opacity-60 hover:opacity-80 transition-opacity duration-300 aspect-square h-[160px]"></div>
                
                {/* Bottom right square */}
                <div className="bg-gray-800 rounded-xl opacity-60 hover:opacity-80 transition-opacity duration-300 aspect-square h-[160px]"></div>
              </div>
            </div>
          </div>
          
          {/* Bottom Right Column - Text Content */}
          <div className="col-span-5 flex flex-col justify-center">
            {/* 1. Title Paragraph */}
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6 leading-tight">
              Monitorea, viaja, llega a tiempo.
            </h2>
            
            {/* 2. Second Paragraph */}
            <p className="text-text-secondary text-lg leading-relaxed">
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
