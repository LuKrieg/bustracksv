# 🤖 Sistema de Recomendación Inteligente de Rutas

## 🎯 Visión General

El sistema de recomendación de BusTrackSV utiliza algoritmos avanzados para sugerir automáticamente las mejores rutas de transporte basándose en:

1. **Ubicación del usuario** (GPS)
2. **Destino deseado**
3. **Proximidad a paradas**
4. **Tiempo de viaje**
5. **Número de transbordos**
6. **Costo total**

## 🧠 Cómo Funciona

### Paso 1: Detección de Ubicación

```javascript
// El sistema obtiene tu ubicación automáticamente
navigator.geolocation.getCurrentPosition((position) => {
  const { latitude, longitude } = position.coords;
  // lat: 13.6929, lng: -89.2182 (ejemplo: Centro de San Salvador)
});
```

### Paso 2: Búsqueda de Paradas Cercanas

El algoritmo busca paradas en un **radio de 500 metros** (configurable):

```javascript
GET /api/paradas-cercanas?lat=13.6929&lng=-89.2182&radio=500
```

**Resultado:**
```json
{
  "success": true,
  "paradas": [
    {
      "id": 1,
      "nombre": "Terminal Centro",
      "distancia_metros": 45,
      "zona": "Centro",
      "latitud": 13.6929,
      "longitud": -89.2182
    },
    {
      "id": 2,
      "nombre": "Catedral Metropolitana",
      "distancia_metros": 234,
      "zona": "Centro",
      "latitud": 13.6983,
      "longitud": -89.2144
    }
    // ... más paradas
  ]
}
```

### Paso 3: Búsqueda de Rutas Óptimas

El sistema busca dos tipos de rutas:

#### A) Rutas Directas (sin transbordo)
```sql
-- Encuentra rutas que conectan origen y destino directamente
SELECT DISTINCT r.*, 
       pr1.id_parada as parada_origen,
       pr2.id_parada as parada_destino,
       pr2.tiempo_estimado_minutos - pr1.tiempo_estimado_minutos as tiempo_viaje
FROM rutas r
JOIN parada_ruta pr1 ON r.id = pr1.id_ruta
JOIN parada_ruta pr2 ON r.id = pr2.id_ruta
WHERE pr1.id_parada IN (paradas_origen)
  AND pr2.id_parada IN (paradas_destino)
  AND pr1.orden < pr2.orden
ORDER BY tiempo_viaje ASC
```

#### B) Rutas con Transbordo (si no hay directas)
```javascript
// Algoritmo de búsqueda con transbordo
for each ruta1 from origen:
  for each parada_intermedia in ruta1:
    for each ruta2 that passes through parada_intermedia:
      if ruta2 reaches destino:
        calcular_tiempo_total()
        calcular_costo_total()
        agregar_a_recomendaciones()
```

### Paso 4: Cálculo de Métricas

Para cada ruta encontrada, el sistema calcula:

#### 1. Distancia de Caminata
```javascript
// Fórmula de Haversine (distancia entre dos puntos en la Tierra)
function calcularDistancia(lat1, lng1, lat2, lng2) {
  const R = 6371000; // Radio de la Tierra en metros
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distancia en metros
}

// Ejemplo:
distanciaCaminataOrigen = calcularDistancia(
  ubicacionUsuario.lat,
  ubicacionUsuario.lng,
  paradaOrigen.lat,
  paradaOrigen.lng
); // = 45 metros
```

#### 2. Tiempo Total de Viaje
```javascript
tiempoTotal = 
  (distanciaCaminataOrigen / velocidadCaminata) + // ~80 m/min
  tiempoEnBus +
  (tiempoEsperaTransbordo || 0) + // 5 min si hay transbordo
  (distanciaCaminataDestino / velocidadCaminata);

// Ejemplo:
// - Caminar al origen: 45m / 80m/min = 0.56 min
// - Viajar en bus: 25 min
// - Transbordo: 5 min
// - Caminar al destino: 120m / 80m/min = 1.5 min
// TOTAL: 32 minutos
```

#### 3. Costo Total
```javascript
costoTotal = tarifaRuta1 + (tarifaRuta2 || 0);

// Ejemplo:
// - Ruta 7-B: $0.25
// - Transbordo a Ruta 101-A: $0.30
// TOTAL: $0.55
```

