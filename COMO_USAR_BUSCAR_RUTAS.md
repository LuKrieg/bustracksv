# 🚌 Cómo usar el Buscador de Rutas

## ✅ Todo está listo y funcionando!

### 📝 Datos insertados:
- ✅ 5 rutas de buses
- ✅ 10 paradas
- ✅ Conexiones entre paradas y rutas

---

## 🚀 Cómo probar la nueva funcionalidad

### 1. **Abre la aplicación**
```
http://localhost:5173
```

### 2. **Inicia sesión**
- Usuario: `celeste` (o el que creaste)
- Contraseña: tu contraseña

### 3. **Ve a "🔍 Buscar Rutas"**
- En el menú superior verás el nuevo botón "🔍 Buscar Rutas"
- Haz click ahí

### 4. **Buscar rutas entre dos puntos**

#### **Opción A: Usar el autocompletado**
1. Haz click en el campo "📍 Origen"
2. Aparecerán sugerencias automáticamente
3. Escribe algo como "Terminal" o "Universidad"
4. Las sugerencias se filtrarán mientras escribes
5. Haz click en una opción para seleccionarla

6. Repite el proceso para "🎯 Destino"

7. Presiona "🔍 Buscar Rutas"

#### **Ejemplo de búsqueda:**
- **Origen:** Terminal Centro
- **Destino:** Soyapango Plaza
- **Resultado:** Te mostrará la Ruta 101 que conecta ambos puntos

---

## 🎯 Funcionalidades implementadas

### ✅ **Autocompletado inteligente**
- Al hacer click en los campos, muestra todas las paradas disponibles
- Mientras escribes, filtra las opciones
- Busca por nombre de parada o zona

### ✅ **Búsqueda de rutas**
- Encuentra TODAS las rutas directas posibles (no solo una)
- Muestra información detallada de cada ruta:
  - Número de ruta
  - Nombre completo
  - Empresa operadora
  - Tarifa
  - Tiempo estimado
  - Número de paradas

### ✅ **Línea recta**
- Calcula y muestra la distancia en línea recta entre los dos puntos
- Usa la fórmula de Haversine (precisión geográfica)

### ✅ **Paradas intermedias**
- Para cada ruta, puedes ver todas las paradas intermedias
- Ordenadas secuencialmente
- Click en "Ver paradas intermedias" para expandir

---

## 📊 Rutas de prueba disponibles

| Ruta | Origen | Destino | Paradas |
|------|--------|---------|---------|
| 101 | Terminal Centro | Soyapango Plaza | 3 |
| 52 | Metrocentro | Universidad de El Salvador | 2 |
| 102 | Terminal Centro | Mejicanos | - |
| 30 | Terminal Oriente | Santa Tecla | - |
| 44 | Centro | Cuscatancingo | - |

---

## 🔧 Para agregar más datos

Edita el archivo `server/datos-prueba.js` y ejecuta:
```bash
cd server
node datos-prueba.js
```

---

## 🎨 Características visuales

- 🎯 Diseño moderno con glassmorphism
- 📱 Responsive (funciona en móvil y escritorio)
- ⚡ Animaciones suaves
- 🌈 Colores vibrantes
- 📊 Tarjetas informativas
- 🔍 Búsqueda instantánea

---

## 💡 Tips

1. **Si no hay rutas:** Selecciona paradas que estén conectadas (como Terminal Centro → Soyapango)
2. **Autocompletado:** Empieza a escribir para filtrar rápidamente
3. **Paradas intermedias:** Expande para ver el recorrido completo
4. **Múltiples rutas:** Si hay varias opciones, todas se mostrarán ordenadas por tiempo

---

## 🐛 Solución de problemas

### No aparecen sugerencias:
- Espera 1-2 segundos después de abrir la página
- Verifica que el servidor esté corriendo en `localhost:4000`

### No encuentra rutas:
- Usa las combinaciones de prueba que están conectadas
- Verifica que las paradas estén en la base de datos

### Error al buscar:
- Revisa la consola del navegador (F12)
- Verifica que ambos servicios estén corriendo

---

**¡Disfruta buscando rutas! 🚌**



