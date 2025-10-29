# ⚡ Inicio Rápido - BusTrackSV Expandido

## 🎯 3 Comandos = App Lista

```bash
# 1️⃣ Importar datos expandidos (2 min)
cd server && node import-expanded-data.js

# 2️⃣ Verificar (30 seg)
node verificar-datos-expandidos.js

# 3️⃣ Iniciar app (30 seg)
npm start
# En otra terminal: cd ../client && npm run dev
```

**¡Listo!** Abre `http://localhost:5173` 🎉

---

## 📊 ¿Qué Cambia?

| Antes | Después |
|:-----:|:-------:|
| 27 rutas | **82 rutas** 🚀 |
| 35 paradas | **156 paradas** 🚀 |
| Búsqueda manual | **IA automática** 🤖 |
| Cobertura básica | **AMSS completo** 🗺️ |

---

## 🎁 Nuevas Funcionalidades

### 1. 🔍 Búsqueda Inteligente
```javascript
// El sistema automáticamente:
✅ Encuentra paradas cercanas a tu ubicación
✅ Recomienda la mejor ruta
✅ Calcula transbordos si es necesario
✅ Muestra tiempo y costo total
```

### 2. 🗺️ Cobertura Total
```
✅ San Salvador (completo)
✅ Mejicanos (7 colonias)
✅ Soyapango (8 zonas)
✅ Ciudad Delgado (4 colonias)
✅ Cuscatancingo (7 colonias)
✅ Santa Tecla (completo)
✅ + 10 municipios más
```

### 3. 🚌 80+ Rutas Reales
```
✅ Rutas tradicionales (1-52)
✅ Rutas 101 (todas variantes)
✅ Rutas VMT (R1-R24)
✅ Microbuses (MB-2 a MB-44)
✅ Rutas interdepartamentales
```

---

## 📚 Documentación

| Si quieres... | Lee esto... |
|---------------|-------------|
| Empezar YA | Este archivo ⭐ |
| Guía completa | [RESUMEN_EXPANSION.md](./RESUMEN_EXPANSION.md) |
| Paso a paso | [GUIA_RAPIDA_EXPANSION.md](./GUIA_RAPIDA_EXPANSION.md) |
| Ver todas las rutas | [DATOS_EXPANDIDOS_README.md](./DATOS_EXPANDIDOS_README.md) |
| Entender el sistema | [SISTEMA_RECOMENDACION.md](./SISTEMA_RECOMENDACION.md) |
| Buscar algo | [INDICE_DOCUMENTACION.md](./INDICE_DOCUMENTACION.md) |

---

## ✅ Checklist de 5 Minutos

- [ ] ✅ Abrir terminal en la carpeta `server/`
- [ ] ✅ Ejecutar: `node import-expanded-data.js`
- [ ] ✅ Esperar mensaje: "✅ IMPORTACIÓN COMPLETADA"
- [ ] ✅ Ejecutar: `node verificar-datos-expandidos.js`
- [ ] ✅ Ver: "✅ VERIFICACIÓN COMPLETA - TODO OK"
- [ ] ✅ Ejecutar: `npm start`
- [ ] ✅ Abrir nueva terminal en `client/`
- [ ] ✅ Ejecutar: `npm run dev`
- [ ] ✅ Abrir navegador: `http://localhost:5173`
- [ ] ✅ Probar búsqueda de rutas

---

## 🧪 Prueba Rápida

### Test 1: ¿Funcionan las rutas?
```bash
curl http://localhost:4000/api/rutas | jq '. | length'
# Debe mostrar: 82
```

### Test 2: ¿Funcionan las paradas?
```bash
curl http://localhost:4000/api/paradas | jq '. | length'
# Debe mostrar: 156
```

### Test 3: ¿Funciona la recomendación?
```bash
curl -X POST http://localhost:4000/api/recomendar-ruta \
  -H "Content-Type: application/json" \
  -d '{"inicioLat":13.6929,"inicioLng":-89.2182,"destinoLat":13.7108,"destinoLng":-89.1394}'
# Debe mostrar recomendaciones de rutas
```

---

## 🎯 Ejemplos de Búsqueda

### Ejemplo 1: Centro → Soyapango
```
Resultado:
✅ Ruta 1 (directa) - 50 min - $0.25
✅ Ruta 30-B (directa) - 55 min - $0.25
```

### Ejemplo 2: Mejicanos → Santa Tecla
```
Resultado:
⭐ Ruta 7-B (directa) - 65 min - $0.25
```

### Ejemplo 3: Apopa → Multiplaza
```
Resultado:
✅ Ruta 44 + Transbordo + Ruta 11
   Tiempo: 75 min - Costo: $0.55
```

---

## ⚠️ Problemas Comunes

### Error: "Cannot find module"
```bash
cd server
npm install
node import-expanded-data.js
```

### Error: "Connection refused"
```bash
# Verifica que PostgreSQL esté corriendo
Get-Service -Name postgresql*
```

### Las rutas no aparecen
```bash
# Reimporta los datos
node import-expanded-data.js

# Reinicia el servidor
npm start
```

---

## 🌐 Fuentes de Datos

Los datos provienen de:
- ✅ VMT (Viceministerio de Transporte)
- ✅ bus.sv (sistema nacional)
- ✅ Moovit (tiempos y frecuencias)
- ✅ Datos oficiales del Gobierno

---

## 📞 ¿Necesitas Ayuda?

1. **Lee**: [GUIA_RAPIDA_EXPANSION.md](./GUIA_RAPIDA_EXPANSION.md)
2. **Busca**: [INDICE_DOCUMENTACION.md](./INDICE_DOCUMENTACION.md)
3. **Verifica**: `node verificar-datos-expandidos.js`

---

## 🎉 ¡Listo para Usar!

Tu app ahora tiene:
- ✅ **82 rutas reales**
- ✅ **156 paradas estratégicas**
- ✅ **Sistema de recomendación IA**
- ✅ **Cobertura completa del AMSS**

**Abre `http://localhost:5173` y comienza a explorar!** 🚌✨

---

**Última actualización**: Octubre 2024 | **Versión**: 2.0 Expandida

