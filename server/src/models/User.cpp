#include "User.h"
#include <drogon/orm/Mapper.h>
// #include <drogon/utils/coroutine.h>  // Comentado para evitar problemas con corrutinas
#include <regex>
// #include <bcrypt/BCrypt.hpp> // Comentado temporalmente
#include <sstream>
#include <iomanip>

namespace bustracksv {
namespace models {

User::User() 
    : id_(0), email_(""), username_(""), password_hash_(""), 
      first_name_(""), last_name_(""), phone_(""), 
      is_active_(true), is_verified_(false) {
    auto now = std::chrono::system_clock::now();
    created_at_ = now;
    updated_at_ = now;
}

User::User(const std::string& email, const std::string& username, 
           const std::string& password, const std::string& first_name, 
           const std::string& last_name, const std::string& phone)
    : email_(email), username_(username), first_name_(first_name), 
      last_name_(last_name), phone_(phone), is_active_(true), is_verified_(false) {
    auto now = std::chrono::system_clock::now();
    created_at_ = now;
    updated_at_ = now;
    setPassword(password);
}

void User::setPassword(const std::string& password) {
    password_hash_ = hashPassword(password);
}

std::string User::hashPassword(const std::string& password) const {
    // Implementación temporal simple - en producción usar bcrypt
    return "hashed_" + password;
}

bool User::verifyPassword(const std::string& password) const {
    // Implementación temporal simple - en producción usar bcrypt
    return password_hash_ == ("hashed_" + password);
}

bool User::save(drogon::orm::DbClientPtr db_client) {
    try {
        std::string sql = R"(
            INSERT INTO users (email, username, password_hash, first_name, last_name, phone, is_active, is_verified)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id, created_at, updated_at
        )";
        
        auto result = db_client->execSqlSync(sql, email_, username_, password_hash_, 
                                           first_name_, last_name_, phone_, is_active_, is_verified_);
        
        if (!result.empty()) {
            const auto& row = result[0];
            id_ = row["id"].as<int>();
            // Actualizar timestamps desde la base de datos
            created_at_ = std::chrono::system_clock::now();
            updated_at_ = std::chrono::system_clock::now();
            return true;
        }
        return false;
    } catch (const std::exception& e) {
        std::cerr << "Error guardando usuario: " << e.what() << std::endl;
        return false;
    }
}

bool User::update(drogon::orm::DbClientPtr db_client) {
    if (id_ <= 0) {
        return false;
    }
    
    try {
        std::string sql = R"(
            UPDATE users 
            SET email = $2, username = $3, password_hash = $4, first_name = $5, 
                last_name = $6, phone = $7, is_active = $8, is_verified = $9
            WHERE id = $1
            RETURNING updated_at
        )";
        
        auto result = db_client->execSqlSync(sql, id_, email_, username_, password_hash_, 
                                           first_name_, last_name_, phone_, is_active_, is_verified_);
        
        if (!result.empty()) {
            updated_at_ = std::chrono::system_clock::now();
            return true;
        }
        return false;
    } catch (const std::exception& e) {
        std::cerr << "Error actualizando usuario: " << e.what() << std::endl;
        return false;
    }
}

bool User::remove(drogon::orm::DbClientPtr db_client) {
    if (id_ <= 0) {
        return false;
    }
    
    try {
        std::string sql = "DELETE FROM users WHERE id = $1";
        auto result = db_client->execSqlSync(sql, id_);
        return true;
    } catch (const std::exception& e) {
        std::cerr << "Error eliminando usuario: " << e.what() << std::endl;
        return false;
    }
}

std::shared_ptr<User> User::findById(drogon::orm::DbClientPtr db_client, int id) {
    try {
        std::string sql = "SELECT id, email, username, password_hash, first_name, last_name, phone, is_active, is_verified, created_at, updated_at FROM users WHERE id = $1";
        auto result = db_client->execSqlSync(sql, id);
        
        if (!result.empty()) {
            auto user = std::make_shared<User>();
            user->fromDbRow(result[0]);
            return user;
        }
        return nullptr;
    } catch (const std::exception& e) {
        std::cerr << "Error buscando usuario por ID: " << e.what() << std::endl;
        return nullptr;
    }
}

std::shared_ptr<User> User::findByEmail(drogon::orm::DbClientPtr db_client, const std::string& email) {
    try {
        std::string sql = "SELECT id, email, username, password_hash, first_name, last_name, phone, is_active, is_verified, created_at, updated_at FROM users WHERE email = $1";
        auto result = db_client->execSqlSync(sql, email);
        
        if (!result.empty()) {
            auto user = std::make_shared<User>();
            user->fromDbRow(result[0]);
            return user;
        }
        return nullptr;
    } catch (const std::exception& e) {
        std::cerr << "Error buscando usuario por email: " << e.what() << std::endl;
        return nullptr;
    }
}

