#pragma once

#include <drogon/drogon.h>
#include <string>

namespace bustracksv {
namespace config {

class AppConfig {
public:
    static AppConfig& getInstance();
    
    // Configuración de la aplicación
    std::string getAppName() const { return app_name_; }
    std::string getAppVersion() const { return app_version_; }
    std::string getHost() const { return host_; }
    int getPort() const { return port_; }
    int getThreads() const { return threads_; }
    
    // Configuración de base de datos
    std::string getDbHost() const { return db_host_; }
    int getDbPort() const { return db_port_; }
    std::string getDbName() const { return db_name_; }
    std::string getDbUser() const { return db_user_; }
    std::string getDbPassword() const { return db_password_; }
    int getDbPoolSize() const { return db_pool_size_; }
    int getDbTimeout() const { return db_timeout_; }
    
    // Configuración de seguridad
    std::string getJwtSecret() const { return jwt_secret_; }
    int getJwtExpireTime() const { return jwt_expire_time_; }
    int getBcryptRounds() const { return bcrypt_rounds_; }
    
    // Cargar configuración desde archivo
    bool loadFromFile(const std::string& config_file = "config.json");

private:
    AppConfig() = default;
    ~AppConfig() = default;
    AppConfig(const AppConfig&) = delete;
    AppConfig& operator=(const AppConfig&) = delete;
    
    // Variables de configuración
    std::string app_name_;
    std::string app_version_;
    std::string host_;
    int port_;
    int threads_;
    
    std::string db_host_;
    int db_port_;
    std::string db_name_;
    std::string db_user_;
    std::string db_password_;
    int db_pool_size_;
    int db_timeout_;
    
    std::string jwt_secret_;
    int jwt_expire_time_;
    int bcrypt_rounds_;
};

} // namespace config
} // namespace bustracksv
