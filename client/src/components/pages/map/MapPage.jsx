import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import routeService from '../../../services/routeService';

// Arreglar iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Función para crear iconos de paradas
const crearIconoParada = (tipo, color = '#0EA5E9') => {
  const iconoSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <circle cx="8" cy="8" r="7" fill="${color}" stroke="white" stroke-width="2"/>
    <circle cx="8" cy="8" r="3" fill="white"/>
  </svg>`;

  return new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(iconoSVG),
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -8],
  });
};

// Iconos personalizados
const iconoOrigen = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const iconoDestino = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Componente de Autocomplete simplificado
function AutocompleteInput({ value, onChange, suggestions, onSelect, placeholder, label, onGetLocation }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    onChange(e.target.value);
    setShowSuggestions(true);
  };

  const handleSelectSuggestion = (item) => {
    onSelect(item);
    setShowSuggestions(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <label className="block text-sm font-medium text-slate-200 mb-2">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className="flex-1 h-11 px-4 rounded-xl border-2 border-white/20 bg-[#141a35] text-white placeholder-slate-400 focus:border-sky-400 focus:outline-none transition"
          autoComplete="off"
        />
        {onGetLocation && (
          <button
            onClick={onGetLocation}
            className="px-4 h-11 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-medium transition whitespace-nowrap"
          >
            Mi Ubicación
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div 
          className="absolute z-[9999] w-full mt-2 bg-[#0f1629] border-2 border-sky-500/50 rounded-xl shadow-2xl max-h-96 overflow-y-auto"
          style={{ position: 'absolute', top: '100%', left: 0, right: 0 }}
        >
          {value === '' && (
            <div className="px-4 py-2 bg-sky-600/20 border-b border-sky-500/30 sticky top-0 z-10">
              <div className="text-xs font-semibold text-sky-300">Paradas Populares</div>
            </div>
          )}
          {suggestions.map((item, index) => (
            <button
              key={item.id || index}
              onClick={() => handleSelectSuggestion(item)}
              onMouseDown={(e) => e.preventDefault()}
              className="w-full text-left px-4 py-3 hover:bg-sky-600/40 transition border-b border-white/5 last:border-b-0 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-semibold text-white group-hover:text-sky-300 transition">
                    {item.nombre}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {item.direccion || item.zona}
                  </div>
                </div>
                {item.tipo && (
                  <div className="ml-2 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      item.tipo === 'Terminal' ? 'bg-green-500/20 text-green-300' :
                      item.tipo === 'TransferHub' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-slate-500/20 text-slate-300'
                    }`}>
                      {item.tipo}
                    </span>
                  </div>
                )}
              </div>
              {item.total_rutas && item.total_rutas > 0 && (
                <div className="text-xs text-sky-400 mt-1">
                  {item.total_rutas} ruta{item.total_rutas > 1 ? 's' : ''}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Componente principal
export default function MapPageNew() {
  const navigate = useNavigate();
  
  const [paradas, setParadas] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [origenInput, setOrigenInput] = useState('');
  const [destinoInput, setDestinoInput] = useState('');
  const [origenSeleccionado, setOrigenSeleccionado] = useState(null);
  const [destinoSeleccionado, setDestinoSeleccionado] = useState(null);
  
  const [sugerenciasOrigen, setSugerenciasOrigen] = useState([]);
  const [sugerenciasDestino, setSugerenciasDestino] = useState([]);
  
  const [resultados, setResultados] = useState(null);
  const [rutaSeleccionada, setRutaSeleccionada] = useState(0); // Controla qué ruta mostrar en el mapa

  // Cargar paradas al iniciar
  useEffect(() => {
    cargarParadas();
  }, []);

  const cargarParadas = async () => {
    console.log('Cargando paradas...');
    setLoading(true);
    try {
      const result = await routeService.getParadas();
      if (result.success && result.data) {
        console.log('Paradas cargadas:', result.data.length);
        setParadas(result.data);
      } else {
        console.error('Error al cargar paradas:', result.message);
        alert('Error al cargar paradas: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:4000');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar sugerencias de origen
  useEffect(() => {
    if (!paradas || paradas.length === 0) {
      setSugerenciasOrigen([]);
      return;
    }

    if (origenInput === '') {
      const populares = paradas
      .filter(p => p.tipo === 'Terminal' || p.tipo === 'TransferHub')
        .sort((a, b) => (b.total_rutas || 0) - (a.total_rutas || 0))
        .slice(0, 10);
      setSugerenciasOrigen(populares);
    } else {
      const filtradas = paradas.filter(p =>
        p.nombre.toLowerCase().includes(origenInput.toLowerCase()) ||
        p.direccion?.toLowerCase().includes(origenInput.toLowerCase()) ||
        p.zona?.toLowerCase().includes(origenInput.toLowerCase())
      ).slice(0, 10);
      setSugerenciasOrigen(filtradas);
    }
  }, [origenInput, paradas]);

  // Filtrar sugerencias de destino
  useEffect(() => {
    if (!paradas || paradas.length === 0) {
      setSugerenciasDestino([]);
      return;
    }

    if (destinoInput === '') {
      const populares = paradas
        .filter(p => p.tipo === 'Terminal' || p.tipo === 'TransferHub')
        .sort((a, b) => (b.total_rutas || 0) - (a.total_rutas || 0))
        .slice(0, 10);
      setSugerenciasDestino(populares);
    } else {
      const filtradas = paradas.filter(p =>
        p.nombre.toLowerCase().includes(destinoInput.toLowerCase()) ||
        p.direccion?.toLowerCase().includes(destinoInput.toLowerCase()) ||
        p.zona?.toLowerCase().includes(destinoInput.toLowerCase())
      ).slice(0, 10);
      setSugerenciasDestino(filtradas);
    }
  }, [destinoInput, paradas]);

  const handleSeleccionarOrigen = (parada) => {
    console.log('Origen seleccionado:', parada.nombre);
    setOrigenInput(parada.nombre);
    setOrigenSeleccionado({
      id: parada.id,
      nombre: parada.nombre,
      lat: parseFloat(parada.latitud), 
      lng: parseFloat(parada.longitud)
    });
  };

  const handleSeleccionarDestino = (parada) => {
    console.log('Destino seleccionado:', parada.nombre);
    setDestinoInput(parada.nombre);
    setDestinoSeleccionado({
      id: parada.id,
      nombre: parada.nombre,
      lat: parseFloat(parada.latitud),
      lng: parseFloat(parada.longitud)
    });
  };

  const obtenerUbicacionActual = async () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización');
      return;
    }

    setLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        console.log('📍 Ubicación GPS obtenida:', { lat, lng });
        
        try {
          // NUEVO: Llamar al backend para buscar paradas cercanas
          const result = await routeService.getParadasCercanas(lat, lng, 500);
          
          if (result.success && result.data && result.data.length > 0) {
            console.log(`✅ Encontradas ${result.data.length} paradas cercanas`);
            
            // Seleccionar la parada más cercana automáticamente
            const paradaMasCercana = result.data[0];
            setOrigenInput(paradaMasCercana.nombre);
            setOrigenSeleccionado({
              id: paradaMasCercana.id,
              nombre: paradaMasCercana.nombre,
              lat: paradaMasCercana.latitud,
              lng: paradaMasCercana.longitud
            });
            
            // Mostrar sugerencias de paradas cercanas
            setSugerenciasOrigen(result.data.slice(0, 5).map(p => ({
              id: p.id,
              nombre: p.nombre,
              latitud: p.latitud,
              longitud: p.longitud,
              distancia: p.distancia
            })));
            
            alert(`Parada más cercana: ${paradaMasCercana.nombre} (${Math.round(paradaMasCercana.distancia)}m)`);
          } else {
            // Si no hay paradas cercanas, usar coordenadas GPS directas
            const ubicacion = {
              lat: lat,
              lng: lng,
              nombre: 'Mi ubicación GPS'
            };
            setOrigenInput(ubicacion.nombre);
            setOrigenSeleccionado(ubicacion);
            alert('No se encontraron paradas cercanas. Usando tu ubicación GPS directa.');
          }
        } catch (error) {
          console.error('❌ Error al buscar paradas cercanas:', error);
          // Fallback: usar coordenadas GPS directas
          const ubicacion = {
            lat: lat,
            lng: lng,
            nombre: 'Mi ubicación GPS'
          };
          setOrigenInput(ubicacion.nombre);
          setOrigenSeleccionado(ubicacion);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error('Error al obtener ubicación:', error);
        alert('No se pudo obtener tu ubicación. Por favor, permite el acceso a tu ubicación.');
        setLoading(false);
      }
    );
  };

  const buscarRutas = async () => {
    if (!origenSeleccionado || !destinoSeleccionado) {
      alert('Por favor selecciona origen y destino');
      return;
    }

    console.log('Buscando rutas...');
    setLoading(true);
    
    try {
      const result = await routeService.recomendarRuta(
        origenSeleccionado.lat,
        origenSeleccionado.lng,
        destinoSeleccionado.lat,
        destinoSeleccionado.lng,
        5000  // Radio de búsqueda en metros (5km)
      );

      if (result.success) {
        console.log('Resultados completos:', result.data);
        console.log('Recomendaciones:', result.data.recomendaciones);
        
        // Depurar estructura de cada recomendación
        if (result.data.recomendaciones && result.data.recomendaciones.length > 0) {
          console.log('Primera recomendación:', result.data.recomendaciones[0]);
          console.log('Segmentos de primera recomendación:', result.data.recomendaciones[0].segmentos);
        }
        
        setResultados(result.data);
        
        if (result.data.recomendaciones && result.data.recomendaciones.length === 0) {
          alert(result.data.mensaje + '\n\n' + (result.data.sugerencia || ''));
        }
      } else {
        const mensaje = result.error?.mensaje || result.message;
        const sugerencia = result.error?.sugerencia || '';
        alert(mensaje + (sugerencia ? '\n\nSugerencia: ' + sugerencia : ''));
        setResultados(result.error || null);
      }
    } catch (error) {
      console.error('Error al buscar rutas:', error);
      alert('Error al buscar rutas');
    } finally {
      setLoading(false);
    }
  };

  const limpiarBusqueda = () => {
    setOrigenInput('');
    setDestinoInput('');
    setOrigenSeleccionado(null);
    setDestinoSeleccionado(null);
    setResultados(null);
    setRutaSeleccionada(0);
  };

  const verRutaEnMapa = (index) => {
    setRutaSeleccionada(index);
    // Scroll suave al mapa
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_50%_100%,#1b2250_0%,#0b0f24_60%,#060816_100%)] text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Botón Volver */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-medium transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Volver
          </button>
        </div>
        
        {/* Encabezado */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold leading-tight">
            Planifica tu <span className="text-white">Viaje</span>
          </h1>
          <div className="mx-auto mt-3 h-2 w-24 rounded-full bg-[#6ab0ff]/70" />
          <p className="mt-4 text-lg text-slate-300">
            San Salvador - Sistema Inteligente de Transporte
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Panel de búsqueda */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-white/5 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.35)] p-6">
              <h2 className="mb-6 text-xl font-semibold">
                Planifica tu Viaje
              </h2>

              <div className="space-y-4">
                {/* Campo de origen */}
                <AutocompleteInput
                      value={origenInput}
                  onChange={setOrigenInput}
                  suggestions={sugerenciasOrigen}
                  onSelect={handleSeleccionarOrigen}
                  onGetLocation={obtenerUbicacionActual}
                  placeholder="Escribe para buscar..."
                  label="¿Desde dónde sales?"
                />

                {/* Campo de destino */}
                <AutocompleteInput
                    value={destinoInput}
                  onChange={setDestinoInput}
                  suggestions={sugerenciasDestino}
                  onSelect={handleSeleccionarDestino}
                  placeholder="Escribe para buscar..."
                  label="¿A dónde vas?"
                />

                {/* Botones */}
                <div className="space-y-2 border-t border-white/10 pt-4 mt-6">
                  <button
                    onClick={buscarRutas}
                    disabled={loading || !origenSeleccionado || !destinoSeleccionado}
                    className="w-full h-12 rounded-xl bg-[#6ab0ff] text-[#0b1733] font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition"
                  >
                    {loading ? 'Buscando...' : 'Buscar Rutas'}
                  </button>
                  
                  <button
                    onClick={limpiarBusqueda}
                    className="w-full h-11 rounded-xl bg-slate-600 text-white font-semibold hover:bg-slate-700 transition"
                  >
                    Limpiar Búsqueda
                  </button>
                </div>

                {/* Resultados */}
                {resultados && resultados.recomendaciones && resultados.recomendaciones.length > 0 && (
                  <div className="mt-6 space-y-4 border-t border-white/10 pt-6">
                    <h3 className="text-lg font-semibold text-green-400">
                      Rutas Encontradas ({resultados.recomendaciones.length})
                    </h3>

                    {resultados.recomendaciones.map((rec, index) => {
                      // Validar que rec y sus segmentos existen
                      if (!rec || !rec.segmentos || rec.segmentos.length === 0) {
                        return null;
                      }
                      
                      // Obtener primer segmento (para rutas directas) o todos para transbordos
                      const primerSegmento = rec.segmentos[0];
                      const ruta = primerSegmento.ruta;
                      
                      if (!ruta) {
                        return null;
                      }
                      
                      return (
                      <div 
                        key={index} 
                        className={`rounded-xl p-4 border-2 transition-all ${
                          rutaSeleccionada === index 
                            ? 'bg-gradient-to-r from-sky-600/40 to-purple-600/40 border-sky-400' 
                            : 'bg-gradient-to-r from-sky-600/20 to-purple-600/20 border-sky-500/30'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="text-lg font-bold text-white">
                              Ruta {ruta.numero_ruta || 'N/A'}
                              {rec.tipo === 'transbordo' && ` (+${rec.transbordos} transbordo${rec.transbordos > 1 ? 's' : ''})`}
                            </div>
                            <div className="text-sm text-slate-300">
                              {ruta.nombre || 'Sin nombre'}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-sky-300">
                              {rec.tiempoEstimadoMinutos || 30} min
                            </div>
                            <div className="text-xs text-slate-400">
                              ${rec.tarifaTotal || ruta.tarifa || '0.00'}
                            </div>
                          </div>
                        </div>

                        {/* Mostrar pasos detallados para transbordos */}
                        {rec.tipo === 'transbordo' && rec.segmentos.length > 1 ? (
                          <div className="space-y-3 text-sm mb-3">
                            {/* Numeración de paradas principal */}
                            <div className="bg-gradient-to-r from-sky-500/20 to-purple-500/20 rounded-lg p-3 mb-3">
                              <div className="text-xs font-semibold text-sky-300 mb-2">
                                Tu viaje en {rec.segmentos.length} buses ({rec.transbordos} transbordo{rec.transbordos > 1 ? 's' : ''}):
                              </div>
                              <div className="space-y-1">
                                {rec.segmentos.map((segmento, segIdx) => (
                                  <div key={`paradas-${segIdx}`}>
                                    {/* Parada de subida */}
                                    <div className="flex items-center gap-2 text-xs">
                                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white font-bold">
                                        {segIdx + 1}
                                      </div>
                                      <span className="text-green-300 font-medium">
                                        {segmento.paradaOrigen?.nombre}
                                      </span>
                                      <span className="text-slate-400">→ Ruta {segmento.ruta?.numero_ruta}</span>
                                    </div>
                                    
                                    {/* Parada de bajada (solo si es la última o hay transbordo) */}
                                    {(segIdx === rec.segmentos.length - 1 || segIdx < rec.segmentos.length - 1) && (
                                      <div className="flex items-center gap-2 text-xs mt-1">
                                        <div className="flex items-center justify-center w-6 h-6 rounded-full font-bold bg-red-500 text-white">
                                          {segIdx + 2}
                                        </div>
                                        <span className="font-medium text-red-300">
                                          {segmento.paradaDestino?.nombre}
                                        </span>
                                        {segIdx < rec.segmentos.length - 1 && (
                                          <span className="text-slate-400">Transbordo</span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {/* Detalles por segmento */}
                            {rec.segmentos.map((segmento, segIdx) => (
                              <div key={segIdx} className="bg-white/5 rounded-lg p-3 space-y-2">
                                {/* Paso del bus */}
                                <div className="flex items-start gap-2">
                                  <div className="flex-1">
                                    <div className="font-bold text-sky-300 text-base">
                                      Bus {segIdx + 1}: Ruta {segmento.ruta?.numero_ruta}
                                    </div>
                                    <div className="text-sm text-slate-200 mt-1">
                                      {segmento.ruta?.nombre}
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Información de subida */}
                                <div className="flex items-start gap-2 bg-green-600/20 rounded p-2 ml-8">
                                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500 text-white text-xs font-bold flex-shrink-0">
                                    {segIdx + 1}
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-medium text-green-300 text-xs">
                                      Sube en: {segmento.paradaOrigen?.nombre}
                                    </div>
                                    {segIdx === 0 && rec.distanciaCaminataOrigenMetros > 0 && (
                                      <div className="text-xs text-slate-400">
                                        {Math.round(rec.distanciaCaminataOrigenMetros)}m de tu origen
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Información de bajada */}
                                <div className="flex items-start gap-2 rounded p-2 ml-8 bg-red-600/20">
                                  <div className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold flex-shrink-0 bg-red-500 text-white">
                                    {segIdx + 2}
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-medium text-xs text-red-300">
                                      Baja en: {segmento.paradaDestino?.nombre}
                                    </div>
                                    {segIdx === rec.segmentos.length - 1 && rec.distanciaCaminataDestinoMetros > 0 && (
                                      <div className="text-xs text-slate-400">
                                        {Math.round(rec.distanciaCaminataDestinoMetros)}m de tu destino
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Info del segmento para el último bus */}
                                {segIdx === rec.segmentos.length - 1 && (
                                  <div className="flex gap-3 text-xs text-slate-400 ml-8 mt-2">
                                    <span>{segmento.tiempoEstimadoMinutos || 15} min</span>
                                    <span>${segmento.ruta?.tarifa || '0.25'}</span>
                                    {segmento.paradasIntermedias && (
                                      <span>{segmento.paradasIntermedias.length} paradas</span>
                                    )}
                                  </div>
                                )}
                                
                                {/* Indicador de transbordo */}
                                {segIdx < rec.segmentos.length - 1 && (
                                  <>
                                    <div className="mt-2 ml-8 text-yellow-400 text-xs bg-yellow-500/10 rounded p-2 border border-yellow-500/30">
                                      <div className="font-medium">Camina hasta la parada {segIdx + 2} para tomar el siguiente bus</div>
                                    </div>
                                    {/* Info del segmento - FUERA del cuadro amarillo */}
                                    <div className="flex gap-3 text-xs text-slate-400 ml-8 mt-2">
                                      <span>{segmento.tiempoEstimadoMinutos || 15} min</span>
                                      <span>${segmento.ruta?.tarifa || '0.25'}</span>
                                      {segmento.paradasIntermedias && (
                                        <span>{segmento.paradasIntermedias.length} paradas</span>
                                      )}
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                            
                            {/* Resumen total */}
                            <div className="flex gap-3 text-xs text-slate-400 bg-white/5 rounded p-2">
                              <span className="font-medium">Total:</span>
                              <span>{rec.numParadas || 0} paradas</span>
                              <span>{Math.round((rec.distanciaCaminataOrigenMetros || 0) + (rec.distanciaCaminataDestinoMetros || 0))}m caminata</span>
                            </div>
                          </div>
                        ) : (
                          /* Vista simplificada para rutas directas */
                          <div className="space-y-2 text-xs mb-3">
                            <div className="flex items-start gap-2 bg-green-600/20 rounded p-2">
                              <div className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full mt-0.5"></div>
                              <div>
                                <div className="font-medium text-green-300">
                                  Sube: {primerSegmento.paradaOrigen?.nombre || 'N/A'}
                                </div>
                                <div className="text-slate-400">
                                  {rec.distanciaCaminataOrigenMetros ? Math.round(rec.distanciaCaminataOrigenMetros) : 0}m de tu origen
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-2 bg-red-600/20 rounded p-2">
                              <div className="flex-shrink-0 w-3 h-3 bg-red-500 rounded-full mt-0.5"></div>
                              <div>
                                <div className="font-medium text-red-300">
                                  Baja: {rec.segmentos[rec.segmentos.length - 1].paradaDestino?.nombre || 'N/A'}
                                </div>
                                <div className="text-slate-400">
                                  {rec.distanciaCaminataDestinoMetros ? Math.round(rec.distanciaCaminataDestinoMetros) : 0}m de tu destino
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                                  
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                          <div className="flex gap-2">
                                {index === 0 && (
                                  <span className="inline-block bg-yellow-500/20 text-yellow-300 text-xs font-semibold px-3 py-1 rounded-full">
                                Mejor Opción
                                  </span>
                                )}
                                {rutaSeleccionada === index && (
                                  <span className="inline-block bg-green-500/20 text-green-300 text-xs font-semibold px-3 py-1 rounded-full">
                                Visible
                                  </span>
                                )}
                              </div>
                                <button
                            onClick={() => verRutaEnMapa(index)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                              rutaSeleccionada === index
                                ? 'bg-green-600 text-white'
                                : 'bg-sky-600 hover:bg-sky-700 text-white'
                            }`}
                          >
                            {rutaSeleccionada === index ? 'Viendo' : 'Ver en Mapa'}
                                </button>
                            </div>
                          </div>
                      );
                    })}
                          </div>
                        )}
                        
                {resultados && (!resultados.recomendaciones || resultados.recomendaciones.length === 0) && (
                  <div className="mt-6 bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-4">
                    <div className="text-yellow-300 font-medium text-base mb-2">
                      {resultados.mensaje || 'No se encontraron rutas'}
                                    </div>
                    {resultados.sugerencia && (
                      <div className="text-sm text-slate-300 mt-2 mb-3">
                        {resultados.sugerencia}
                      </div>
                    )}
                    {resultados.paradasSugeridas && resultados.paradasSugeridas.length > 0 && (
                      <div className="mt-3">
                        <div className="text-xs font-semibold text-slate-400 mb-2">Paradas populares:</div>
                        <div className="flex flex-wrap gap-2">
                          {resultados.paradasSugeridas.map((parada, idx) => (
                            <span key={idx} className="text-xs bg-sky-600/30 text-sky-200 px-2 py-1 rounded">
                              {parada}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mapa */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white/5 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.35)] p-6">
              <h2 className="mb-4 text-xl font-semibold">
                Mapa de San Salvador
              </h2>
              <div className="h-[700px] rounded-xl overflow-hidden border-2 border-white/10">
                <MapContainer
                  center={[13.6929, -89.2182]}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                  {origenSeleccionado && (
                          <Marker
                      position={[origenSeleccionado.lat, origenSeleccionado.lng]}
                      icon={iconoOrigen}
                          >
                            <Popup>
                        <div className="font-semibold">Origen</div>
                        <div className="text-sm">{origenSeleccionado.nombre}</div>
                              </Popup>
                            </Marker>
                  )}
                  
                  {destinoSeleccionado && (
                    <Marker 
                      position={[destinoSeleccionado.lat, destinoSeleccionado.lng]}
                      icon={iconoDestino}
                    >
                      <Popup>
                        <div className="font-semibold">Destino</div>
                        <div className="text-sm">{destinoSeleccionado.nombre}</div>
                      </Popup>
                    </Marker>
                  )}
                  
                  {/* MOSTRAR SOLO LA RUTA SELECCIONADA */}
                  {resultados && resultados.recomendaciones && resultados.recomendaciones[rutaSeleccionada] && (() => {
                    const rec = resultados.recomendaciones[rutaSeleccionada];
                    
                    // Validar que tenga segmentos
                    if (!rec.segmentos || rec.segmentos.length === 0) {
                      return null;
                    }
                    
                    // Construir el array de posiciones asegurando que incluya origen y destino
                    let positions = [];
                    let todasLasParadas = [];
                    
                    // Agregar punto de origen si existe
                    if (origenSeleccionado) {
                      positions.push([origenSeleccionado.lat, origenSeleccionado.lng]);
                    }
                    
                    // Recorrer todos los segmentos (para manejar transbordos)
                    rec.segmentos.forEach((segmento, segIdx) => {
                      // Agregar paradas intermedias del segmento
                      if (segmento.paradasIntermedias && segmento.paradasIntermedias.length > 0) {
                        const paradasPos = segmento.paradasIntermedias
                          .filter(p => p.latitud && p.longitud)
                          .map(p => [parseFloat(p.latitud), parseFloat(p.longitud)]);
                        positions = positions.concat(paradasPos);
                        todasLasParadas = todasLasParadas.concat(segmento.paradasIntermedias.map((p, idx) => ({
                          ...p,
                          segmentoIdx: segIdx,
                          paradaIdx: idx
                        })));
                      }
                    });
                    
                    // Agregar punto de destino si existe y no está ya incluido
                    if (destinoSeleccionado) {
                      const ultimaPos = positions[positions.length - 1];
                      const esDistinto = !ultimaPos || 
                        Math.abs(ultimaPos[0] - destinoSeleccionado.lat) > 0.0001 ||
                        Math.abs(ultimaPos[1] - destinoSeleccionado.lng) > 0.0001;
                      
                      if (esDistinto) {
                        positions.push([destinoSeleccionado.lat, destinoSeleccionado.lng]);
                      }
                    }
                    
                    // Solo dibujar si hay al menos 2 puntos
                    if (positions.length < 2) {
                      return null;
                    }
                    
                    return (
                      <>
                        {/* Borde blanco para contraste */}
                        <Polyline
                          positions={positions}
                          pathOptions={{ 
                            color: '#FFFFFF',
                            weight: 9,
                            opacity: 0.5,
                            lineCap: 'round',
                            lineJoin: 'round'
                          }}
                        />
                        {/* Línea principal azul brillante */}
                        <Polyline
                          positions={positions}
                          pathOptions={{ 
                            color: '#0EA5E9',
                            weight: 7,
                            opacity: 1,
                            lineCap: 'round',
                            lineJoin: 'round'
                          }}
                        />
                        
                        {/* Marcadores de paradas intermedias SOLO de la ruta seleccionada */}
                        {todasLasParadas.map((parada, idx) => {
                          // No mostrar primera y última parada (ya están como origen/destino)
                          if (idx === 0 || idx === todasLasParadas.length - 1) {
                            return null;
                          }
                          
                          return (
                            <Marker
                              key={`parada-${parada.id}-${idx}`}
                              position={[parseFloat(parada.latitud), parseFloat(parada.longitud)]}
                              icon={crearIconoParada('parada', '#0EA5E9')}
                            >
                      <Popup>
                                <div className="text-sm">
                                  <strong>{parada.nombre}</strong>
                                  <div className="text-xs text-gray-600 mt-1">
                                    Parada {idx + 1} de {todasLasParadas.length}
                                  </div>
                        </div>
                      </Popup>
                    </Marker>
                          );
                        })}
                      </>
                    );
                  })()}
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
