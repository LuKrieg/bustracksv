# 📊 Base de Datos Expandida de Rutas BusTrackSV

## 🎯 Resumen

Este proyecto ahora incluye una base de datos **significativamente expandida** con datos reales del sistema de transporte público del Área Metropolitana de San Salvador (AMSS).

## 📈 Comparación: Antes vs Ahora

| Característica | Base Original | Base Expandida | Incremento |
|----------------|---------------|----------------|------------|
| **Rutas** | 27 rutas | **80+ rutas** | +196% ⬆️ |
| **Paradas** | 35 paradas | **150+ paradas** | +329% ⬆️ |
| **Cobertura** | Básica | Completa AMSS | Total ✅ |

## 🚌 Rutas Incluidas

### Rutas Tradicionales (1-52)
- **Ruta 1**: Terminal Centro - Soyapango
- **Ruta 2**: Terminal Centro - Santa Tecla
- **Ruta 4**: Ilopango - Centro
- **Ruta 7-B**: Mejicanos - Santa Tecla
- **Ruta 8-A**: Terminal Del Sur - Canal 2
- **Ruta 9**: Terminal Oriente - Plaza Mundo
- **Ruta 11**: San Marcos - Metrocentro
- **Ruta 12**: Planes de Renderos - Centro
- **Ruta 16/16-A**: Ciudad Delgado - Centro/Metrocentro
- **Ruta 17**: Centro - Lourdes
- **Ruta 20**: Colonia Santa Rosa - Parque Infantil
- **Ruta 26**: Centro - Cuscatancingo
- **Ruta 29/29-C**: Santa Tecla - Soyapango/Ilopango
- **Ruta 30-A/B/C**: Soyapango - Centro/Metrocentro/Plaza Mundo
- **Ruta 34**: Apopa - Soyapango
- **Ruta 42**: Centro - San Marcos
- **Ruta 44/44-C**: Apopa - Centro/Metrocentro
- **Ruta 52/52-A**: Terminal Oriente - Hospital Rosales

### Rutas 101 (Todas las Variantes)
- **101-A**: Terminal Occidente - UES
- **101-B**: Metrocentro - UES
- **101-C**: Terminal Occidente - Hospital Rosales
- **101-D**: Santa Tecla - UES
- **101-A-1/A-2**: Colonia Las Delicias - San Salvador (variantes)
- **101-B-1/B-2**: Colonia Quezaltepec - San Salvador (variantes)

### Rutas Interdepartamentales (107-190)
- **107-B**: Hacienda Melara - Rosario de Mora - Planes
- **109**: Nejapa - Apopa - San Salvador
- **115/MB-115**: Tonacatepeque - Distrito Italia - Apopa - San Salvador
- **117/117-A/117-C**: El Paisnal/Aguilares - San Salvador
- **140 (todas variantes)**: San Martín - Soyapango - San Salvador
- **173**: Nejapa - San Salvador
- **190/190-A**: Tonacatepeque - San Martín

### Rutas VMT (R1-R24)
Sistema de transporte del Viceministerio de Transporte:
- **R1**: Mejicanos - Colonia Manzano
- **R2-A/R2-A-1**: Mejicanos - Barrio San José
- **R2-B-1/R2-B-2**: Cuscatancingo - San Salvador
- **R2-C**: Mejicanos - Centro
- **R3**: Colonia Atlacatl - Sierra Morena
- **R5**: San Salvador - Cima 4
- **R8**: San Salvador - Colonia Dolores
- **R9-A**: Ciudad Credisa - 25 Avenida Norte
- **R16**: San Salvador - Villas de la Escalón
- **R22**: Colonia Santa Carlota - El Progreso
- **R23-A/R23-B**: Zaporte Arriba - San Salvador
- **R24**: Reparto Santa Margarita - Parque Infantil

### Microbuses (MB-2 a MB-44)
Sistema de microbuses urbanos:
- **MB-2-A**: Colonia Los Conacastes - Alameda Juan Pablo II
- **MB-3**: Colonia Sierra Morena - 23ª Avenida Norte
- **MB-4/MB-4-T/MB-4-A**: Varias colonias Ciudad Delgado
- **MB-5/MB-5-1**: Colonias La Cima y Montecristo
- **MB-6-A/MB-6-C-F/MB-6-V-H**: Varias colonias Cuscatancingo
- **MB-44**: Santísima Trinidad - Santa Elena