std::shared_ptr<User> User::findByUsername(drogon::orm::DbClientPtr db_client, const std::string& username) {
    try {
        std::string sql = "SELECT id, email, username, password_hash, first_name, last_name, phone, is_active, is_verified, created_at, updated_at FROM users WHERE username = $1";
        auto result = db_client->execSqlSync(sql, username);
        
        if (!result.empty()) {
            auto user = std::make_shared<User>();
            user->fromDbRow(result[0]);
            return user;
        }
        return nullptr;
    } catch (const std::exception& e) {
        std::cerr << "Error buscando usuario por username: " << e.what() << std::endl;
        return nullptr;
    }
}

std::vector<std::shared_ptr<User>> User::findAll(drogon::orm::DbClientPtr db_client, int limit, int offset) {
    std::vector<std::shared_ptr<User>> users;
    
    try {
        // Primero probamos sin límite y offset para ver si el problema está en los parámetros
        std::string sql = "SELECT id, email, username, password_hash, first_name, last_name, phone, is_active, is_verified, created_at, updated_at FROM users ORDER BY created_at DESC";
        
        // Si limit > 0, agregamos LIMIT
        if (limit > 0) {
            sql += " LIMIT " + std::to_string(limit);
        }
        
        // Si offset > 0, agregamos OFFSET
        if (offset > 0) {
            sql += " OFFSET " + std::to_string(offset);
        }
        
        auto result = db_client->execSqlSync(sql);
        
        for (const auto& row : result) {
            auto user = std::make_shared<User>();
            user->fromDbRow(row);
            users.push_back(user);
        }
    } catch (const std::exception& e) {
        std::cerr << "Error obteniendo usuarios: " << e.what() << std::endl;
    }
    
    return users;
}

void User::fromDbRow(const drogon::orm::Row& row) {
    id_ = row["id"].as<int>();
    email_ = row["email"].as<std::string>();
    username_ = row["username"].as<std::string>();
    password_hash_ = row["password_hash"].as<std::string>();
    first_name_ = row["first_name"].as<std::string>();
    last_name_ = row["last_name"].as<std::string>();
    phone_ = row["phone"].as<std::string>();
    is_active_ = row["is_active"].as<bool>();
    is_verified_ = row["is_verified"].as<bool>();
    // Timestamps simplificados para evitar problemas de compilación
    created_at_ = std::chrono::system_clock::now();
    updated_at_ = std::chrono::system_clock::now();
}

Json::Value User::toJson() const {
    Json::Value json;
    json["id"] = id_;
    json["email"] = email_;
    json["username"] = username_;
    json["first_name"] = first_name_;
    json["last_name"] = last_name_;
    json["phone"] = phone_;
    json["is_active"] = is_active_;
    json["is_verified"] = is_verified_;
    
    // Convertir timestamps a string ISO 8601 (versión simplificada)
    auto time_t_created = std::chrono::system_clock::to_time_t(created_at_);
    auto time_t_updated = std::chrono::system_clock::to_time_t(updated_at_);
    
    // Usar ctime para formato simple
    std::string created_str = std::ctime(&time_t_created);
    std::string updated_str = std::ctime(&time_t_updated);
    
    // Remover el newline al final
    if (!created_str.empty() && created_str.back() == '\n') created_str.pop_back();
    if (!updated_str.empty() && updated_str.back() == '\n') updated_str.pop_back();
    
    json["created_at"] = created_str;
    json["updated_at"] = updated_str;
    
    return json;
}

std::shared_ptr<User> User::fromJson(const Json::Value& json) {
    auto user = std::make_shared<User>();
    
    if (json.isMember("email")) user->email_ = json["email"].asString();
    if (json.isMember("username")) user->username_ = json["username"].asString();
    if (json.isMember("first_name")) user->first_name_ = json["first_name"].asString();
    if (json.isMember("last_name")) user->last_name_ = json["last_name"].asString();
    if (json.isMember("phone")) user->phone_ = json["phone"].asString();
    if (json.isMember("is_active")) user->is_active_ = json["is_active"].asBool();
    if (json.isMember("is_verified")) user->is_verified_ = json["is_verified"].asBool();
    if (json.isMember("password")) user->setPassword(json["password"].asString());
    
    return user;
}

bool User::isValidEmail(const std::string& email) {
    std::regex email_regex(R"(^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$)");
    return std::regex_match(email, email_regex);
}

bool User::isValidUsername(const std::string& username) {
    // Username debe tener entre 3-50 caracteres, solo letras, números y guiones bajos
    if (username.length() < 3 || username.length() > 50) {
        return false;
    }
    std::regex username_regex(R"(^[a-zA-Z0-9_]+$)");
    return std::regex_match(username, username_regex);
}

bool User::isValidPassword(const std::string& password) {
    // Password debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número
    if (password.length() < 8) {
        return false;
    }
    
    bool has_upper = false, has_lower = false, has_digit = false;
    for (char c : password) {
        if (std::isupper(c)) has_upper = true;
        if (std::islower(c)) has_lower = true;
        if (std::isdigit(c)) has_digit = true;
    }
    
    return has_upper && has_lower && has_digit;
}

} // namespace models
} // namespace bustracksv
