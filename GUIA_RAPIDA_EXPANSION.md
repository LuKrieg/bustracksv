# 🚀 Guía Rápida: Expansión de Base de Datos BusTrackSV

## 📋 Resumen Ejecutivo

Esta guía te ayudará a expandir tu base de datos de **27 rutas a 80+ rutas** y de **35 paradas a 150+ paradas** en menos de 5 minutos.

---

## ⚡ Instalación Rápida (5 minutos)

### Paso 1: Ejecutar el Script de Importación

```powershell
# Opción 1: PowerShell (Windows)
cd server
node import-expanded-data.js
```

```bash
# Opción 2: Terminal Unix/Mac
cd server
node import-expanded-data.js
```

### Paso 2: Verificar la Importación

Deberías ver algo como esto:

```
🚌 BusTrackSV - Importador de Datos EXPANDIDO
📍 Fuentes: VMT + bus.sv + Datos Oficiales

🗑️  Limpiando datos existentes...
✅ Datos anteriores eliminados

📍 Insertando paradas expandidas...
  ✅ TC-001 - Terminal Centro (Centro)
  ✅ CAT-001 - Catedral Metropolitana (Centro)
  ... (150+ paradas)

🚌 Insertando rutas expandidas...
  ✅ Ruta 1 - Terminal Centro - Soyapango
  ✅ Ruta 2 - Terminal Centro - Santa Tecla
  ... (80+ rutas)

🔗 Relacionando rutas con paradas...
  ✅ Ruta 1 conectada con 8 paradas
  ... (más relaciones)

═══════════════════════════════════════════════════════════
✅ IMPORTACIÓN EXPANDIDA COMPLETADA EXITOSAMENTE
═══════════════════════════════════════════════════════════
📊 Resumen EXPANDIDO:
   🚌 Rutas: 82
   📍 Paradas: 156
   🔗 Conexiones: 124
```

### Paso 3: Reiniciar el Servidor

```powershell
# Si el servidor está corriendo, reinícialo
cd server
npm start
```

### Paso 4: Probar en la Aplicación

1. **Abre el navegador**: `http://localhost:5173`
2. **Ve a "Buscar Rutas"**
3. **Selecciona origen y destino**
4. **¡Disfruta de 80+ rutas disponibles!**

---

## 🎯 Características Nuevas Disponibles

### 1. Recomendación Inteligente de Rutas

El sistema ahora puede:

#### a) Encontrar Rutas Directas
```javascript
// Ejemplo: De Mejicanos a Metrocentro
Origen: Mejicanos Centro
Destino: Metrocentro
Resultado: Ruta 7-B (directa, 40 minutos, $0.25)
```

#### b) Encontrar Rutas con Transbordo
```javascript
// Ejemplo: De Apopa a Santa Tecla
Origen: Apopa Centro
Destino: Santa Tecla Centro
Resultado:
  - Ruta 44: Apopa → Mejicanos (25 min)
  - Transbordo en Mejicanos (5 min)
  - Ruta 7-B: Mejicanos → Santa Tecla (40 min)
  Total: 70 minutos, $0.50
```

#### c) Buscar Paradas Cercanas
```javascript
// El sistema automáticamente encuentra paradas cerca de ti
// Radio de búsqueda: 500 metros (configurable)
GET /api/paradas-cercanas?lat=13.6929&lng=-89.2182&radio=500

Respuesta:
[
  {
    nombre: "Terminal Centro",
    distancia_metros: 45,
    zona: "Centro"
  },
  {
    nombre: "Catedral Metropolitana",
    distancia_metros: 234,
    zona: "Centro"
  }
]
```

### 2. Cobertura Completa del AMSS

Ahora con cobertura en:
- ✅ **San Salvador** (Centro, zonas comerciales, hospitales)
- ✅ **Mejicanos** (7 colonias)
- ✅ **Soyapango** (8 zonas)
- ✅ **Ciudad Delgado** (4 colonias)
- ✅ **Cuscatancingo** (7 colonias)
- ✅ **Santa Tecla** (completo)
- ✅ **Antiguo Cuscatlán** (completo)
- ✅ **Apopa**
- ✅ **Ilopango**
- ✅ **Tonacatepeque**
- ✅ **Nejapa**
- ✅ **San Martín**
- ✅ **Aguilares**

---

## 🔍 Testing Rápido

### Prueba 1: Ver Todas las Rutas

```bash
# Terminal
curl http://localhost:4000/api/rutas
```

**Resultado esperado**: JSON con 80+ rutas

### Prueba 2: Ver Todas las Paradas

```bash
curl http://localhost:4000/api/paradas
```

**Resultado esperado**: JSON con 150+ paradas

### Prueba 3: Buscar Paradas Cercanas al Centro

```bash
curl "http://localhost:4000/api/paradas-cercanas?lat=13.6929&lng=-89.2182&radio=500"
```

**Resultado esperado**: Paradas cercanas a Terminal Centro

### Prueba 4: Recomendar Ruta

```bash
curl -X POST http://localhost:4000/api/recomendar-ruta \
  -H "Content-Type: application/json" \
  -d '{
    "inicioLat": 13.6929,
    "inicioLng": -89.2182,
    "destinoLat": 13.7108,
    "destinoLng": -89.1394
  }'
```

**Resultado esperado**: Recomendaciones de rutas del Centro a Soyapango

---

## 📊 Comparación de Resultados

### Antes de la Expansión
```
Búsqueda: Mejicanos → Santa Tecla
Resultado: "No hay rutas directas disponibles"
```

