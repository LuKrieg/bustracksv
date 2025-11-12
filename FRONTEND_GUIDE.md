# Guía Completa del Frontend - BusTrackSV

## 📋 Tabla de Contenidos
1. [Tecnologías y Stack](#tecnologías-y-stack)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Configuración y Setup](#configuración-y-setup)
4. [Arquitectura de la Aplicación](#arquitectura-de-la-aplicación)
5. [Sistema de Rutas](#sistema-de-rutas)
6. [Autenticación y Contextos](#autenticación-y-contextos)
7. [Servicios y API](#servicios-y-api)
8. [Componentes Principales](#componentes-principales)
9. [Estilos y Diseño](#estilos-y-diseño)
10. [Funcionalidades Clave](#funcionalidades-clave)

---

## 🛠 Tecnologías y Stack

### Dependencias Principales
- **React 19.1.1** - Biblioteca de UI
- **React Router DOM 7.9.4** - Enrutamiento
- **Vite 7.1.6** - Build tool y dev server
- **Tailwind CSS 4.1.13** - Framework de estilos
- **Axios 1.12.2** - Cliente HTTP
- **Leaflet 1.9.4** - Mapas interactivos
- **React Leaflet 4.2.1** - Componentes React para Leaflet
- **Headless UI 2.2.9** - Componentes UI accesibles

### Herramientas de Desarrollo
- **ESLint 9.35.0** - Linter
- **SWC** - Compilador rápido (via @vitejs/plugin-react-swc)

---

## 📁 Estructura del Proyecto

```
client/
├── src/
│   ├── api/
│   │   └── client.js              # Cliente Axios configurado
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx         # Header con navegación
│   │   │   ├── UserMenu.jsx       # Menú de usuario
│   │   │   └── ContentBox.jsx     # Contenedor de contenido
│   │   ├── pages/
│   │   │   ├── index/             # Página principal
│   │   │   ├── login/             # Login
│   │   │   ├── register/          # Registro
│   │   │   ├── dashboard/         # Dashboard principal
│   │   │   │   ├── DashboardPage.jsx
│   │   │   │   └── DetailModal.jsx
│   │   │   ├── map/               # Página de mapas
│   │   │   ├── profile/           # Perfil de usuario
│   │   │   ├── about/             # Acerca de
│   │   │   └── features/          # Características
│   │   └── protected/
│   │       └── ProtectedRoute.jsx # Ruta protegida
│   ├── contexts/
│   │   └── AuthContext.jsx        # Contexto de autenticación
│   ├── services/
│   │   ├── authService.js         # Servicio de autenticación
│   │   ├── routeService.js        # Servicio de rutas
│   │   ├── perfilService.js       # Servicio de perfil
│   │   ├── historialService.js    # Servicio de historial
│   │   └── detalleService.js      # Servicio de detalles
│   ├── router/
│   │   └── index.jsx              # Configuración de rutas
│   ├── data/
│   │   └── aboutData.js           # Datos estáticos
│   ├── main.jsx                   # Punto de entrada
│   └── index.css                  # Estilos globales
├── public/                        # Archivos estáticos
├── package.json
├── vite.config.js
└── index.html
```

---

## ⚙️ Configuración y Setup

### Variables de Entorno
El proyecto usa `VITE_API_URL` para la URL del backend:
- Por defecto: `http://localhost:4000`
- Configurar en archivo `.env`: `VITE_API_URL=http://localhost:4000`

### Scripts Disponibles
```bash
npm run dev      # Inicia servidor de desarrollo
npm run build    # Construye para producción
npm run lint     # Ejecuta ESLint
npm run preview  # Previsualiza build de producción
```

### Configuración de Vite
- **Plugin React SWC**: Compilación rápida
- **Plugin Tailwind CSS**: Integración de Tailwind
- **Optimización**: Incluye Leaflet y React-Leaflet en optimizeDeps
- **Define global**: Configura `global` como `globalThis` para compatibilidad

---

## 🏗 Arquitectura de la Aplicación

### Flujo de la Aplicación
```
main.jsx
  └── AuthProvider (Context)
      └── RouterProvider
          └── Routes
              ├── Públicas (/, /about, /features, /login, /register)
              └── Protegidas (/dashboard, /map, /perfil)
```

### Principios de Diseño
1. **Componentes Funcionales**: Todos los componentes usan funciones
2. **Hooks de React**: useState, useEffect, useContext, etc.
3. **Context API**: Para estado global de autenticación
4. **Servicios Separados**: Lógica de negocio en servicios independientes
5. **Rutas Protegidas**: Componente ProtectedRoute para autenticación

---

## 🗺 Sistema de Rutas

### Rutas Públicas
- `/` - Página principal (IndexPage)
- `/about` - Acerca de (AboutPage)
- `/features` - Características (FeaturesPage)
- `/login` - Inicio de sesión (LoginPage)
- `/register` - Registro (RegisterPage)

### Rutas Protegidas (requieren autenticación)
- `/dashboard` - Dashboard principal (DashboardPage)
- `/map` - Mapa interactivo (MapPage)
- `/perfil` - Perfil de usuario (ProfilePage)

### Rutas Especiales
- `*` - Fallback a página principal (IndexPage)

### ProtectedRoute
Componente que:
- Verifica si el usuario está autenticado
- Muestra loading mientras verifica
- Redirige a `/login` si no está autenticado
- Preserva la URL de destino para redirección después del login

---

## 🔐 Autenticación y Contextos

### AuthContext
Proporciona:
- `user`: Objeto del usuario actual
- `loading`: Estado de carga
- `login(credentials)`: Función para iniciar sesión
- `register(userData)`: Función para registrar usuario
- `logout()`: Función para cerrar sesión
- `isAuthenticated()`: Verificar si está autenticado
- `updateUser(userData)`: Actualizar datos del usuario

### Almacenamiento
- **Token**: `localStorage.getItem("bustracksv:token")`
- **Usuario**: `localStorage.getItem("bustracksv:user")`
- Los datos se guardan automáticamente después del login

### Flujo de Autenticación
1. Usuario ingresa credenciales en LoginPage
2. Se llama a `authService.login()`
3. Se obtiene token y perfil del usuario
4. Se guarda en localStorage
5. Se actualiza el contexto AuthContext
6. Se redirige al dashboard o página solicitada

---

## 🌐 Servicios y API

### api/client.js
Cliente Axios configurado con:
- **Base URL**: Desde `VITE_API_URL` o `http://localhost:4000`
- **Timeout**: 10 segundos
- **Interceptores**:
  - Request: Agrega token de autenticación automáticamente
  - Response: Maneja errores 401/403 y redirige a login

### authService.js
- `register(userData)`: Registrar nuevo usuario
- `login(credentials)`: Iniciar sesión
- `validateToken()`: Validar token y obtener perfil
- `logout()`: Cerrar sesión
- `isAuthenticated()`: Verificar autenticación
- `getToken()`: Obtener token actual

### routeService.js
- `getRutas()`: Obtener todas las rutas
- `getRuta(identificador)`: Obtener ruta específica
- `getParadas()`: Obtener todas las paradas
- `getParada(identificador)`: Obtener parada específica
- `getRutasCercanas(lat, lng, radio, limite)`: Buscar rutas cercanas
- `getParadasCercanas(lat, lng, radio, limite)`: Buscar paradas cercanas
- `recomendarRuta(inicioLat, inicioLng, destinoLat, destinoLng, radio)`: Recomendar mejor ruta
- `buscarRutas(origen, destino)`: Buscar rutas (legacy)
- Utilidades: `convertGeoJSONToLeaflet()`, `calcularDistancia()`, `formatearTiempo()`, `formatearDistancia()`, `crearIconoParada()`

### perfilService.js
- `obtenerPerfil()`: Obtener perfil del usuario
- `actualizarPerfil(datosActualizados)`: Actualizar perfil
- `cambiarPassword(passwordActual, passwordNueva)`: Cambiar contraseña
- `convertirImagenABase64(file)`: Convertir imagen a base64

### historialService.js
- `guardarBusqueda(busquedaData)`: Guardar búsqueda en historial
- `obtenerHistorial(limite, offset)`: Obtener historial
- `eliminarBusqueda(id)`: Eliminar búsqueda específica
- `limpiarHistorial()`: Limpiar todo el historial
- `actualizarBusqueda(id, metadata)`: Actualizar metadata de búsqueda

### detalleService.js
- `obtenerParadasDetalle()`: Obtener paradas con detalles
- `obtenerRutasDetalle()`: Obtener rutas con detalles
- `obtenerBusesDetalle()`: Obtener buses con detalles

---

## 🧩 Componentes Principales

### Layout Components

#### Header.jsx
- Muestra logo de BusTrackSV
- Navegación dinámica según estado de autenticación
- Para usuarios autenticados: Dashboard, Mapa
- Para usuarios no autenticados: Explora, Características, Quienes somos
- Botones de acción: Iniciar Sesión / Empezar (registro)
- UserMenu para usuarios autenticados

#### UserMenu.jsx
- Menú dropdown con Headless UI
- Muestra foto de perfil o inicial del usuario
- Opciones: Mi Perfil, Cerrar Sesión
- Transiciones suaves

#### ContentBox.jsx
- Contenedor reutilizable para contenido
- Soporta título, párrafos, misión, visión, valores
- Estilos consistentes con el diseño

### Page Components

#### IndexPage.jsx
- Página principal pública
- Hero section con call-to-action
- Diseño de dos columnas con elementos visuales
- Enlace a registro

#### LoginPage.jsx
- Formulario de inicio de sesión
- Validación de campos
- Mostrar/ocultar contraseña
- Manejo de errores
- Redirección después del login exitoso
- Enlace a registro

#### RegisterPage.jsx
- Formulario de registro
- Validación de campos
- Manejo de errores
- Redirección después del registro exitoso

#### DashboardPage.jsx
- **Estadísticas**: Tarjetas con contadores de Buses, Paradas, Rutas
- **Modal de Detalles**: Al hacer clic en las tarjetas, se abre un modal con detalles
- **Historial**: Tabla con las últimas 10 búsquedas
- **Funcionalidades**:
  - Cargar estadísticas desde `/api/estadisticas`
  - Cargar historial desde historialService
  - Navegar al mapa con datos del historial al hacer clic
  - Formateo de fechas y horas para zona horaria de El Salvador
  - Recarga automática cuando la página recupera el foco

#### MapPage.jsx
- **Componente Principal**: Mapa interactivo con Leaflet
- **Funcionalidades**:
  - Búsqueda de origen y destino con autocomplete
  - Botón "Mi Ubicación" para usar GPS
  - Búsqueda de rutas recomendadas
  - Visualización de rutas en el mapa
  - Soporte para transbordos (múltiples buses)
  - Marcadores de origen (verde) y destino (rojo)
  - Polilíneas para mostrar la ruta
  - Paradas intermedias marcadas en el mapa
  - Guardado automático en historial
  - Restauración de búsquedas desde historial
- **Estado**:
  - Paradas cargadas
  - Origen y destino seleccionados
  - Resultados de búsqueda
  - Ruta seleccionada para mostrar en el mapa
  - Referencia a última búsqueda guardada

#### ProfilePage.jsx
- **Vista de Perfil**: Información del usuario
- **Edición**: Modo de edición para actualizar datos
- **Foto de Perfil**: 
  - Subir foto (máximo 2MB)
  - Previsualización
  - Eliminar foto
  - Guardado automático
- **Cambio de Contraseña**:
  - Sección expandible
  - Validación de contraseña actual
  - Validación de nueva contraseña (mínimo 6 caracteres)
  - Confirmación de contraseña
  - Mostrar/ocultar contraseñas
- **Información de Cuenta**: Fecha de creación, último acceso

#### DetailModal.jsx
- Modal para mostrar detalles de Buses, Paradas o Rutas
- **Para Paradas**:
  - Agrupación alfabética por primera letra
  - Grid responsive
  - Filtrado de campos vacíos o en 0
  - Mostrar información relevante
- **Para Rutas**:
  - Agrupación alfabética
  - Información de empresa, tarifa, distancia
  - Horarios y frecuencia
  - Lista de paradas (expandible)
- **Para Buses**:
  - Dos columnas: Números y Con letras
  - Ordenamiento numérico y alfabético
  - Diseño de tarjetas

---

## 🎨 Estilos y Diseño

### Tailwind CSS
- Versión 4.1.13 con integración de Vite
- Configuración en `index.css` con tema personalizado

### Tema Personalizado
```css
--color-bg-primary: #0c0e19
--color-text-primary: #ffffff
--color-text-secondary: #a0a0a0
--color-accent-blue: #5d9fd9
--color-accent-light-blue: #60a5fa
```

### Paleta de Colores
- **Fondo Principal**: `#0c0e19` (oscuro)
- **Texto Primario**: `#ffffff` (blanco)
- **Texto Secundario**: `#a0a0a0` (gris claro)
- **Acento Azul**: `#5d9fd9` (azul)
- **Acento Azul Claro**: `#60a5fa` (azul claro)

### Diseño
- **Estilo**: Moderno, oscuro, con gradientes
- **Tipografía**: Sistema de fuentes sans-serif
- **Componentes**: Bordes redondeados, sombras, transiciones
- **Responsive**: Diseño adaptable a móviles y desktop

### Scrollbar Personalizado
- Ancho: 8px
- Fondo: Transparente
- Estilo minimalista

---

## ⚡ Funcionalidades Clave

### 1. Sistema de Autenticación
- Login con usuario y contraseña
- Registro de nuevos usuarios
- Validación de token automática
- Persistencia de sesión
- Cerrar sesión

### 2. Búsqueda de Rutas
- Autocomplete de paradas
- Búsqueda por GPS (Mi Ubicación)
- Recomendación inteligente de rutas
- Soporte para transbordos
- Visualización en mapa
- Cálculo de distancias y tiempos

### 3. Historial de Búsquedas
- Guardado automático de búsquedas
- Visualización en dashboard
- Restauración de búsquedas anteriores
- Actualización de alternativa seleccionada
- Limpieza de historial

### 4. Dashboard
- Estadísticas en tiempo real
- Accesos rápidos a buses, paradas, rutas
- Historial de búsquedas recientes
- Modales con detalles completos

### 5. Perfil de Usuario
- Edición de información personal
- Cambio de contraseña
- Foto de perfil (subir/eliminar)
- Información de cuenta

### 6. Mapas Interactivos
- Mapa con Leaflet
- Marcadores de origen y destino
- Visualización de rutas
- Paradas intermedias
- Soporte para transbordos (múltiples segmentos)
- Zoom y pan interactivo

### 7. Gestión de Estado
- Context API para autenticación
- Estado local en componentes
- Servicios para comunicación con API
- Manejo de errores centralizado

---

## 🔧 Configuración del Cliente API

### Interceptores
1. **Request Interceptor**:
   - Agrega token de autenticación automáticamente
   - Configura headers

2. **Response Interceptor**:
   - Maneja errores 401/403
   - Limpia localStorage si el token es inválido
   - Redirige a login si es necesario

### Manejo de Errores
- Errores de red se muestran al usuario
- Errores de autenticación redirigen a login
- Errores de validación se muestran en formularios

---

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Adaptaciones
- Navegación oculta en móviles (menú hamburguesa futuro)
- Grids adaptativos
- Modales responsivos
- Mapas adaptativos

---

## 🚀 Mejores Prácticas Implementadas

1. **Separación de Concerns**: Servicios, componentes, contextos separados
2. **Reutilización**: Componentes reutilizables
3. **Manejo de Errores**: Try-catch en servicios, mensajes al usuario
4. **Loading States**: Indicadores de carga en operaciones asíncronas
5. **Validación**: Validación en cliente y servidor
6. **Seguridad**: Tokens en localStorage, interceptores para autenticación
7. **Performance**: Lazy loading, optimizaciones de Vite
8. **Accesibilidad**: Headless UI para componentes accesibles

---

## 📝 Notas Importantes

### Zona Horaria
- El proyecto maneja fechas en zona horaria de El Salvador (UTC-6)
- Formateo de fechas usando `Intl.DateTimeFormat` con `timeZone: 'America/El_Salvador'`

### Almacenamiento Local
- Token: `bustracksv:token`
- Usuario: `bustracksv:user`
- Los datos se limpian automáticamente al cerrar sesión

### Leaflet
- Iconos por defecto configurados desde CDN
- Iconos personalizados para paradas (SVG)
- Marcadores de origen (verde) y destino (rojo)

### Transbordos
- Soporte para múltiples segmentos de ruta
- Visualización de pasos detallados
- Cálculo de tiempo total y tarifa total
- Distancias de caminata

---

## 🐛 Troubleshooting

### Problemas Comunes

1. **Error de conexión con el backend**:
   - Verificar que el servidor esté corriendo en `http://localhost:4000`
   - Verificar variable de entorno `VITE_API_URL`

2. **Token inválido**:
   - El token se limpia automáticamente
   - Redirige a login
   - Verificar que el backend esté validando correctamente

3. **Mapa no se muestra**:
   - Verificar que Leaflet CSS esté cargado
   - Verificar que los iconos de Leaflet estén disponibles
   - Verificar conexión a OpenStreetMap

4. **Estilos no se aplican**:
   - Verificar que Tailwind esté configurado correctamente
   - Verificar que `index.css` esté importado en `main.jsx`

---

## 📚 Recursos Adicionales

### Documentación
- [React](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Leaflet](https://leafletjs.com/)
- [Axios](https://axios-http.com/)
- [Headless UI](https://headlessui.com/)

### Estructura de Datos
- Ver servicios para estructura de datos de API
- Ver componentes para estructura de props
- Ver contextos para estructura de estado

---

## 🎯 Próximos Pasos Sugeridos

1. **Testing**: Agregar tests unitarios y de integración
2. **PWA**: Convertir en Progressive Web App
3. **Offline Support**: Soporte offline con Service Workers
4. **Notificaciones**: Notificaciones push para llegadas de buses
5. **Optimización**: Lazy loading de rutas, code splitting
6. **Internacionalización**: Soporte para múltiples idiomas
7. **Temas**: Soporte para temas claro/oscuro
8. **Analytics**: Integración de analytics

---

**Última actualización**: Enero 2025
**Versión del Frontend**: 0.0.0
**React**: 19.1.1
**Node**: Verificar en `package.json`