## 📍 Paradas Estratégicas

### Zonas de Cobertura

#### Centro Histórico
- Terminal Centro
- Catedral Metropolitana
- Teatro Nacional
- Mercado Central
- Palacio Nacional
- Parque Infantil
- Reloj de Flores

#### Zona Comercial
- Metrocentro
- Plaza Mundo
- Multiplaza
- Zona Rosa
- Galerías Escalón
- Canal 2
- Mercado Modelo

#### Zona Hospitalaria
- Hospital Rosales
- Hospital Bloom
- Hospital Militar
- Hospital de la Mujer

#### Zona Universitaria
- Universidad de El Salvador (UES)
- Universidad Centroamericana (UCA)
- Universidad Don Bosco (UDB)
- Universidad Francisco Gavidia (UFG)

#### Terminales de Buses
- Terminal Centro
- Terminal de Occidente
- Terminal de Oriente
- Terminal Soyapango
- Terminal Santa Tecla
- Terminal Del Sur

#### Municipios
**Mejicanos** (7 paradas):
- Mejicanos Centro
- Parque San José
- Colonia 10 de Octubre
- Colonia Buena Vista
- San Jacinto
- Colonia Manzano
- Colonia Costa Rica

**Soyapango** (7 paradas):
- Terminal Soyapango
- Soyapango Plaza
- Colonia San Bartolo
- Colonia Sierra Morena
- Colonia Atlacatl
- Colonia Las Brisas
- Ciudad Credisa
- Unicentro Soyapango

**Ciudad Delgado** (4 paradas):
- Ciudad Delgado Centro
- Colonia Las Colinas
- Colonia Guardado
- Colonia Santa Alegría

**Cuscatancingo** (7 paradas):
- Cuscatancingo Centro
- Colonia Santa Rosa
- Colonia Vista Hermosa
- Reparto Santa Margarita
- Santísima Trinidad
- Zacamil
- Colonia America

**Apopa**:
- Apopa Centro
- Distrito Italia

**Santa Tecla**:
- Santa Tecla Centro
- Santa Tecla Norte
- Terminal Santa Tecla

**Antiguo Cuscatlán**:
- Antiguo Cuscatlán
- Santa Elena

**Otros Municipios**:
- Ilopango Centro
- Tonacatepeque
- Nejapa
- Aguilares
- San Martín
- San Marcos
- San Pedro
- Ayutuxtepeque

## 🎯 Sistema de Recomendación Inteligente

### Características

#### 1. **Búsqueda por Proximidad**
El sistema automáticamente encuentra paradas cercanas a tu ubicación:
```javascript
// Ejemplo de uso
GET /api/paradas-cercanas?lat=13.6929&lng=-89.2182&radio=500
```
- Radio de búsqueda configurable (default: 500 metros)
- Ordenadas por distancia
- Incluye información de accesibilidad

#### 2. **Recomendación de Rutas**
Algoritmo inteligente que:
- ✅ Encuentra rutas **directas** (sin transbordo)
- ✅ Calcula rutas **con 1 transbordo** si no hay directas
- ✅ Considera **tiempo estimado** de viaje
- ✅ Muestra **distancia de caminata** desde/hacia paradas
- ✅ Calcula **tarifa total** del viaje
- ✅ Ordena por **eficiencia** (tiempo + costo)

```javascript
// Ejemplo de uso
POST /api/recomendar-ruta
{
  "inicioLat": 13.6929,
  "inicioLng": -89.2182,
  "destinoLat": 13.7108,
  "destinoLng": -89.1394,
  "radio": 500
}
```

#### 3. **Métricas Incluidas**
Para cada recomendación:
- 🕐 Tiempo estimado total
- 💰 Tarifa total
- 🚶 Distancia de caminata (origen y destino)
- 🚏 Número de paradas
- 🔄 Número de transbordos
- 📍 Paradas intermedias completas