#### 4. Puntuación de Calidad
```javascript
// Sistema de scoring para ordenar recomendaciones
function calcularPuntuacion(ruta) {
  let puntos = 100;
  
  // Penalizar por tiempo
  puntos -= (ruta.tiempoTotal / 60) * 10; // -10 pts por hora
  
  // Penalizar por transbordos
  puntos -= ruta.numTransbordos * 15; // -15 pts por transbordo
  
  // Penalizar por caminata larga
  const distanciaTotalCaminata = 
    ruta.distanciaCaminataOrigen + ruta.distanciaCaminataDestino;
  puntos -= (distanciaTotalCaminata / 100) * 5; // -5 pts por 100m
  
  // Bonificar rutas directas
  if (ruta.tipo === 'directa') puntos += 20;
  
  // Bonificar frecuencia alta
  if (ruta.frecuenciaMinutos <= 10) puntos += 10;
  
  return Math.max(0, puntos); // Mínimo 0 puntos
}
```

### Paso 5: Ordenamiento Inteligente

Las recomendaciones se ordenan por:

1. **Puntuación de calidad** (mayor a menor)
2. **Tipo** (directas primero)
3. **Tiempo total** (menor a mayor)
4. **Costo** (menor a mayor)

```javascript
recomendaciones.sort((a, b) => {
  // Primero por puntuación
  if (a.puntuacion !== b.puntuacion) {
    return b.puntuacion - a.puntuacion;
  }
  
  // Luego por tipo (directa > transbordo)
  if (a.tipo !== b.tipo) {
    return a.tipo === 'directa' ? -1 : 1;
  }
  
  // Finalmente por tiempo
  return a.tiempoTotal - b.tiempoTotal;
});
```

## 📊 Ejemplo Práctico

### Escenario: Viajar de Mejicanos a Santa Tecla

```javascript
// Usuario solicita ruta
POST /api/recomendar-ruta
{
  "inicioLat": 13.7402,    // Mejicanos Centro
  "inicioLng": -89.2029,
  "destinoLat": 13.6767,   // Santa Tecla Centro
  "destinoLng": -89.2794,
  "radio": 500
}
```

### Respuesta del Sistema

