# BusTrackSV

Sistema de rastreo de buses para El Salvador. Una aplicación web que permite a los usuarios rastrear buses en tiempo real, planificar rutas y obtener información confiable sobre el transporte público.

## 🚀 Características

- **Rastreo en tiempo real**: Observa en el mapa dónde está tu bus y recibe notificaciones al instante
- **Rutas optimizadas**: Encuentra siempre la mejor ruta para ahorrar tiempo
- **Información confiable**: Datos actualizados constantemente para decisiones inteligentes
- **Experiencia sin estrés**: Planea tu viaje con anticipación y muévete con confianza
- **Autenticación segura**: Sistema de login/registro con JWT
- **Interfaz moderna**: Diseño responsivo y atractivo

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu sistema:

### Software Requerido

1. **Node.js** (versión 18.0.0 o superior)
   - [Descargar Node.js](https://nodejs.org/)
   - Verificar instalación: `node --version`

2. **npm** (viene incluido con Node.js)
   - Verificar instalación: `npm --version`

3. **Docker** y **Docker Compose**
   - [Descargar Docker Desktop](https://www.docker.com/products/docker-desktop/)
   - Verificar instalación: `docker --version` y `docker compose version`

4. **Git** (para clonar el repositorio)
   - [Descargar Git](https://git-scm.com/)
   - Verificar instalación: `git --version`

### Herramientas Recomendadas

- **Visual Studio Code** (editor recomendado)
  - [Descargar VS Code](https://code.visualstudio.com/)
- **Postman** (para probar APIs)
  - [Descargar Postman](https://www.postman.com/downloads/)

## 🛠️ Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/LuKrieg/bustracksv.git
cd bustracksv
```

### 2. Configurar el Backend

#### Instalar dependencias del servidor:
```bash
cd server
npm install
```

#### Configurar variables de entorno:
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar las variables según tu configuración
nano .env  # o usa tu editor preferido
```

#### Variables de entorno requeridas:
```env
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bustracksv
DB_USER=bustracksv_user
DB_PASSWORD=tu_password_seguro

# Servidor
PORT=4000
NODE_ENV=development

# JWT
JWT_SECRET=tu_jwt_secret_muy_seguro

# PgAdmin (opcional)
PGADMIN_EMAIL=admin@bustracksv.com
PGADMIN_PASSWORD=admin123
PGADMIN_PORT=5050
```

### 3. Configurar el Frontend

#### Instalar dependencias del cliente:
```bash
cd ../client
npm install
```

#### Configurar variables de entorno del frontend:
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar las variables
nano .env
```

#### Variables de entorno del frontend:
```env
# URL del backend
VITE_API_URL=http://localhost:4000

# Configuración
VITE_NODE_ENV=development
```

### 4. Configurar la Base de Datos

#### Levantar PostgreSQL con Docker:
```bash
cd ../server
docker compose up -d
```

#### Verificar que la base de datos esté funcionando:
```bash
# Ver logs de la base de datos
docker compose logs postgres

# Verificar contenedores activos
docker ps
```

## 🚀 Ejecutar el Proyecto

### 1. Iniciar la Base de Datos
```bash
cd server
docker compose up -d
```

### 2. Iniciar el Backend
```bash
cd server
npm run dev
```
El servidor estará disponible en: `http://localhost:4000`

### 3. Iniciar el Frontend
```bash
cd client
npm run dev
```
La aplicación estará disponible en: `http://localhost:3000`

## 🗄️ Base de Datos

### Estructura de Tablas

- **usuarios**: Gestión de usuarios del sistema
- **rutas**: Rutas de buses con geometría espacial
- **paradas**: Paradas de buses con ubicación geográfica

### Acceso a la Base de Datos

#### Opción 1: PgAdmin (Interfaz Web)
- URL: `http://localhost:5050`
- Email: `admin@bustracksv.com`
- Password: `admin123`

#### Opción 2: Cliente de línea de comandos
```bash
# Conectar directamente al contenedor
docker exec -it bustracksv-db psql -U bustracksv_user -d bustracksv
```

## 🔌 API Endpoints

### Autenticación
- `POST /register` - Registrar nuevo usuario
- `POST /login` - Iniciar sesión
- `GET /validate` - Validar token JWT

### Usuarios
- `GET /usuarios` - Obtener lista de usuarios

### Sistema
- `GET /` - Estado del servidor
- `GET /health` - Salud del servidor

## 🧪 Testing

### Probar el Backend
```bash
# Verificar que el servidor esté corriendo
curl http://localhost:4000

# Verificar salud del servidor
curl http://localhost:4000/health
```

### Probar el Frontend
1. Abrir `http://localhost:3000` en el navegador
2. Navegar a `/register` para crear una cuenta
3. Hacer login en `/login`
4. Acceder a rutas protegidas como `/dashboard`

### Probar el Flujo Completo
```bash
# 1. Registrar usuario
curl -X POST http://localhost:4000/register \
  -H "Content-Type: application/json" \
  -d '{"usuario":"test","password":"123456"}'

# 2. Hacer login
curl -X POST http://localhost:4000/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"test","password":"123456"}'

# 3. Usar el token devuelto para acceder a rutas protegidas
curl -H "Authorization: Bearer TU_TOKEN_AQUI" \
  http://localhost:4000/usuarios
```

## 📁 Estructura del Proyecto

```
bustracksv/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── contexts/       # Contextos (Auth)
│   │   ├── services/       # Servicios API
│   │   ├── api/           # Cliente Axios
│   │   └── router/        # Rutas de la aplicación
│   ├── public/            # Archivos estáticos
│   └── package.json
├── server/                # Backend (Node.js + Express)
│   ├── src/
│   │   ├── index.js       # Servidor principal
│   │   └── db.js          # Configuración de BD
│   ├── database/
│   │   └── init.sql       # Script de inicialización
│   ├── docker-compose.yml # Configuración de Docker
│   └── package.json
└── README.md              # Este archivo
```

## 🔧 Scripts Disponibles

### Backend
```bash
npm start      # Iniciar servidor en modo producción
npm run dev    # Iniciar servidor en modo desarrollo (con auto-reload)
```

### Frontend
```bash
npm run dev    # Iniciar servidor de desarrollo
npm run build  # Construir para producción
npm run lint   # Ejecutar linter
npm run preview # Vista previa de la build de producción
```

## 🐳 Docker

### Comandos útiles de Docker

```bash
# Levantar servicios
docker compose up -d

# Ver logs
docker compose logs -f postgres

# Parar servicios
docker compose down

# Parar y eliminar volúmenes
docker compose down -v

# Reconstruir servicios
docker compose up -d --build
```

## 🚨 Solución de Problemas

### Error de conexión a la base de datos
- Verificar que Docker esté corriendo
- Verificar que el contenedor de PostgreSQL esté activo: `docker ps`
- Revisar los logs: `docker compose logs postgres`

### Error de puerto en uso
- Cambiar el puerto en el archivo `.env`
- Verificar que no haya otro proceso usando el puerto: `lsof -i :4000`

### Error de JWT
- Verificar que `JWT_SECRET` esté configurado en `.env`
- Asegurarse de que el token se esté enviando correctamente

### Error de CORS
- Verificar que la URL del frontend esté configurada en el backend
- Asegurarse de que ambos servidores estén corriendo en los puertos correctos

## 🔒 Variables de Entorno

### Backend (.env)
| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `DB_HOST` | Host de la base de datos | localhost |
| `DB_PORT` | Puerto de la base de datos | 5432 |
| `DB_NAME` | Nombre de la base de datos | bustracksv |
| `DB_USER` | Usuario de la base de datos | bustracksv_user |
| `DB_PASSWORD` | Contraseña de la base de datos | - |
| `PORT` | Puerto del servidor | 4000 |
| `NODE_ENV` | Entorno de ejecución | development |
| `JWT_SECRET` | Secreto para firmar JWT | - |

### Frontend (.env)
| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `VITE_API_URL` | URL del backend API | http://localhost:4000 |
| `VITE_NODE_ENV` | Entorno de desarrollo | development |


## 🏗️ Tecnologías Utilizadas

### Frontend
- **React 19** - Biblioteca de UI
- **Vite** - Herramienta de build
- **React Router** - Enrutamiento
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Framework de CSS
- **Headless UI** - Componentes accesibles

### Backend
- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **PostgreSQL** - Base de datos
- **PostGIS** - Extensiones geoespaciales
- **JWT** - Autenticación
- **bcrypt** - Hashing de contraseñas
- **Docker** - Contenedores

### DevOps
- **Docker Compose** - Orquestación de contenedores
- **PgAdmin** - Administración de base de datos
- **Git** - Control de versiones

---

¡Gracias por usar BusTrackSV! 🚌✨
