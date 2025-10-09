#pragma once

#include <drogon/drogon.h>
#include <drogon/orm/DbClient.h>
#include <memory>

namespace bustracksv {
namespace config {

class DatabaseConfig {
public:
    static DatabaseConfig& getInstance();
    
    // Inicializar conexión a la base de datos
    bool initialize();
    
    // Obtener cliente de base de datos
    drogon::orm::DbClientPtr getDbClient() const { return db_client_; }
    
    // Verificar conexión
    bool isConnected() const;

private:
    DatabaseConfig() = default;
    ~DatabaseConfig() = default;
    DatabaseConfig(const DatabaseConfig&) = delete;
    DatabaseConfig& operator=(const DatabaseConfig&) = delete;
    
    drogon::orm::DbClientPtr db_client_;
    bool is_initialized_ = false;
};

} // namespace config
} // namespace bustracksv