```json
{
  "exito": true,
  "mensaje": "Se encontraron 3 opciones",
  "origen": { "lat": 13.7402, "lng": -89.2029 },
  "destino": { "lat": 13.6767, "lng": -89.2794 },
  
  "paradasOrigen": [
    {
      "id": 16,
      "codigo": "MEJ-001",
      "nombre": "Mejicanos Centro",
      "distancia_metros": 45,
      "zona": "Mejicanos"
    },
    {
      "id": 17,
      "codigo": "PSJ-001",
      "nombre": "Parque San José",
      "distancia_metros": 278,
      "zona": "Mejicanos"
    }
  ],
  
  "paradasDestino": [
    {
      "id": 18,
      "codigo": "ST-001",
      "nombre": "Santa Tecla Centro",
      "distancia_metros": 67,
      "zona": "Santa Tecla"
    }
  ],
  
  "recomendaciones": [
    {
      "tipo": "directa",
      "transbordos": 0,
      "puntuacion": 85,
      
      "segmentos": [
        {
          "tipo": "bus",
          "ruta": {
            "id": 3,
            "numero_ruta": "7-B",
            "nombre": "Mejicanos - Santa Tecla",
            "empresa": "Autobuses AMSS",
            "tipo": "Bus",
            "tarifa": 0.25,
            "color": "#45B7D1",
            "frecuencia_minutos": 12
          },
          "paradaOrigen": {
            "id": 16,
            "nombre": "Mejicanos Centro",
            "latitud": 13.7402,
            "longitud": -89.2029
          },
          "paradaDestino": {
            "id": 18,
            "nombre": "Santa Tecla Centro",
            "latitud": 13.6767,
            "longitud": -89.2794
          },
          "paradasIntermedias": [
            { "nombre": "Mejicanos Centro", "orden": 1 },
            { "nombre": "Parque San José", "orden": 2 },
            { "nombre": "Hospital Rosales", "orden": 3 },
            { "nombre": "Terminal Centro", "orden": 4 },
            { "nombre": "Metrocentro", "orden": 5 },
            { "nombre": "Estadio Cuscatlán", "orden": 6 },
            { "nombre": "Santa Tecla Centro", "orden": 7 }
          ],
          "tiempoEstimadoMinutos": 65
        }
      ],
      
      "tiempoEstimadoMinutos": 65,
      "tiempoTotalConCaminata": 68,
      "tarifaTotal": 0.25,
      "distanciaLineaRecta": 8.2,
      "distanciaCaminataOrigenMetros": 45,
      "distanciaCaminataDestinoMetros": 67,
      "distanciaTotalCaminataMetros": 112,
      "numParadas": 7,
      
      "resumen": {
        "recomendacion": "⭐ MEJOR OPCIÓN",
        "ventajas": [
          "Ruta directa (sin transbordo)",
          "Parada más cercana (45m)",
          "Frecuencia alta (cada 12 min)",
          "Precio económico ($0.25)"
        ]
      }
    },
    
    // Opción 2: Con transbordo (si es necesario)
    {
      "tipo": "transbordo",
      "transbordos": 1,
      "puntuacion": 65,
      
      "segmentos": [
        {
          "tipo": "bus",
          "ruta": { "numero_ruta": "44", "nombre": "Apopa - Centro" },
          "paradaOrigen": { "nombre": "Mejicanos Centro" },
          "paradaDestino": { "nombre": "Terminal Centro" },
          "tiempoEstimadoMinutos": 30
        },
        {
          "tipo": "transbordo",
          "paradaTransbordo": {
            "nombre": "Terminal Centro",
            "tiempoEsperaEstimado": 5
          }
        },
        {
          "tipo": "bus",
          "ruta": { "numero_ruta": "2", "nombre": "Terminal Centro - Santa Tecla" },
          "paradaOrigen": { "nombre": "Terminal Centro" },
          "paradaDestino": { "nombre": "Santa Tecla Centro" },
          "tiempoEstimadoMinutos": 45
        }
      ],
      
      "tiempoEstimadoMinutos": 80,
      "tarifaTotal": 0.50,
      "numTransbordos": 1,
      
      "resumen": {
        "recomendacion": "Opción alternativa",
        "ventajas": [
          "Mayor frecuencia (más opciones)",
          "Paradas más céntricas"
        ],
        "desventajas": [
          "Requiere transbordo",
          "15 minutos más lento",
          "Costo mayor ($0.50)"
        ]
      }
    }
  ],
  
  "estadisticas": {
    "total_opciones": 2,
    "rutas_directas": 1,
    "rutas_con_transbordo": 1,
    "tiempo_promedio_minutos": 72,
    "tarifa_promedio": 0.37
  }
}
```

## 🎨 Visualización en la Interfaz

### Tarjeta de Ruta Recomendada

```
┌─────────────────────────────────────────────────────────────┐
│ ⭐ MEJOR OPCIÓN                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🚌 Ruta 7-B - Mejicanos - Santa Tecla                     │
│  🏢 Autobuses AMSS                                          │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 📍 Origen                                            │  │
│  │ Mejicanos Centro                                     │  │
│  │ 🚶 45 metros de distancia (1 minuto caminando)       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ↓ 🚌 65 minutos en bus                                    │
│  │ 7 paradas                                               │
│  ↓                                                          │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 🎯 Destino                                           │  │
│  │ Santa Tecla Centro                                   │  │
│  │ 🚶 67 metros de distancia (1 minuto caminando)       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ⏱️ Tiempo Total: 68 minutos                               │
│  💰 Tarifa: $0.25                                          │
│  🔄 Transbordos: 0                                         │
│                                                             │
│  ✅ Ventajas:                                              │
│  • Ruta directa (sin transbordo)                          │
│  • Parada más cercana                                     │
│  • Frecuencia alta (cada 12 min)                          │
│  • Precio económico                                       │
│                                                             │
│  [ Ver Paradas Intermedias ▼ ]                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Configuración Avanzada

### Ajustar Radio de Búsqueda

```javascript
// En el frontend
const resultado = await routeService.recomendarRuta(
  origenLat,
  origenLng,
  destinoLat,
  destinoLng,
  1000 // Radio de 1km (más paradas, más opciones)
);
```

### Filtrar por Tipo de Transporte

```javascript
// Solo buses (no microbuses)
const resultado = await routeService.recomendarRuta(
  origenLat,
  origenLng,
  destinoLat,
  destinoLng,
  500,
  { tipoTransporte: 'Bus' }
);
```

### Priorizar Rutas Directas

```javascript
// Mostrar solo rutas directas
const rutasDirectas = resultado.recomendaciones.filter(
  r => r.tipo === 'directa'
);
```

## 📱 Integración con Geolocalización

### Obtener Ubicación en Tiempo Real

```javascript
import { useState, useEffect } from 'react';

