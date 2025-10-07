# BusTrackSV

Una aplicación web para rastrear y planificar viajes en transporte público en El Salvador.

## 🚀 Características

- **Rastreo en tiempo real** de buses y rutas
- **Planificación de viajes** con múltiples opciones
- **Mapa interactivo** con todas las rutas disponibles
- **Sistema de autenticación** con rutas protegidas
- **Dashboard personalizado** para usuarios registrados
- **Diseño responsive** y moderno

## 🛠️ Tecnologías

- **React 19** - Framework principal
- **React Router DOM** - Navegación y rutas
- **Tailwind CSS** - Estilos y diseño
- **Vite** - Herramienta de desarrollo

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── auth/           # Componentes de autenticación
│   ├── layout/         # Componentes de layout (Header, etc.)
│   ├── pages/          # Páginas organizadas por rutas
│   │   ├── index/      # Página principal
│   │   ├── about/      # Página "Quienes somos"
│   │   ├── login/      # Página de inicio de sesión
│   │   ├── register/   # Página de registro
│   │   ├── features/   # Página de características
│   │   ├── dashboard/  # Dashboard del usuario
│   │   └── map/        # Página del mapa
│   └── protected/      # Componentes de rutas protegidas
├── contexts/           # Contextos de React (Auth, etc.)
├── hooks/              # Hooks personalizados
└── utils/              # Utilidades y helpers
```

## 🔐 Sistema de Autenticación

El proyecto incluye un sistema de autenticación mock con las siguientes credenciales de prueba:

- **Email:** usuario@test.com
- **Contraseña:** password

### Rutas Protegidas

Las siguientes rutas requieren autenticación:
- `/dashboard` - Dashboard del usuario
- `/map` - Mapa de rutas

### Rutas Públicas

- `/` - Página principal
- `/about` - Quienes somos
- `/features` - Características
- `/login` - Inicio de sesión
- `/register` - Registro

## 🎨 Variables CSS

El proyecto utiliza variables CSS personalizadas:

```css
:root {
  --bg-primary: #0C0E19;      /* Color de fondo principal */
  --text-primary: #ffffff;    /* Color de texto principal */
  --text-secondary: #a0a0a0;  /* Color de texto secundario */
  --accent-blue: #3b82f6;     /* Color azul de acento */
  --accent-light-blue: #60a5fa; /* Color azul claro */
}
```

## 🚀 Instalación y Desarrollo

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

3. **Construir para producción:**
   ```bash
   npm run build
   ```

## 📱 Funcionalidades Implementadas

- ✅ Sistema de rutas con React Router
- ✅ Rutas protegidas con autenticación
- ✅ Header responsive con navegación activa
- ✅ Páginas de autenticación (login/registro)
- ✅ Dashboard del usuario
- ✅ Página del mapa (placeholder)
- ✅ Sistema de autenticación mock
- ✅ Diseño responsive con Tailwind CSS
- ✅ Variables CSS personalizadas

## 🔄 Próximos Pasos

- [ ] Integración con API real
- [ ] Implementación del mapa interactivo
- [ ] Sistema de notificaciones
- [ ] Historial de viajes
- [ ] Favoritos y rutas personalizadas
- [ ] Integración con GPS en tiempo real

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.