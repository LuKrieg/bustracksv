#include "DatabaseConfig.h"
#include "AppConfig.h"
#include <iostream>

namespace bustracksv {
namespace config {

DatabaseConfig& DatabaseConfig::getInstance() {
    static DatabaseConfig instance;
    return instance;
}

bool DatabaseConfig::initialize() {
    if (is_initialized_) {
        return true;
    }

    try {
        auto& app_config = AppConfig::getInstance();
        
        // Construir string de conexión PostgreSQL
        std::string connection_string = 
            "host=" + app_config.getDbHost() +
            " port=" + std::to_string(app_config.getDbPort()) +
            " dbname=" + app_config.getDbName() +
            " user=" + app_config.getDbUser() +
            " password=" + app_config.getDbPassword() +
            " client_encoding=UTF8";
        
        // Crear cliente de base de datos
        db_client_ = drogon::orm::DbClient::newPgClient(
            connection_string,
            app_config.getDbPoolSize(),
            app_config.getDbTimeout()
        );
        
        // Verificar conexión
        if (db_client_) {
            is_initialized_ = true;
            std::cout << "Conexión a PostgreSQL establecida exitosamente" << std::endl;
            std::cout << "Base de datos: " << app_config.getDbName() 
                      << " en " << app_config.getDbHost() 
                      << ":" << app_config.getDbPort() << std::endl;
            return true;
        } else {
            std::cerr << "Error: No se pudo crear el cliente de base de datos" << std::endl;
            return false;
        }
        
    } catch (const std::exception& e) {
        std::cerr << "Error al inicializar la base de datos: " << e.what() << std::endl;
        return false;
    }
}

bool DatabaseConfig::isConnected() const {
    if (!db_client_) {
        return false;
    }
    
    try {
        // Ejecutar una consulta simple para verificar la conexión
        auto result = db_client_->execSqlSync("SELECT 1");
        return !result.empty();
    } catch (const std::exception& e) {
        std::cerr << "Error verificando conexión a la base de datos: " << e.what() << std::endl;
        return false;
    }
}

} // namespace config
} // namespace bustracksv
