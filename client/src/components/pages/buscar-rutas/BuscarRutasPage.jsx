import { useState, useEffect } from 'react';
import routeService from '../../../services/routeService';
import Header from '../../layout/Header';

export default function BuscarRutasPage() {
  const [paradas, setParadas] = useState([]);
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [paradaOrigenSeleccionada, setParadaOrigenSeleccionada] = useState(null);
  const [paradaDestinoSeleccionada, setParadaDestinoSeleccionada] = useState(null);
  const [sugerenciasOrigen, setSugerenciasOrigen] = useState([]);
  const [sugerenciasDestino, setSugerenciasDestino] = useState([]);
  const [mostrarOrigen, setMostrarOrigen] = useState(false);
  const [mostrarDestino, setMostrarDestino] = useState(false);
  const [resultados, setResultados] = useState(null);
  const [buscando, setBuscando] = useState(false);

  useEffect(() => {
    cargarParadas();
  }, []);

  const cargarParadas = async () => {
    console.log('🔍 Cargando paradas desde el servidor...');
    const result = await routeService.getParadas();
    console.log('📊 Resultado:', result);
    if (result.success) {
      setParadas(result.data);
      console.log(`✅ ${result.data.length} paradas cargadas!`);
    } else {
      console.error('❌ Error al cargar paradas:', result);
      alert('⚠️ No se pudieron cargar las paradas. ¿Está el servidor corriendo?');
    }
  };

  const handleOrigenChange = (e) => {
    const value = e.target.value;
    setOrigen(value);
    
    console.log(`📝 Escribiendo origen: "${value}"`);
    console.log(`📦 Total paradas disponibles: ${paradas.length}`);
    
    // Mostrar automáticamente mientras escribe
    if (value.length === 0) {
      // Si está vacío, mostrar las primeras 20
      const primeras = paradas.slice(0, 20);
      setSugerenciasOrigen(primeras);
      setMostrarOrigen(true);
      console.log(`✅ Mostrando ${primeras.length} paradas iniciales`);
    } else {
      // Filtrar mientras escribe
      const filtradas = paradas.filter(p =>
        p.nombre.toLowerCase().includes(value.toLowerCase()) ||
        (p.zona && p.zona.toLowerCase().includes(value.toLowerCase())) ||
        (p.direccion && p.direccion.toLowerCase().includes(value.toLowerCase())) ||
        (p.codigo && p.codigo.toLowerCase().includes(value.toLowerCase()))
      );
      
      console.log(`🔍 Encontradas ${filtradas.length} paradas que coinciden`);
      
      // Ordenar: primero las que empiezan con lo que escribió
      const ordenadas = filtradas.sort((a, b) => {
        const aStartsWith = a.nombre.toLowerCase().startsWith(value.toLowerCase());
        const bStartsWith = b.nombre.toLowerCase().startsWith(value.toLowerCase());
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        return 0;
      });
      
      setSugerenciasOrigen(ordenadas.slice(0, 20));
      setMostrarOrigen(ordenadas.length > 0);
      console.log(`✅ Mostrando ${Math.min(ordenadas.length, 20)} sugerencias`);
    }
  };

  const handleDestinoChange = (e) => {
    const value = e.target.value;
    setDestino(value);
    
    // Mostrar automáticamente mientras escribe
    if (value.length === 0) {
      // Si está vacío, mostrar las primeras 20
      setSugerenciasDestino(paradas.slice(0, 20));
      setMostrarDestino(true);
    } else {
      // Filtrar mientras escribe
      const filtradas = paradas.filter(p =>
        p.nombre.toLowerCase().includes(value.toLowerCase()) ||
        (p.zona && p.zona.toLowerCase().includes(value.toLowerCase())) ||
        (p.direccion && p.direccion.toLowerCase().includes(value.toLowerCase())) ||
        (p.codigo && p.codigo.toLowerCase().includes(value.toLowerCase()))
      );
      
      // Ordenar: primero las que empiezan con lo que escribió
      const ordenadas = filtradas.sort((a, b) => {
        const aStartsWith = a.nombre.toLowerCase().startsWith(value.toLowerCase());
        const bStartsWith = b.nombre.toLowerCase().startsWith(value.toLowerCase());
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        return 0;
      });
      
      setSugerenciasDestino(ordenadas.slice(0, 20));
      setMostrarDestino(ordenadas.length > 0);
    }
  };

  const seleccionarOrigen = (parada) => {
    setOrigen(parada.nombre);
    setParadaOrigenSeleccionada(parada);
    setMostrarOrigen(false);
  };

  const seleccionarDestino = (parada) => {
    setDestino(parada.nombre);
    setParadaDestinoSeleccionada(parada);
    setMostrarDestino(false);
  };

  const buscarRutas = async () => {
    if (!paradaOrigenSeleccionada || !paradaDestinoSeleccionada) {
      alert('Por favor selecciona origen y destino de las sugerencias');
      return;
    }

    setBuscando(true);
    setResultados(null);

    try {
      const response = await fetch('http://localhost:4000/api/buscar-rutas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paradaOrigenId: paradaOrigenSeleccionada.id,
          paradaDestinoId: paradaDestinoSeleccionada.id
        })
      });

      const data = await response.json();
      setResultados(data);
    } catch (error) {
      console.error('Error al buscar rutas:', error);
      alert('Error al buscar rutas');
    } finally {
      setBuscando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              🚌 Buscar Rutas de Buses
            </h1>
            <p className="text-slate-300">
              Encuentra la mejor ruta entre dos puntos
            </p>
          </div>

          {/* Formulario de búsqueda */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Origen */}
              <div className="relative">
                <label className="block text-white font-semibold mb-2">
                  📍 Origen {sugerenciasOrigen.length > 0 && mostrarOrigen && (
                    <span className="text-sm text-blue-300">({sugerenciasOrigen.length} opciones)</span>
                  )}
                </label>
                <input
                  type="text"
                  value={origen}
                  onChange={handleOrigenChange}
                  onFocus={() => {
                    if (paradas.length > 0) {
                      if (origen === '') {
                        setSugerenciasOrigen(paradas.slice(0, 20));
                      }
                      setMostrarOrigen(true);
                    }
                  }}
                  placeholder="Escribe cualquier cosa... (ej: metro, hospital, san)"
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                
                {mostrarOrigen && sugerenciasOrigen.length > 0 && (
                  <div className="absolute z-50 w-full mt-2 bg-slate-800 rounded-lg shadow-xl border border-blue-500 max-h-96 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                    {sugerenciasOrigen.map((parada, index) => (
                      <button
                        key={parada.id}
                        onClick={() => seleccionarOrigen(parada)}
                        className="w-full text-left px-4 py-3 hover:bg-blue-600 hover:text-white border-b border-slate-700 transition-all hover:scale-[1.01]"
                        style={{ animationDelay: `${index * 20}ms` }}
                      >
                        <div className="font-semibold text-white flex items-center gap-2">
                          <span className="text-blue-400">📍</span>
                          {parada.nombre}
                        </div>
                        {parada.zona && (
                          <div className="text-sm text-slate-300 ml-6">{parada.zona}</div>
                        )}
                        {parada.direccion && (
                          <div className="text-xs text-slate-400 ml-6 mt-1">{parada.direccion}</div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Destino */}
              <div className="relative">
                <label className="block text-white font-semibold mb-2">
                  🎯 Destino {sugerenciasDestino.length > 0 && mostrarDestino && (
                    <span className="text-sm text-blue-300">({sugerenciasDestino.length} opciones)</span>
                  )}
                </label>
                <input
                  type="text"
                  value={destino}
                  onChange={handleDestinoChange}
                  onFocus={() => {
                    if (paradas.length > 0) {
                      if (destino === '') {
                        setSugerenciasDestino(paradas.slice(0, 20));
                      }
                      setMostrarDestino(true);
                    }
                  }}
                  placeholder="Escribe cualquier cosa... (ej: centro, plaza, universidad)"
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                
                {mostrarDestino && sugerenciasDestino.length > 0 && (
                  <div className="absolute z-50 w-full mt-2 bg-slate-800 rounded-lg shadow-xl border border-blue-500 max-h-96 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                    {sugerenciasDestino.map((parada, index) => (
                      <button
                        key={parada.id}
                        onClick={() => seleccionarDestino(parada)}
                        className="w-full text-left px-4 py-3 hover:bg-blue-600 hover:text-white border-b border-slate-700 transition-all hover:scale-[1.01]"
                        style={{ animationDelay: `${index * 20}ms` }}
                      >
                        <div className="font-semibold text-white flex items-center gap-2">
                          <span className="text-green-400">🎯</span>
                          {parada.nombre}
                        </div>
                        {parada.zona && (
                          <div className="text-sm text-slate-300 ml-6">{parada.zona}</div>
                        )}
                        {parada.direccion && (
                          <div className="text-xs text-slate-400 ml-6 mt-1">{parada.direccion}</div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Botón de búsqueda */}
            <button
              onClick={buscarRutas}
              disabled={!paradaOrigenSeleccionada || !paradaDestinoSeleccionada || buscando}
              className="w-full mt-6 py-3 px-6 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition"
            >
              {buscando ? '🔍 Buscando...' : '🔍 Buscar Rutas'}
            </button>
          </div>

          {/* Resultados */}
          {resultados && (
            <div className="space-y-6">
              {/* Info general */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-4">📊 Información del Viaje</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-slate-400 text-sm mb-1">Origen</div>
                    <div className="text-white font-semibold">{resultados.origen.nombre}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-slate-400 text-sm mb-1">Destino</div>
                    <div className="text-white font-semibold">{resultados.destino.nombre}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-slate-400 text-sm mb-1">Distancia en línea recta</div>
                    <div className="text-white font-semibold">{resultados.distanciaLineaRecta} km</div>
                  </div>
                </div>
              </div>

              {/* Rutas disponibles */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-4">
                  🚌 Rutas Disponibles ({resultados.totalRutas})
                </h2>

                {resultados.totalRutas === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">😔</div>
                    <div className="text-white text-lg font-semibold mb-2">
                      No hay rutas directas disponibles
                    </div>
                    <div className="text-slate-400">
                      Intenta con otras paradas cercanas
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {resultados.rutasDisponibles.map((rutaInfo, index) => (
                      <div
                        key={index}
                        className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-blue-400 transition"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="bg-blue-500 text-white px-4 py-1 rounded-full font-bold text-lg">
                                {rutaInfo.ruta.numero_ruta}
                              </span>
                              <span className="text-white font-semibold text-lg">
                                {rutaInfo.ruta.nombre}
                              </span>
                            </div>
                            <div className="text-slate-400 text-sm">
                              {rutaInfo.ruta.empresa} · {rutaInfo.ruta.tipo}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-green-400 font-bold text-xl">
                              ${rutaInfo.ruta.tarifa.toFixed(2)}
                            </div>
                            <div className="text-slate-400 text-sm">Tarifa</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="bg-white/5 rounded-lg p-3">
                            <div className="text-slate-400 text-xs mb-1">⏱️ Tiempo estimado</div>
                            <div className="text-white font-semibold">
                              {rutaInfo.tiempoEstimadoMinutos} minutos
                            </div>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3">
                            <div className="text-slate-400 text-xs mb-1">🚏 Paradas</div>
                            <div className="text-white font-semibold">
                              {rutaInfo.numeroParadas} paradas
                            </div>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3">
                            <div className="text-slate-400 text-xs mb-1">📍 Tipo</div>
                            <div className="text-white font-semibold">Ruta Directa</div>
                          </div>
                        </div>

                        {/* Paradas intermedias */}
                        <details className="mt-4">
                          <summary className="cursor-pointer text-blue-400 hover:text-blue-300 font-semibold">
                            Ver {rutaInfo.numeroParadas} paradas intermedias
                          </summary>
                          <div className="mt-3 space-y-2">
                            {rutaInfo.paradasIntermedias.map((parada, idx) => (
                              <div
                                key={parada.id}
                                className="flex items-center gap-3 text-white/80 text-sm pl-4"
                              >
                                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                <span>{idx + 1}. {parada.nombre}</span>
                              </div>
                            ))}
                          </div>
                        </details>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



