¡Aquí tienes tu README.md estructurado y corregido en un solo bloque de código listo para copiar y pegar en tu repositorio! He ajustado la redacción para mayor claridad y coherencia técnica:

```markdown
# 🚌 BusTrackSV

BusTrackSV es una aplicación diseñada para gestionar rutas de transporte público en El Salvador. Este proyecto incluye una base de datos en PostgreSQL con tablas de usuarios, rutas y paradas, y puede integrarse con un backend en Node.js o Python.

---

## 🔧 Requisitos previos

### Git
- Descarga: [https://git-scm.com/downloads](https://git-scm.com/downloads)
- Verifica instalación:
  ```bash
  git --version
  ```

### PostgreSQL (versión 15 o superior) + pgAdmin
- Descarga: [https://www.postgresql.org/download/](https://www.postgresql.org/download/)
- Recuerda la contraseña del usuario `postgres`.
- Puerto por defecto: `5432`.
- Asegúrate de instalar pgAdmin junto con PostgreSQL.

---

## 📥 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/BusTrackSV.git
cd BusTrackSV
```

---

## 🗄️ 2. Crear la base de datos

### Opción A — Usando pgAdmin
1. Abrir pgAdmin.
2. Ir al servidor PostgreSQL.
3. Clic derecho en “Databases” → Create → Database.
4. Nombre sugerido: `bustracksv`.
5. Guardar.

### Opción B — Usando terminal (psql)
```bash
psql -U postgres
CREATE DATABASE bustracksv;
```

---

## 🧩 3. Importar estructura y datos

### Usando pgAdmin
1. Abrir Query Tool.
2. Pegar el contenido de `sql/init.sql`.
3. Ejecutar.

### Usando terminal
```bash
psql -U postgres -d bustracksv -f sql/init.sql
```
> Te pedirá la contraseña del usuario `postgres`.

---

## ⚙️ 4. Configurar conexión (backend)

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bustracksv
DB_USER=postgres
DB_PASSWORD=tu_contraseña
```

---

## ▶️ 5. Ejecutar el proyecto

### Node.js
```bash
npm install
npm start
```

### Python (Flask/Django/FastAPI)
```bash
pip install -r requirements.txt
python app.py
```

---

## 🧠 6. Verificación

En pgAdmin, verifica que existan las siguientes tablas:
- `usuarios`
- `rutas`
- `paradas`

Prueba con estas consultas:
```sql
SELECT * FROM usuarios;
SELECT * FROM rutas;
SELECT * FROM paradas;
```

---

## ❗ Errores comunes

| Error | Causa | Solución |
|------|--------|----------|
| `FATAL: la autentificación password falló para el usuario "postgres"` | Contraseña incorrecta | Verifica la contraseña en `.env` y pgAdmin |
| `could not connect to server` | PostgreSQL no está activo | Inicia el servicio PostgreSQL |
| `la extensión «postgis_topology» no está disponible` | Falta PostGIS | Ejecuta `CREATE EXTENSION postgis;` si está instalada |

---

## 📁 Estructura del repositorio

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
```

¿Quieres que también te ayude a redactar la descripción del proyecto o agregar una sección de licencia y contribuciones? Estoy lista para ayudarte a dejarlo impecable.