### Después de la Expansión
```
Búsqueda: Mejicanos → Santa Tecla
Resultado:
  ✅ Ruta 7-B (directa)
  ✅ Tiempo: 65 minutos
  ✅ Tarifa: $0.25
  ✅ Paradas: 7
```

---

## 🎨 Cómo Usar las Nuevas Funciones en el Frontend

### Ejemplo: Buscar por Ubicación Actual

```javascript
// En tu componente React
import { useState, useEffect } from 'react';
import routeService from '../services/routeService';

function BuscarPorUbicacion() {
  const [paradasCercanas, setParadasCercanas] = useState([]);
  
  useEffect(() => {
    // Obtener ubicación del usuario
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      
      // Buscar paradas cercanas
      const result = await routeService.getParadasCercanas(
        latitude, 
        longitude, 
        500, // radio en metros
        10   // límite de resultados
      );
      
      if (result.success) {
        setParadasCercanas(result.data.paradas);
      }
    });
  }, []);
  
  return (
    <div>
      <h2>Paradas Cercanas a Ti</h2>
      {paradasCercanas.map(parada => (
        <div key={parada.id}>
          <h3>{parada.nombre}</h3>
          <p>A {parada.distancia_metros}m de distancia</p>
          <p>Zona: {parada.zona}</p>
        </div>
      ))}
    </div>
  );
}
```

### Ejemplo: Recomendar Ruta Inteligente

```javascript
// Buscar la mejor ruta entre dos puntos
async function buscarMejorRuta(origenLat, origenLng, destinoLat, destinoLng) {
  const result = await routeService.recomendarRuta(
    origenLat,
    origenLng,
    destinoLat,
    destinoLng,
    500 // radio de búsqueda
  );
  
  if (result.success) {
    const { recomendaciones, estadisticas } = result.data;
    
    console.log(`Encontradas ${estadisticas.total_opciones} opciones`);
    console.log(`Rutas directas: ${estadisticas.rutas_directas}`);
    console.log(`Rutas con transbordo: ${estadisticas.rutas_con_transbordo}`);
    
    // Mejor opción (primera en el array)
    const mejorRuta = recomendaciones[0];
    console.log(`Mejor opción: ${mejorRuta.tiempoEstimadoMinutos} minutos`);
    console.log(`Tarifa: $${mejorRuta.tarifaTotal}`);
    console.log(`Transbordos: ${mejorRuta.transbordos}`);
    
    return recomendaciones;
  }
  
  return [];
}
```

---

## 🐛 Solución de Problemas

### Error: "Cannot find module"

```bash
# Asegúrate de estar en la carpeta correcta
cd server
npm install
node import-expanded-data.js
```

### Error: "Connection refused"

```bash
# Verifica que PostgreSQL esté corriendo
# Windows PowerShell:
Get-Service -Name postgresql*

# Mac/Linux:
sudo systemctl status postgresql
```

### Error: "Table does not exist"

```bash
# Ejecuta primero el script de inicialización
cd server
psql -U tu_usuario -d bustracksv -f database/init.sql
node import-expanded-data.js
```

### Las rutas no aparecen en la app

```bash
# 1. Verifica que el servidor esté corriendo
cd server
npm start

# 2. Verifica en el navegador
# http://localhost:4000/api/rutas
# Deberías ver 80+ rutas

# 3. Reinicia el frontend
cd client
npm run dev
```

---

## 📈 Métricas de Éxito

Después de la expansión, deberías ver:

### En la Base de Datos
- ✅ **80+ rutas** activas
- ✅ **150+ paradas** georeferenciadas
- ✅ **100+ relaciones** ruta-parada

### En la API
```bash
# GET /api/rutas
Status: 200 OK
Count: 82 rutas

# GET /api/paradas
Status: 200 OK
Count: 156 paradas
```

### En la Aplicación
- ✅ Búsqueda de rutas más precisa
- ✅ Más opciones de transporte
- ✅ Recomendaciones inteligentes
- ✅ Cobertura completa del AMSS

---

## 🎯 Próximos Pasos

### 1. Personalización
Edita `import-expanded-data.js` para:
- Agregar más rutas locales
- Actualizar horarios
- Añadir paradas específicas de tu zona

### 2. Optimización
- Configura índices en la base de datos
- Implementa caché para consultas frecuentes
- Optimiza el algoritmo de recomendación

### 3. Expansión
- Agrega rutas interdepartamentales
- Integra datos de tráfico en tiempo real
- Implementa tracking GPS de buses

---

## 📞 Soporte

¿Necesitas ayuda?
- 📧 **Email**: soporte@bustracksv.com
- 💬 **Discord**: BusTrackSV Community
- 🐛 **Issues**: GitHub Issues

---

## ✅ Checklist de Verificación

Marca cada paso cuando lo completes:

- [ ] Script ejecutado sin errores
- [ ] Base de datos con 80+ rutas
- [ ] Base de datos con 150+ paradas
- [ ] Servidor reiniciado correctamente
- [ ] API respondiendo con datos expandidos
- [ ] Frontend mostrando nuevas rutas
- [ ] Búsquedas funcionando correctamente
- [ ] Recomendaciones inteligentes activas

---

**¡Felicidades! 🎉**

Tu aplicación BusTrackSV ahora tiene:
- **3x más rutas**
- **4x más paradas**
- **Sistema de recomendación inteligente**
- **Cobertura completa del AMSS**

¡A disfrutar de la app mejorada! 🚌✨

