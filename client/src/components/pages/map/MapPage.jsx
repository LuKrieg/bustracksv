import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import routeService from "../../../services/routeService";
import historialService from "../../../services/historialService";

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
                    <span className={`text - xs px - 2 py - 0.5 rounded ${item.tipo === 'Terminal' ? 'bg-green-500/20 text-green-300' :
                      item.tipo === 'TransferHub' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-slate-500/20 text-slate-300'
                      } `}>
                      {item.tipo}
                    </span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Componente para actualizar el centro del mapa automáticamente
function MapUpdater({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (center && center.length === 2) {
      map.setView(center, zoom || map.getZoom(), {
        animate: true,
        duration: 1
      });
    }
  }, [center, zoom, map]);

  return null;
}

// Componente para manejar clics en el mapa y establecer ubicación manualmente
function MapClickHandler({ onLocationSelect, enabled }) {
  const map = useMap();

  useEffect(() => {
    if (!enabled) return;

    const handleClick = (e) => {
      const { lat, lng } = e.latlng;
      console.log('📍 Ubicación seleccionada en mapa:', { lat, lng });
      onLocationSelect(lat, lng);
    };

    map.on('click', handleClick);

    return () => {
      map.off('click', handleClick);
    };
  }, [map, onLocationSelect, enabled]);

  return null;
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
  const [routeSegments, setRouteSegments] = useState([]);
  const [walkingSegments, setWalkingSegments] = useState([]); // Líneas punteadas para caminatas
  const [transitionPoints, setTransitionPoints] = useState([]);
  const [mapCenter, setMapCenter] = useState([13.6929, -89.2182]); // Centro del mapa (San Salvador por defecto)
  const [mapZoom, setMapZoom] = useState(13);

  // Cargar paradas al iniciar
  useEffect(() => {
    cargarParadas();
  }, []);

  // Cargar datos del historial si existen
  useEffect(() => {
    const historialData = sessionStorage.getItem('historialSearch');
    if (historialData && paradas.length > 0) {
      try {
        const data = JSON.parse(historialData);
        cargarDesdeHistorial(data);
        // Limpiar sessionStorage después de usarlo
        sessionStorage.removeItem('historialSearch');
      } catch (error) {
        console.error('Error al cargar datos del historial:', error);
      }
    }
  }, [paradas]);

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

  const cargarDesdeHistorial = async (historialData) => {
    try {
      let nuevoOrigen = null;
      let nuevoDestino = null;

      // Si hay coordenadas, usarlas directamente
      if (historialData.latOrigen && historialData.lngOrigen) {
        nuevoOrigen = {
          lat: parseFloat(historialData.latOrigen),
          lng: parseFloat(historialData.lngOrigen),
          nombre: historialData.origen || 'Ubicación guardada'
        };
        setOrigenInput(historialData.origen || 'Ubicación guardada');
        setOrigenSeleccionado(nuevoOrigen);
      } else if (historialData.origen) {
        // Buscar parada por nombre
        const paradaEncontrada = paradas.find(p =>
          p.nombre.toLowerCase().includes(historialData.origen.toLowerCase()) ||
          historialData.origen.toLowerCase().includes(p.nombre.toLowerCase())
        );
        if (paradaEncontrada) {
          nuevoOrigen = {
            id: paradaEncontrada.id,
            nombre: paradaEncontrada.nombre,
            lat: parseFloat(paradaEncontrada.latitud),
            lng: parseFloat(paradaEncontrada.longitud)
          };
          setOrigenInput(paradaEncontrada.nombre);
          setOrigenSeleccionado(nuevoOrigen);
        }
      }

      // Si hay coordenadas de destino, usarlas
      if (historialData.latDestino && historialData.lngDestino) {
        nuevoDestino = {
          lat: parseFloat(historialData.latDestino),
          lng: parseFloat(historialData.lngDestino),
          nombre: historialData.destino || 'Destino guardado'
        };
        setDestinoInput(historialData.destino || 'Destino guardado');
        setDestinoSeleccionado(nuevoDestino);
      } else if (historialData.destino) {
        // Buscar parada de destino por nombre
        const paradaDestino = paradas.find(p =>
          p.nombre.toLowerCase().includes(historialData.destino.toLowerCase()) ||
          historialData.destino.toLowerCase().includes(p.nombre.toLowerCase())
        );
        if (paradaDestino) {
          nuevoDestino = {
            id: paradaDestino.id,
            nombre: paradaDestino.nombre,
            lat: parseFloat(paradaDestino.latitud),
            lng: parseFloat(paradaDestino.longitud)
          };
          setDestinoInput(paradaDestino.nombre);
          setDestinoSeleccionado(nuevoDestino);
        }
      }

      // Si tenemos origen y destino, ejecutar búsqueda automáticamente después de un breve delay
      if (nuevoOrigen && nuevoDestino) {
        setTimeout(() => {
          // Usar las coordenadas directamente para la búsqueda
          buscarRutasConCoordenadas(nuevoOrigen, nuevoDestino);
        }, 500);
      }
    } catch (error) {
      console.error('Error al cargar desde historial:', error);
    }
  };

  const buscarRutasConCoordenadas = async (origen, destino) => {
    if (!origen || !destino) return;

    console.log('Buscando rutas desde historial...');
    setLoading(true);

    try {
      const result = await routeService.recomendarRuta(
        origen.lat,
        origen.lng,
        destino.lat,
        destino.lng,
        5000  // Radio de búsqueda en metros (5km)
      );

      if (result.success) {
        console.log('Resultados completos:', result.data);
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

  const obtenerUbicacionActual = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización');
      return;
    }

    setLoading(true);

    // Pedir permiso y obtener ubicación actual
    navigator.geolocation.getCurrentPosition(
      (position) => {
        try {
          // Obtener coordenadas exactas del GPS - asegurarse de que sean números
          const lat = Number(position.coords.latitude);
          const lng = Number(position.coords.longitude);
          const accuracy = position.coords.accuracy;

          // Validar que las coordenadas sean válidas
          if (isNaN(lat) || isNaN(lng) || lat === null || lng === null) {
            throw new Error('Coordenadas inválidas');
          }

          // Validar rango de coordenadas
          if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            throw new Error('Coordenadas fuera de rango válido');
          }

          console.log('✅ Ubicación GPS obtenida correctamente:', {
            lat: lat,
            lng: lng,
            latType: typeof lat,
            lngType: typeof lng,
            accuracy: `${Math.round(accuracy)}m`
          });

          // Crear objeto de ubicación con coordenadas exactas
          const ubicacionGPS = {
            lat: lat,  // Asegurar que sea número
            lng: lng,  // Asegurar que sea número
            nombre: 'Mi ubicación'
          };

          // Establecer la ubicación
          setOrigenInput('Mi ubicación');
          setOrigenSeleccionado(ubicacionGPS);

          // Centrar el mapa en la ubicación GPS
          setMapCenter([lat, lng]);
          setMapZoom(16);

          console.log('✅ Ubicación establecida en estado:', {
            origenSeleccionado: ubicacionGPS,
            mapCenter: [lat, lng]
          });

          setLoading(false);
        } catch (error) {
          console.error('❌ Error procesando ubicación:', error);
          alert('❌ Error al procesar tu ubicación. Intenta de nuevo.');
          setLoading(false);
        }
      },
      (error) => {
        console.error('❌ Error al obtener ubicación:', error);
        let errorMsg = '';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = '❌ Permiso denegado\n\nPor favor permite el acceso a tu ubicación en la configuración del navegador.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = '❌ Ubicación no disponible\n\nAsegúrate de tener GPS/ubicación activada en tu dispositivo.';
            break;
          case error.TIMEOUT:
            errorMsg = '❌ Tiempo agotado\n\nIntenta salir al exterior para mejorar la señal GPS.';
            break;
          default:
            errorMsg = '❌ Error al obtener ubicación';
        }

        alert(errorMsg);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,  // Forzar GPS de alta precisión
        timeout: 20000,             // 20 segundos
        maximumAge: 0              // No usar caché
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
        } else {
          // Guardar en historial si hay resultados
          try {
            const rutaGuardar = result.data.recomendaciones[0];
            const primerSegmento = rutaGuardar.segmentos[0];

            await historialService.guardarBusqueda({
              ruta: primerSegmento.ruta ? `Ruta ${primerSegmento.ruta.numero_ruta} ` : 'Viaje Multi-ruta',
              numero_ruta: primerSegmento.ruta ? primerSegmento.ruta.numero_ruta : null,
              parada: origenSeleccionado.nombre,
              parada_destino: destinoSeleccionado.nombre,
              latitud_origen: origenSeleccionado.lat,
              longitud_origen: origenSeleccionado.lng,
              latitud_destino: destinoSeleccionado.lat,
              longitud_destino: destinoSeleccionado.lng
            });
          } catch (err) {
            console.error("No se pudo guardar historial", err);
          }
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

  // Efecto para calcular la geometría de la ruta cuando cambia la selección
  useEffect(() => {
    const calcularGeometria = async () => {
      if (!resultados || !resultados.recomendaciones || !resultados.recomendaciones[rutaSeleccionada]) {
        setRouteSegments([]);
        setWalkingSegments([]);
        setTransitionPoints([]);
        return;
      }

      const rec = resultados.recomendaciones[rutaSeleccionada];

      // Validar que tenga segmentos
      if (!rec.segmentos || rec.segmentos.length === 0) {
        setRouteSegments([]);
        setWalkingSegments([]);
        setTransitionPoints([]);
        return;
      }

      const bluePalette = ['#1E88E5', '#42A5F5', '#64B5F6', '#90CAF9', '#D0E8FF'];
      const newSegments = [];
      const newWalkingSegments = [];
      const newTransitionPoints = [];

      // 1. Caminata inicial: Origen -> Primera Parada
      if (origenSeleccionado && rec.segmentos[0].paradaOrigen) {
        const primeraParada = rec.segmentos[0].paradaOrigen;

        try {
          const origenCoord = `${origenSeleccionado.lng},${origenSeleccionado.lat}`;
          const paradaCoord = `${primeraParada.longitud},${primeraParada.latitud}`;
          // Usar OSRM walking para ruta realista
          const url = `https://router.project-osrm.org/route/v1/walking/${origenCoord};${paradaCoord}?overview=full&geometries=geojson`;

          const response = await fetch(url);
          const data = await response.json();

          if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
            const geometry = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
            newWalkingSegments.push({ geometry, tipo: 'origen' });
          } else {
            // Fallback a línea recta si falla OSRM
            const caminataOrigen = [
              [origenSeleccionado.lat, origenSeleccionado.lng],
              [parseFloat(primeraParada.latitud), parseFloat(primeraParada.longitud)]
            ];
            newWalkingSegments.push({ geometry: caminataOrigen, tipo: 'origen' });
          }
        } catch (error) {
          console.error('Error calculando caminata origen:', error);
          const caminataOrigen = [
            [origenSeleccionado.lat, origenSeleccionado.lng],
            [parseFloat(primeraParada.latitud), parseFloat(primeraParada.longitud)]
          ];
          newWalkingSegments.push({ geometry: caminataOrigen, tipo: 'origen' });
        }
      }

      // 2. Procesar segmentos de bus
      for (let i = 0; i < rec.segmentos.length; i++) {
        const segmento = rec.segmentos[i];
        const color = bluePalette[i % bluePalette.length];

        // Geometría del segmento
        let waypoints = [];

        if (segmento.paradaOrigen) {
          waypoints.push([parseFloat(segmento.paradaOrigen.latitud), parseFloat(segmento.paradaOrigen.longitud)]);
        }

        if (segmento.paradasIntermedias && segmento.paradasIntermedias.length > 0) {
          const paradasPos = segmento.paradasIntermedias
            .filter(p => p.latitud && p.longitud)
            .map(p => [parseFloat(p.latitud), parseFloat(p.longitud)]);
          waypoints = waypoints.concat(paradasPos);
        }

        if (segmento.paradaDestino) {
          waypoints.push([parseFloat(segmento.paradaDestino.latitud), parseFloat(segmento.paradaDestino.longitud)]);
        }

        // Obtener geometría OSRM driving para el bus
        if (waypoints.length >= 2) {
          try {
            let puntosParaOSRM = waypoints;
            // Simplificar si hay demasiados puntos para la URL
            if (waypoints.length > 25) {
              puntosParaOSRM = waypoints.filter((_, idx) => idx % Math.ceil(waypoints.length / 25) === 0);
              // Asegurar inicio y fin
              if (puntosParaOSRM[0] !== waypoints[0]) puntosParaOSRM.unshift(waypoints[0]);
              if (puntosParaOSRM[puntosParaOSRM.length - 1] !== waypoints[waypoints.length - 1]) puntosParaOSRM.push(waypoints[waypoints.length - 1]);
            }

            const coordinates = puntosParaOSRM.map(p => `${p[1]},${p[0]}`).join(';');
            const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
              const geometry = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
              newSegments.push({ geometry, color });
            } else {
              newSegments.push({ geometry: waypoints, color });
            }
          } catch (error) {
            console.error('Error fetching OSRM for segment:', error);
            newSegments.push({ geometry: waypoints, color });
          }
        }
      }

      // 3. Caminata final: Última Parada -> Destino
      const ultimoSegmento = rec.segmentos[rec.segmentos.length - 1];
      if (destinoSeleccionado && ultimoSegmento.paradaDestino) {
        const ultimaParada = ultimoSegmento.paradaDestino;

        try {
          const paradaCoord = `${ultimaParada.longitud},${ultimaParada.latitud}`;
          const destinoCoord = `${destinoSeleccionado.lng},${destinoSeleccionado.lat}`;
          // Usar OSRM walking
          const url = `https://router.project-osrm.org/route/v1/walking/${paradaCoord};${destinoCoord}?overview=full&geometries=geojson`;

          const response = await fetch(url);
          const data = await response.json();

          if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
            const geometry = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
            newWalkingSegments.push({ geometry, tipo: 'destino' });
          } else {
            // Fallback
            const caminataDestino = [
              [parseFloat(ultimaParada.latitud), parseFloat(ultimaParada.longitud)],
              [destinoSeleccionado.lat, destinoSeleccionado.lng]
            ];
            newWalkingSegments.push({ geometry: caminataDestino, tipo: 'destino' });
          }
        } catch (error) {
          console.error('Error calculando caminata destino:', error);
          const caminataDestino = [
            [parseFloat(ultimaParada.latitud), parseFloat(ultimaParada.longitud)],
            [destinoSeleccionado.lat, destinoSeleccionado.lng]
          ];
          newWalkingSegments.push({ geometry: caminataDestino, tipo: 'destino' });
        }
      }

      // 4. Procesar Puntos de Transición de forma coherente
      const processedPoints = [];

      rec.segmentos.forEach((seg, idx) => {
        // --- PROCESAR ORIGEN DEL SEGMENTO ---
        if (seg.paradaOrigen) {
          let isTransferSameStop = false;

          // Verificar si este origen es el mismo que el destino del segmento anterior
          if (idx > 0) {
            const prevSeg = rec.segmentos[idx - 1];
            if (prevSeg && prevSeg.paradaDestino) {
              // Comparar por ID o coordenadas
              const sameId = prevSeg.paradaDestino.id && seg.paradaOrigen.id && prevSeg.paradaDestino.id === seg.paradaOrigen.id;
              const sameCoords = parseFloat(prevSeg.paradaDestino.latitud) === parseFloat(seg.paradaOrigen.latitud) &&
                parseFloat(prevSeg.paradaDestino.longitud) === parseFloat(seg.paradaOrigen.longitud);

              if (sameId || sameCoords) {
                isTransferSameStop = true;
              }
            }
          }

          if (isTransferSameStop) {
            // Es un transbordo en la misma parada.
            // Actualizar el último punto agregado (que era la 'bajada' del anterior)
            const lastPoint = processedPoints[processedPoints.length - 1];
            if (lastPoint) {
              lastPoint.tipo = 'transbordo';
              lastPoint.descripcion = `Transbordo: Baja de Ruta ${rec.segmentos[idx - 1].ruta?.numero_ruta}, Sube a Ruta ${seg.ruta?.numero_ruta}`;
              lastPoint.color = '#F59E0B'; // Amarillo/Naranja
            }
          } else {
            // Es una subida nueva (inicio del viaje o después de caminar)
            processedPoints.push({
              ...seg.paradaOrigen,
              tipo: 'subida',
              descripcion: `Sube a Ruta ${seg.ruta?.numero_ruta}`,
              color: '#10B981', // Verde Esmeralda
              segmentoIdx: idx
            });
          }
        }

        // --- PROCESAR DESTINO DEL SEGMENTO ---
        if (seg.paradaDestino) {
          // Agregamos el destino como 'bajada'. 
          // Si en la siguiente iteración resulta ser un transbordo, se actualizará este punto.
          processedPoints.push({
            ...seg.paradaDestino,
            tipo: 'bajada',
            descripcion: `Baja de Ruta ${seg.ruta?.numero_ruta}`,
            color: '#EF4444', // Rojo
            segmentoIdx: idx
          });
        }
      });

      newTransitionPoints.push(...processedPoints);

      setRouteSegments(newSegments);
      setWalkingSegments(newWalkingSegments);
      setTransitionPoints(newTransitionPoints);
    };

    calcularGeometria();
  }, [resultados, rutaSeleccionada, origenSeleccionado, destinoSeleccionado]);

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
                      className={`rounded-xl p-4 border-2 transition-all ${rutaSeleccionada === index
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
                          className={`px-4 py-2 rounded-lg text-xs font-bold transition ${rutaSeleccionada === index
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

              {/* Componente para actualizar el centro del mapa */}
              <MapUpdater center={mapCenter} zoom={mapZoom} />

              {origenSeleccionado && origenSeleccionado.lat && origenSeleccionado.lng && (
                <Marker
                  position={[Number(origenSeleccionado.lat), Number(origenSeleccionado.lng)]}
                  icon={iconoOrigen}
                >
                  <Popup>
                    <div className="font-semibold">Origen</div>
                    <div className="text-sm">{origenSeleccionado.nombre}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Lat: {origenSeleccionado.lat}<br />
                      Lng: {origenSeleccionado.lng}
                    </div>
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

              {/* MOSTRAR LÍNEAS DE CAMINATA (PUNTEADAS) */}
              {walkingSegments.map((segment, idx) => (
                <React.Fragment key={`walking-${idx}`}>
                  {/* Borde blanco para contraste */}
                  <Polyline
                    positions={segment.geometry}
                    pathOptions={{
                      color: '#FFFFFF',
                      weight: 10,
                      opacity: 0.6,
                      dashArray: '15, 8',
                      lineCap: 'round',
                      lineJoin: 'round'
                    }}
                  />
                  {/* Línea punteada principal en celeste para caminata */}
                  <Polyline
                    positions={segment.geometry}
                    pathOptions={{
                      color: '#7bc4f0',
                      weight: 8,
                      opacity: 1,
                      dashArray: '15, 8',
                      lineCap: 'round',
                      lineJoin: 'round'
                    }}
                  />
                </React.Fragment>
              ))}

              {/* MOSTRAR SEGMENTOS DE RUTA CON COLORES DIFERENCIADOS */}
              {routeSegments.map((segment, idx) => (
                <React.Fragment key={`segment-${idx}`}>
                  {/* Borde blanco para contraste */}
                  <Polyline
                    positions={segment.geometry}
                    pathOptions={{
                      color: '#FFFFFF',
                      weight: 9,
                      opacity: 0.5,
                      lineCap: 'round',
                      lineJoin: 'round'
                    }}
                  />
                  {/* Línea principal con color específico */}
                  <Polyline
                    positions={segment.geometry}
                    pathOptions={{
                      color: segment.color,
                      weight: 7,
                      opacity: 1,
                      lineCap: 'round',
                      lineJoin: 'round'
                    }}
                  />
                </React.Fragment>
              ))}

              {/* PUNTOS DE TRANSICIÓN (Donde sube y baja) */}
              {transitionPoints && transitionPoints.map((punto, idx) => (
                <Marker
                  key={`transicion-${idx}`}
                  position={[parseFloat(punto.latitud), parseFloat(punto.longitud)]}
                  icon={crearIconoParada(punto.tipo, punto.color || '#0EA5E9')}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong className="block mb-1">{punto.nombre}</strong>
                      <div className="text-xs text-slate-600 font-medium">
                        {punto.descripcion || (punto.tipo === 'subida' ? 'Subida' : 'Bajada')}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
}
