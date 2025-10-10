# 🚌 BusTrackSV

BusTrackSV es una aplicación para gestionar rutas de transporte público en El Salvador. Incluye una base de datos en PostgreSQL con tablas de usuarios, rutas y paradas, y puede integrarse con un backend en Node.js o Python.

---

# Requisitos previos

**Git**  
Descárgalo desde: https://git-scm.com/downloads  
Verifica la instalación:  
```bash
git --version
```

**PostgreSQL (15 o superior) + pgAdmin**  
Descárgalo desde: https://www.postgresql.org/download/  
- Recuerda la contraseña del usuario `postgres`.  
- Puerto por defecto: `5432`.  
- Asegúrate de instalar pgAdmin incluido.

---

# 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/BusTrackSV.git
cd BusTrackSV
```

---

# 2. Crear la base de datos

**Opción A — Usando pgAdmin (recomendado)**  
1. Abre pgAdmin y conéctate al servidor PostgreSQL.  
2. Haz clic derecho en "Databases" → Create → Database.  
3. Escribe el nombre de la base de datos, por ejemplo:  
   `bustracksv`  
4. Presiona "Save".

**Opción B — Usando terminal (psql)**  
```bash
psql -U postgres
CREATE DATABASE bustracksv;
```

---

# 3. Importar la estructura y datos

Si tu repositorio incluye `init.sql`:

**Con pgAdmin**  
1. Selecciona la base de datos `bustracksv`.  
2. Abre el Query Tool.  
3. Haz clic en "Open File" y selecciona `sql/init.sql`.  
4. Presiona "Ejecutar" (▶️).  
> Todas las tablas (`usuarios`, `rutas`, `paradas`) y los datos se crearán automáticamente.

**Con terminal**  
```bash
psql -U postgres -d bustracksv -f sql/init.sql
```

---

# Restaurar la base de datos desde un archivo `.dump`

Si tu compañera tiene el archivo `BusTrackSV.dump` descargado desde GitHub, puede restaurar la base de datos con los siguientes pasos:

1. Instalar PostgreSQL en su computadora.
2. Crear la base vacía que se va a restaurar:
   ```sql
   CREATE DATABASE BusTrackSV;
   ```
3. Ejecutar el siguiente comando desde PowerShell o terminal:
   ```bash
   pg_restore -U su_usuario -d BusTrackSV BusTrackSV.dump
   ```
   - `-U su_usuario`: el usuario de PostgreSQL (por ejemplo, `postgres`)
   - `-d BusTrackSV`: la base que creó para restaurar
   - `BusTrackSV.dump`: el archivo que descargó de GitHub

Esto recreará todas las tablas y datos en su máquina.

---

# 4. Configurar conexión (backend)

Si el proyecto tiene un backend, crea un archivo `.env` con:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bustracksv
DB_USER=postgres
DB_PASSWORD=tu_contraseña
``` 
En el archivo `.env` del backend, debe colocar sus datos de PostgreSQL:

```env
DB_USER=su_usuario
DB_PASSWORD=su_contraseña
DB_HOST=localhost
DB_PORT=5432
DB_NAME=BusTrackSV
```

Así, cuando ejecute `node index.js`, el backend se conectará a su base recién restaurada.

⚠️ No subas este archivo a GitHub. Agrega `.env` al `.gitignore`.

---

# 5. Ejecutar el proyecto

**Dependiendo del backend:**

**Node.js**  
```bash
npm install
npm start
```

**Python (Flask/Django/FastAPI)**  
```bash
pip install -r requirements.txt
python app.py
```

---

# 6. Verificación

En pgAdmin, revisa que las tablas `usuarios`, `rutas` y `paradas` existan.

Ejecuta queries de ejemplo:
```sql
SELECT * FROM usuarios;
SELECT * FROM rutas;
SELECT * FROM paradas;
```
---
---

# 7. Probar los endpoints (Node.js)

Una vez que hayas configurado el `.env` y ejecutado el backend (`npm start`), puedes probar los endpoints usando Postman, Insomnia o cualquier cliente HTTP.

### 1️ Registro de usuario
`POST /register`  
- URL: `http://localhost:4000/register`  
- Body (JSON):
```json
{
  "usuario": "nombreUsuario",
  "password": "contraseña",
  "rol": "admin|pasajero"
}
```
### 2️ Login
#### HOST /login
URL: http://localhost:4000/login.
Body (JSON):
```
{
  "usuario": "nombreUsuario",
  "password": "contraseña"
}
```
### 3️ Validar token
```
Authorization: Bearer <tu_token>
```
### 4️ Obtener todos los usuarios
GET /usuarios.
URL: http://localhost:4000/usuarios.

### 5️ Obtener rutas y paradas
GET /rutas → lista de rutas.
GET /paradas → lista de paradas con nombre de la ruta.
---

# ❗Errores comunes

| Error | Causa | Solución |
|------|--------|----------|
| `FATAL: la autentificación password falló para el usuario "postgres"` | Contraseña incorrecta | Verifica la contraseña en `.env` y pgAdmin |
| `could not connect to server` | PostgreSQL no está activo | Inicia el servicio PostgreSQL |
| `la extensión «postgis_topology» no está disponible` | Falta PostGIS | Ejecuta `CREATE EXTENSION postgis;` si está instalada |

---

# Estructura del repositorio

```
📦 BusTrackSV
 ┣ 📂 sql/
 ┃ ┗ 📜 init.sql
 ┣ 📂 src/
 ┃ ┗ ...
 ┣ 📜 .env.example
 ┣ 📜 README.md
 ┗ 📜 package.json / requirements.txt
```