function useUbicacion() {
  const [ubicacion, setUbicacion] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUbicacion({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            precision: position.coords.accuracy
          });
        },
        (err) => {
          setError('No se pudo obtener la ubicación');
          console.error(err);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setError('Geolocalización no disponible');
    }
  }, []);
  
  return { ubicacion, error };
}

// Uso en componente
function BuscarRutasCercanas() {
  const { ubicacion, error } = useUbicacion();
  const [rutas, setRutas] = useState([]);
  
  useEffect(() => {
    if (ubicacion) {
      buscarRutasCercanas(ubicacion.lat, ubicacion.lng);
    }
  }, [ubicacion]);
  
  async function buscarRutasCercanas(lat, lng) {
    const resultado = await routeService.getRutasCercanas(lat, lng);
    setRutas(resultado.data.rutas);
  }
  
  return (
    <div>
      {error && <p>⚠️ {error}</p>}
      {ubicacion && <p>📍 Ubicación: {ubicacion.lat}, {ubicacion.lng}</p>}
      {rutas.map(ruta => (
        <RutaCard key={ruta.id} ruta={ruta} />
      ))}
    </div>
  );
}
```

## 🎯 Mejores Prácticas

### 1. Actualización Periódica
```javascript
// Actualizar ubicación cada 30 segundos
useEffect(() => {
  const interval = setInterval(() => {
    actualizarUbicacion();
  }, 30000);
  
  return () => clearInterval(interval);
}, []);
```

### 2. Caché de Resultados
```javascript
// Guardar resultados en localStorage para acceso rápido
const CACHE_KEY = 'ultima_busqueda';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

function guardarEnCache(resultado) {
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    data: resultado,
    timestamp: Date.now()
  }));
}

function obtenerDeCache() {
  const cache = localStorage.getItem(CACHE_KEY);
  if (!cache) return null;
  
  const { data, timestamp } = JSON.parse(cache);
  if (Date.now() - timestamp > CACHE_DURATION) {
    return null; // Cache expirado
  }
  
  return data;
}
```

### 3. Manejo de Errores
```javascript
async function buscarRutasConManejo(origen, destino) {
  try {
    const resultado = await routeService.recomendarRuta(
      origen.lat,
      origen.lng,
      destino.lat,
      destino.lng
    );
    
    if (!resultado.success) {
      throw new Error(resultado.mensaje);
    }
    
    if (resultado.data.recomendaciones.length === 0) {
      mostrarMensaje(
        'No se encontraron rutas',
        'Intenta aumentar el radio de búsqueda',
        'info'
      );
      return [];
    }
    
    return resultado.data.recomendaciones;
    
  } catch (error) {
    mostrarMensaje(
      'Error al buscar rutas',
      error.message,
      'error'
    );
    return [];
  }
}
```

## 🚀 Futuras Mejoras

### En Desarrollo
- [ ] **Machine Learning**: Predecir tiempos reales basados en historial
- [ ] **Tráfico en tiempo real**: Integración con Google Maps API
- [ ] **Preferencias de usuario**: Recordar rutas favoritas
- [ ] **Notificaciones**: Alertar cuando el bus está cerca
- [ ] **Modo offline**: Funcionar sin conexión

### Planeado
- [ ] **Integración con GPS de buses**: Ubicación en tiempo real
- [ ] **Compartir rutas**: Enviar recomendaciones por WhatsApp
- [ ] **Historial inteligente**: Sugerir rutas frecuentes
- [ ] **Accesibilidad**: Filtrar rutas accesibles para sillas de ruedas

---

**Última actualización**: Octubre 2024
**Versión del algoritmo**: 2.0