## 📱 Cómo Usar

### Paso 1: Importar Datos Expandidos

```bash
# Desde la carpeta server/
node import-expanded-data.js
```

### Paso 2: Verificar Importación

El script mostrará:
```
✅ IMPORTACIÓN EXPANDIDA COMPLETADA EXITOSAMENTE
   🚌 Rutas: 80+
   📍 Paradas: 150+
   🔗 Conexiones: XXX
```

### Paso 3: Usar en la Aplicación

La aplicación automáticamente:
1. **Detecta tu ubicación** (si lo permites)
2. **Busca paradas cercanas** (radio de 500m)
3. **Recomienda las mejores rutas** según:
   - Menor tiempo de viaje
   - Menor distancia de caminata
   - Menor número de transbordos
   - Menor costo

## 🔄 Actualización de Datos

### Agregar Nuevas Rutas

Edita `server/import-expanded-data.js`:

```javascript
{
  numero_ruta: 'NUEVA',
  nombre: 'Ruta Nueva',
  descripcion: 'Descripción detallada',
  empresa: 'Empresa Operadora',
  tipo: 'Bus', // o 'Microbus'
  tarifa: 0.25,
  color: '#FF6B6B',
  horario_inicio: '05:00:00',
  horario_fin: '21:00:00',
  frecuencia_minutos: 10
}
```

### Agregar Nuevas Paradas

```javascript
{
  codigo: 'NUEVO-001',
  nombre: 'Parada Nueva',
  direccion: 'Dirección completa',
  lat: 13.XXXX,
  lng: -89.XXXX,
  zona: 'Municipio',
  tipo: 'Regular', // o 'Terminal', 'TransferHub'
  tiene_techo: true,
  tiene_asientos: true,
  accesible: true
}
```

### Relacionar Rutas con Paradas

```javascript
'CODIGO_RUTA': [
  { parada: 'CODIGO_PARADA', orden: 1, tiempo: 0 },
  { parada: 'CODIGO_PARADA_2', orden: 2, tiempo: 5 },
  // ...
]
```

## 🌐 Fuentes de Datos

Los datos provienen de fuentes oficiales:

1. **VMT (Viceministerio de Transporte)**
   - 🔗 https://www.vmt.gob.sv
   - 46 rutas oficiales
   - 1244 paradas registradas

2. **bus.sv**
   - 🔗 https://bus.sv
   - Información de rutas interdepartamentales
   - Horarios y recorridos

3. **Moovit**
   - 🔗 https://moovitapp.com
   - Datos de frecuencias y tiempos estimados

4. **Alfa Geomatics**
   - Datos geoespaciales del AMSS
   - Coordenadas GPS verificadas

## 🎨 Características Visuales

### Códigos de Color por Tipo de Parada

- 🟢 **Verde** (#22c55e): Terminales
- 🔵 **Azul** (#3b82f6): TransferHub (hubs de transferencia)
- 🟠 **Naranja** (#f59e0b): Paradas regulares

### Información de Accesibilidad

Cada parada incluye:
- ☂️ **tiene_techo**: Protección contra lluvia
- 💺 **tiene_asientos**: Bancas disponibles
- ♿ **accesible**: Acceso para personas con movilidad reducida

## 🚀 Próximas Mejoras

### En Desarrollo
- [ ] Rutas en tiempo real con GPS de buses
- [ ] Notificaciones de llegada de buses
- [ ] Integración con mapas offline
- [ ] Favoritos de usuario
- [ ] Historial de viajes

### Futuro
- [ ] Sistema de puntos y gamificación
- [ ] Reportes de usuarios sobre estado de buses
- [ ] Integración con sistemas de pago
- [ ] App móvil nativa (iOS/Android)

## 📞 Soporte

Para más información o reportar problemas:
- 📧 Email: soporte@bustracksv.com
- 🐛 Issues: GitHub Issues
- 📱 Twitter: @BusTrackSV

## 📄 Licencia

Datos bajo licencia del Gobierno de El Salvador.
Aplicación desarrollada para fines educativos y de servicio público.

---

**Última actualización**: Octubre 2024
**Versión**: 2.0 - Base Expandida

