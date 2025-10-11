#include "AppConfig.h"
#include <fstream>
#include <iostream>
#include <drogon/drogon.h>

namespace bustracksv {
namespace config {

AppConfig& AppConfig::getInstance() {
    static AppConfig instance;
    return instance;
}

bool AppConfig::loadFromFile(const std::string& config_file) {
    try {
        std::ifstream file(config_file);
        if (!file.is_open()) {
            std::cerr << "Error: No se pudo abrir el archivo de configuración: " << config_file << std::endl;
            return false;
        }

        Json::Value config;
        file >> config;

        // Configuración de la aplicación
        const auto& app = config["app"];
        app_name_ = app.get("name", "FABS API").asString();
        app_version_ = app.get("version", "1.0.0").asString();
        host_ = app.get("host", "0.0.0.0").asString();
        port_ = app.get("port", 8080).asInt();
        threads_ = app.get("threads", 4).asInt();

        // Configuración de base de datos
        const auto& database = config["database"];
        db_host_ = database.get("host", "localhost").asString();
        db_port_ = database.get("port", 5432).asInt();
        db_name_ = database.get("name", "fabs_db").asString();
        db_user_ = database.get("user", "fabs_user").asString();
        db_password_ = database.get("password", "fabs_password").asString();
        db_pool_size_ = database.get("pool_size", 10).asInt();
        db_timeout_ = database.get("timeout", 30).asInt();

        // Configuración de seguridad
        const auto& security = config["security"];
        jwt_secret_ = security.get("jwt_secret", "default-secret-change-in-production").asString();
        jwt_expire_time_ = security.get("jwt_expire_time", 3600).asInt();
        bcrypt_rounds_ = security.get("bcrypt_rounds", 12).asInt();

        std::cout << "Configuración cargada exitosamente desde: " << config_file << std::endl;
        return true;

    } catch (const std::exception& e) {
        std::cerr << "Error al cargar configuración: " << e.what() << std::endl;
        return false;
    }
}

} // namespace config
} // namespace bustracksv
