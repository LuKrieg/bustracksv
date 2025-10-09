cmake_minimum_required(VERSION 3.16)
project(bustracksv VERSION 1.0.0 LANGUAGES CXX)

# Configuración del compilador C++
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Flags adicionales para Drogon (sin corrutinas)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++17")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -Wextra")
set(CMAKE_CXX_EXTENSIONS OFF)

# Configuración de flags de compilación
if(CMAKE_BUILD_TYPE STREQUAL "Debug")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -g -O0 -Wall -Wextra")
else()
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -O3 -Wall -Wextra")
endif()

# Buscar dependencias
find_package(PkgConfig REQUIRED)
find_package(Threads REQUIRED)

# Drogon Framework
find_package(Drogon REQUIRED)

# PostgreSQL
find_package(PostgreSQL REQUIRED)

# OpenSSL (requerido por Drogon)
find_package(OpenSSL REQUIRED)

# JSON (nlohmann/json)
find_package(nlohmann_json REQUIRED)

# Incluir directorios
include_directories(${CMAKE_SOURCE_DIR}/include/api)
include_directories(${CMAKE_SOURCE_DIR}/config)
include_directories(${CMAKE_SOURCE_DIR}/src)

# Archivos fuente (solo los que existen)
set(SOURCES
    src/main.cpp
    src/config/DatabaseConfig.cpp
    src/config/AppConfig.cpp
    src/models/User.cpp
    src/controllers/UserController.cpp
    src/utils/JsonResponse.cpp
    src/utils/ValidationUtils.cpp
    src/middleware/AuthMiddleware.cpp
)

# Archivos de cabecera (solo los que existen)
set(HEADERS
    include/api/User.h
    include/api/DatabaseConfig.h
    include/api/UserController.h
    include/api/JsonResponse.h
    include/api/ValidationUtils.h
    include/api/AuthMiddleware.h
    config/AppConfig.h
)

# Crear ejecutable
add_executable(${PROJECT_NAME} ${SOURCES} ${HEADERS})

# Enlazar librerías
target_link_libraries(${PROJECT_NAME} 
    PRIVATE 
    Drogon::Drogon
    PostgreSQL::PostgreSQL
    OpenSSL::SSL
    OpenSSL::Crypto
    nlohmann_json::nlohmann_json
    Threads::Threads
)

# Configuración de instalación
install(TARGETS ${PROJECT_NAME}
    RUNTIME DESTINATION bin
)

# Configuración para desarrollo
if(CMAKE_BUILD_TYPE STREQUAL "Debug")
    target_compile_definitions(${PROJECT_NAME} PRIVATE DEBUG=1)
endif()

# Configuración de warnings
if(MSVC)
    target_compile_options(${PROJECT_NAME} PRIVATE /W4 /permissive-)
else()
    target_compile_options(${PROJECT_NAME} PRIVATE -Wall -Wextra -Wpedantic)
endif()