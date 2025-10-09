#pragma once

#include <drogon/drogon.h>
#include <drogon/HttpController.h>

using namespace drogon;

namespace bustracksv {
namespace controllers {

class UserController : public drogon::HttpController<UserController> {
public:
    METHOD_LIST_BEGIN
        // Endpoint de ejemplo con validación - Crear usuario
        ADD_METHOD_TO(UserController::createUser, "/api/users", Post);
        
        // Obtener todos los usuarios
        ADD_METHOD_TO(UserController::getAllUsers, "/api/users/all", Get);
        
        // Obtener usuario por ID
        ADD_METHOD_TO(UserController::getUserById, "/api/users/{id}", Get);
        
        // Health check
        ADD_METHOD_TO(UserController::healthCheck, "/api/health", Get);
    METHOD_LIST_END

    // Endpoint de ejemplo: Crear usuario con validación completa
    void createUser(const HttpRequestPtr& req, std::function<void(const HttpResponsePtr&)>&& callback);
    
    // Obtener todos los usuarios
    void getAllUsers(const HttpRequestPtr& req, std::function<void(const HttpResponsePtr&)>&& callback);
    
    // Obtener usuario por ID
    void getUserById(const HttpRequestPtr& req, std::function<void(const HttpResponsePtr&)>&& callback);
    
    // Health check
    void healthCheck(const HttpRequestPtr& req, std::function<void(const HttpResponsePtr&)>&& callback);

private:
    // Métodos auxiliares
    bool parseJsonFromRequest(const HttpRequestPtr& req, Json::Value& json);
    void logRequest(const HttpRequestPtr& req, const std::string& endpoint);
};

} // namespace controllers
} // namespace bustracksv
