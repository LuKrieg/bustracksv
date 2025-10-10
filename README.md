
# 🗃️ Guía para configurar la base de datos de BusTrackSV

Este documento explica cómo descargar, instalar y ejecutar correctamente la base de datos de este proyecto utilizando PostgreSQL.

---

# 🔧 Requisitos previos

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

# 📥 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/BusTrackSV.git
cd BusTrackSV
```

---

# 🗄️ 2. Crear la base de datos

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

# 🧩 3. Importar la estructura y datos

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

# ⚙️ 4. Configurar conexión (backend)

Si el proyecto tiene un backend, crea un archivo `.env` con:

DB_HOST=localhost
DB_PORT=5432
DB_NAME=bustracksv
DB_USER=postgres
DB_PASSWORD=tu_contraseña


⚠️ No subas este archivo a GitHub. Agrega `.env` al `.gitignore`.

---

# ▶️ 5. Ejecutar el proyecto

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

# 🧠 6. Verificación

En pgAdmin, revisa que las tablas `usuarios`, `rutas` y `paradas` existan.

Ejecuta queries de ejemplo:
```sql
SELECT * FROM usuarios;
SELECT * FROM rutas;
SELECT * FROM paradas;
```

---

# ❗ Errores comunes

| Error | Causa | Solución |
|------|--------|----------|
| `FATAL: la autentificación password falló para el usuario "postgres"` | Contraseña incorrecta | Verifica la contraseña en `.env` y pgAdmin |
| `could not connect to server` | PostgreSQL no está activo | Inicia el servicio PostgreSQL |
| `la extensión «postgis_topology» no está disponible` | Falta PostGIS | Ejecuta `CREATE EXTENSION postgis;` si está instalada |

---

# 📁 Estructura del repositorio

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

