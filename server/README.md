# BusTracksV API

API REST desarrollada con Drogon C++ para sistema de seguimiento de buses con validación de datos y conexión a PostgreSQL.

## 📋 Requisitos

- **Docker Desktop** instalado
- **Windows 10/11** o **Linux/macOS**

## 🚀 Uso

### 1. Instalar Docker Desktop

Descarga e instala Docker Desktop desde: https://www.docker.com/products/docker-desktop/

### 2. Iniciar la API

```bash
docker compose up --build
```

### 3. Crear las tablas de la base de datos

```bash
docker exec -i bustracksv-postgres psql -U bustracksv_user -d bustracksv_db < database/schema.sql
```

### 4. Probar la API

```bash
# Health check
curl http://localhost:8080/api/health

# Crear usuario
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@ejemplo.com","username":"usuario123","password":"MiPassword123","first_name":"Juan","last_name":"Pérez","phone":"+1234567890"}'

# Obtener todos los usuarios
curl http://localhost:8080/api/users/all

# Obtener usuarios con límite y offset
curl "http://localhost:8080/api/users/all?limit=10&offset=0"

# Obtener usuario específico por ID
curl http://localhost:8080/api/users/1
```

## 📚 Endpoints

- `GET /` - Información de la API
- `GET /api/health` - Health check
- `POST /api/users` - Crear usuario (con validación completa)
- `GET /api/users/all` - Obtener todos los usuarios (con parámetros opcionales `limit` y `offset`)
- `GET /api/users/{id}` - Obtener usuario específico por ID

## 🐳 Servicios

- **API**: http://localhost:8080
- **PostgreSQL**: localhost:5432 (bustracksv_db / bustracksv_user / bustracksv_password)
- **pgAdmin**: http://localhost:5050 (admin@bustracksv.com / admin123)

## 🔧 Comandos

```bash
# Iniciar
docker compose up --build

# Detener
docker compose down

# Ver logs
docker compose logs -f

# Resetear (eliminar datos)
docker compose down -v
```