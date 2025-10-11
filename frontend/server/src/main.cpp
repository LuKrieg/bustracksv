#include <drogon/drogon.h>
#include <iostream>
#include <memory>

// Incluir nuestras clases
#include "AppConfig.h"
#include "DatabaseConfig.h"
#include "UserController.h"

using namespace drogon;
using namespace bustracksv::config;

int main() {
    std::cout << "===============================================" << std::endl;
    std::cout << "        BusTracksV API - Iniciando..." << std::endl;
    std::cout << "===============================================" << std::endl;
    
    try {
        // Cargar configuración desde archivo
        auto& app_config = AppConfig::getInstance();
        if (!app_config.loadFromFile("config.json")) {
            std::cerr << "Error: No se pudo cargar la configuración" << std::endl;
            return -1;
        }
        
        std::cout << "✓ Configuración cargada: " << app_config.getAppName() 
                  << " v" << app_config.getAppVersion() << std::endl;
        
        // Inicializar base de datos
        auto& db_config = DatabaseConfig::getInstance();
        if (!db_config.initialize()) {
            std::cerr << "Error: No se pudo conectar a la base de datos" << std::endl;
            return -1;
        }
        
        std::cout << "✓ Conexión a base de datos establecida" << std::endl;
        
        // Configurar aplicación Drogon
        app().setLogLevel(trantor::Logger::kWarn);
        
        // Configurar servidor
        app().setClientMaxBodySize(1024 * 1024); // 1MB
        // app().setUploadPath("./uploads/"); // Comentado temporalmente
        
        // Configurar CORS (comentado temporalmente)
        // app().enableSession(3600);
        // app().setIdleConnectionTimeout(60);
        
        // Registrar controladores
        std::cout << "✓ Registrando controladores..." << std::endl;
        
        // Los controladores se registran automáticamente con ADD_METHOD_TO
        
        // Configurar ruta principal
        app().registerHandler(
            "/",
            [](const HttpRequestPtr& req, std::function<void(const HttpResponsePtr&)>&& callback) {
                Json::Value response;
                response["message"] = "Bienvenido a BusTracksV API";
                response["version"] = "1.0.0";
                response["status"] = "running";
                response["description"] = "API REST con Drogon C++ para sistema de seguimiento de buses";
                response["endpoints"] = Json::Value(Json::arrayValue);
                response["endpoints"].append("GET / - Información de la API");
                response["endpoints"].append("GET /api/health - Health check");
                response["endpoints"].append("POST /api/users - Crear usuario (con validación completa)");
                response["endpoints"].append("GET /api/users/all - Obtener todos los usuarios");
                response["endpoints"].append("GET /api/users/{id} - Obtener usuario específico por ID");
                
                auto resp = HttpResponse::newHttpJsonResponse(response);
                callback(resp);
            },
            {Get}
        );
        
        
        std::cout << "✓ Rutas configuradas" << std::endl;
        
        // Mostrar información del servidor
        std::cout << "===============================================" << std::endl;
        std::cout << "  Servidor: " << app_config.getHost() << ":" << app_config.getPort() << std::endl;
        std::cout << "  Hilos: " << app_config.getThreads() << std::endl;
        std::cout << "  Base de datos: " << app_config.getDbHost() << ":" << app_config.getDbPort() << std::endl;
        std::cout << "===============================================" << std::endl;
        
        // Iniciar servidor
        std::cout << "🚀 Iniciando servidor..." << std::endl;
        
        app()
            .setThreadNum(app_config.getThreads())
            .addListener(app_config.getHost(), app_config.getPort())
            .run();
            
    } catch (const std::exception& e) {
        std::cerr << "Error fatal: " << e.what() << std::endl;
        return -1;
    }
    
    return 0;
}
