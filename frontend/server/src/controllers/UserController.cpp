#include "UserController.h"
#include "User.h"
#include "DatabaseConfig.h"
#include "JsonResponse.h"
#include "ValidationUtils.h"
using namespace bustracksv::utils;
using namespace bustracksv::models;
using namespace bustracksv::config;
#include <iostream>
#include <sstream>

namespace bustracksv {
namespace controllers {

void UserController::createUser(const HttpRequestPtr& req, 
                               std::function<void(const HttpResponsePtr&)>&& callback) {
    logRequest(req, "POST /api/users");
    
    HttpResponsePtr resp;
    
    try {
        // Parsear JSON del request
        Json::Value user_data;
        if (!parseJsonFromRequest(req, user_data)) {
            JsonResponse::badRequest(resp, "Invalid JSON format");
            callback(resp);
            return;
        }
        
        // Validar datos del usuario
        auto validation_errors = ValidationUtils::validateUser(user_data);
        if (!validation_errors.empty()) {
            auto errors_json = ValidationUtils::errorsToJson(validation_errors);
            JsonResponse::validationError(resp, errors_json);
            callback(resp);
            return;
        }
        
        // Obtener cliente de base de datos
        auto& db_config = DatabaseConfig::getInstance();
        auto db_client = db_config.getDbClient();
        
        if (!db_client) {
            JsonResponse::internalError(resp, "Database connection error");
            callback(resp);
            return;
        }
        
        // Verificar si el email ya existe
        auto existing_user_by_email = User::findByEmail(db_client, user_data["email"].asString());
        if (existing_user_by_email) {
            JsonResponse::conflict(resp, "Email already exists");
            callback(resp);
            return;
        }
        
        // Verificar si el username ya existe
        auto existing_user_by_username = User::findByUsername(db_client, user_data["username"].asString());
        if (existing_user_by_username) {
            JsonResponse::conflict(resp, "Username already exists");
            callback(resp);
            return;
        }
        
        // Crear nuevo usuario
        auto user = User::fromJson(user_data);
        if (!user) {
            JsonResponse::internalError(resp, "Failed to create user object");
            callback(resp);
            return;
        }
        
        // Guardar en base de datos
        if (user->save(db_client)) {
            // Crear respuesta exitosa
            Json::Value response_data;
            response_data["user"] = user->toJson();
            response_data["message"] = "User created successfully";
            
            JsonResponse::created(resp, response_data, "User created successfully");
            callback(resp);
        } else {
            JsonResponse::internalError(resp, "Failed to save user to database");
            callback(resp);
        }
        
    } catch (const std::exception& e) {
        std::cerr << "Error in createUser: " << e.what() << std::endl;
        JsonResponse::internalError(resp, "Internal server error");
        callback(resp);
    }
}

void UserController::healthCheck(const HttpRequestPtr& req, 
                                std::function<void(const HttpResponsePtr&)>&& callback) {
    logRequest(req, "GET /api/health");
    
    HttpResponsePtr resp;
    
    try {
        // Verificar conexión a base de datos
        auto& db_config = DatabaseConfig::getInstance();
        bool db_connected = db_config.isConnected();
        
        Json::Value response_data;
        response_data["status"] = "healthy";
        response_data["timestamp"] = std::time(nullptr);
        response_data["database"] = db_connected ? "connected" : "disconnected";
        response_data["version"] = "1.0.0";
        
        if (db_connected) {
            JsonResponse::ok(resp, response_data, "API is healthy");
        } else {
            JsonResponse::internalError(resp, "Database connection failed");
        }
        
        callback(resp);
        
    } catch (const std::exception& e) {
        std::cerr << "Error in healthCheck: " << e.what() << std::endl;
        JsonResponse::internalError(resp, "Health check failed");
        callback(resp);
    }
}

bool UserController::parseJsonFromRequest(const HttpRequestPtr& req, Json::Value& json) {
    try {
        const std::string body = std::string(req->getBody());
        if (body.empty()) {
            return false;
        }
        
        Json::Reader reader;
        return reader.parse(body, json);
    } catch (const std::exception& e) {
        std::cerr << "Error parsing JSON: " << e.what() << std::endl;
        return false;
    }
}

void UserController::getAllUsers(const HttpRequestPtr& req, 
                                 std::function<void(const HttpResponsePtr&)>&& callback) {
    logRequest(req, "GET /api/users");
    
    HttpResponsePtr resp;
    
    try {
        // Obtener cliente de base de datos
        auto& db_config = DatabaseConfig::getInstance();
        auto db_client = db_config.getDbClient();
        
        if (!db_client) {
            JsonResponse::internalError(resp, "Database connection error");
            callback(resp);
            return;
        }
        
        // Obtener parámetros de consulta opcionales
        int limit = 100; // Límite por defecto
        int offset = 0;  // Offset por defecto
        
        // Parsear parámetros de consulta si existen
        auto params = req->getParameters();
        if (params.find("limit") != params.end()) {
            try {
                limit = std::stoi(params.at("limit"));
                if (limit <= 0 || limit > 1000) limit = 100; // Limitar máximo
            } catch (const std::exception& e) {
                // Si no se puede parsear, usar el valor por defecto
            }
        }
        
        if (params.find("offset") != params.end()) {
            try {
                offset = std::stoi(params.at("offset"));
                if (offset < 0) offset = 0;
            } catch (const std::exception& e) {
                // Si no se puede parsear, usar el valor por defecto
            }
        }
        
        // Obtener usuarios de la base de datos
        auto users = User::findAll(db_client, limit, offset);
        
        // Crear respuesta JSON
        Json::Value response_data;
        Json::Value users_array(Json::arrayValue);
        
        for (const auto& user : users) {
            Json::Value user_json = user->toJson();
            // Remover password_hash de la respuesta por seguridad
            user_json.removeMember("password_hash");
            users_array.append(user_json);
        }
        
        response_data["users"] = users_array;
        response_data["total"] = static_cast<int>(users.size());
        response_data["limit"] = limit;
        response_data["offset"] = offset;
        
        JsonResponse::ok(resp, response_data, "Users retrieved successfully");
        callback(resp);
        
    } catch (const std::exception& e) {
        std::cerr << "Error in getAllUsers: " << e.what() << std::endl;
        JsonResponse::internalError(resp, "Internal server error");
        callback(resp);
    }
}

void UserController::getUserById(const HttpRequestPtr& req, 
                                 std::function<void(const HttpResponsePtr&)>&& callback) {
    logRequest(req, "GET /api/users/{id}");
    
    HttpResponsePtr resp;
    
    try {
        // Obtener el ID de los parámetros de la ruta
        auto path_params = req->getParameters();
        std::string id_str = req->getParameter("id");
        
        if (id_str.empty()) {
            JsonResponse::badRequest(resp, "User ID is required");
            callback(resp);
            return;
        }
        
        // Convertir ID a entero
        int user_id;
        try {
            user_id = std::stoi(id_str);
        } catch (const std::exception& e) {
            JsonResponse::badRequest(resp, "Invalid user ID format");
            callback(resp);
            return;
        }
        
        // Obtener cliente de base de datos
        auto& db_config = DatabaseConfig::getInstance();
        auto db_client = db_config.getDbClient();
        
        if (!db_client) {
            JsonResponse::internalError(resp, "Database connection error");
            callback(resp);
            return;
        }
        
        // Buscar usuario por ID
        auto user = User::findById(db_client, user_id);
        
        if (!user) {
            JsonResponse::notFound(resp, "User not found");
            callback(resp);
            return;
        }
        
        // Crear respuesta JSON
        Json::Value response_data;
        Json::Value user_json = user->toJson();
        // Remover password_hash de la respuesta por seguridad
        user_json.removeMember("password_hash");
        response_data["user"] = user_json;
        
        JsonResponse::ok(resp, response_data, "User retrieved successfully");
        callback(resp);
        
    } catch (const std::exception& e) {
        std::cerr << "Error in getUserById: " << e.what() << std::endl;
        JsonResponse::internalError(resp, "Internal server error");
        callback(resp);
    }
}

void UserController::logRequest(const HttpRequestPtr& req, const std::string& endpoint) {
    std::cout << "[REQUEST] " << req->getMethodString() << " " << endpoint 
              << " from " << req->getPeerAddr().toIpPort() << std::endl;
}

} // namespace controllers
} // namespace bustracksv