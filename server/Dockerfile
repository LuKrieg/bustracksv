# Dockerfile para BusTracksV API
FROM ubuntu:22.04

# Evitar prompts interactivos
ENV DEBIAN_FRONTEND=noninteractive

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    git \
    curl \
    wget \
    libpq-dev \
    libssl-dev \
    pkg-config \
    nlohmann-json3-dev \
    libjsoncpp-dev \
    uuid-dev \
    zlib1g-dev \
    libbrotli-dev \
    libhiredis-dev \
    libsqlite3-dev \
    libmysqlclient-dev \
    && rm -rf /var/lib/apt/lists/*

# Instalar Drogon Framework (versión estable)
RUN git clone --branch v1.8.4 https://github.com/drogonframework/drogon.git /tmp/drogon && \
    cd /tmp/drogon && \
    git submodule update --init && \
    mkdir build && cd build && \
    cmake .. -DCMAKE_BUILD_TYPE=Release -DBUILD_TESTING=OFF && \
    make -j$(nproc) && \
    make install && \
    ldconfig && \
    cd / && rm -rf /tmp/drogon

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY CMakeLists.txt ./
COPY vcpkg.json ./

# Crear archivo de configuración directamente
RUN echo '{ \
  "app": { \
    "name": "BusTracksV API", \
    "version": "1.0.0", \
    "description": "API REST con Drogon C++ para sistema de seguimiento de buses", \
    "host": "0.0.0.0", \
    "port": 8080, \
    "threads": 4 \
  }, \
  "database": { \
    "host": "postgres", \
    "port": 5432, \
    "name": "bustracksv_db", \
    "user": "bustracksv_user", \
    "password": "bustracksv_password", \
    "pool_size": 10, \
    "timeout": 30 \
  }, \
  "logging": { \
    "level": "INFO", \
    "file": "logs/app.log", \
    "console": true \
  }, \
  "security": { \
    "jwt_secret": "docker-super-secret-jwt-key", \
    "jwt_expire_time": 3600, \
    "bcrypt_rounds": 12 \
  } \
}' > config.json

# Crear directorios necesarios
RUN mkdir -p src include logs

# Copiar código fuente
COPY src/ ./src/
COPY include/ ./include/
COPY config/ ./config/

# Crear directorio de build y compilar
RUN mkdir build && cd build && \
    cmake .. -DCMAKE_BUILD_TYPE=Release && \
    make -j$(nproc)

# Crear usuario no-root para seguridad
RUN useradd -m -u 1000 bustracksv && \
    chown -R bustracksv:bustracksv /app

USER bustracksv

# Exponer puerto
EXPOSE 8080

# Comando de inicio
CMD ["./build/bustracksv"]
