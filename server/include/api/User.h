#pragma once

#include <string>
#include <chrono>
#include <drogon/drogon.h>
#include <drogon/orm/DbClient.h>
#include <json/json.h>

namespace bustracksv {
namespace models {

class User {
public:
    // Constructor
    User();
    User(const std::string& email, const std::string& username, 
         const std::string& password, const std::string& first_name, 
         const std::string& last_name, const std::string& phone = "");
    
    // Getters
    int getId() const { return id_; }
    std::string getEmail() const { return email_; }
    std::string getUsername() const { return username_; }
    std::string getFirstName() const { return first_name_; }
    std::string getLastName() const { return last_name_; }
    std::string getPhone() const { return phone_; }
    bool isActive() const { return is_active_; }
    bool isVerified() const { return is_verified_; }
    std::chrono::system_clock::time_point getCreatedAt() const { return created_at_; }
    std::chrono::system_clock::time_point getUpdatedAt() const { return updated_at_; }
    
    // Setters
    void setEmail(const std::string& email) { email_ = email; }
    void setUsername(const std::string& username) { username_ = username; }
    void setFirstName(const std::string& first_name) { first_name_ = first_name; }
    void setLastName(const std::string& last_name) { last_name_ = last_name; }
    void setPhone(const std::string& phone) { phone_ = phone; }
    void setActive(bool active) { is_active_ = active; }
    void setVerified(bool verified) { is_verified_ = verified; }
    
    // Métodos de base de datos
    bool save(drogon::orm::DbClientPtr db_client);
    bool update(drogon::orm::DbClientPtr db_client);
    bool remove(drogon::orm::DbClientPtr db_client);
    
    // Métodos estáticos para consultas
    static std::shared_ptr<User> findById(drogon::orm::DbClientPtr db_client, int id);
    static std::shared_ptr<User> findByEmail(drogon::orm::DbClientPtr db_client, const std::string& email);
    static std::shared_ptr<User> findByUsername(drogon::orm::DbClientPtr db_client, const std::string& username);
    static std::vector<std::shared_ptr<User>> findAll(drogon::orm::DbClientPtr db_client, int limit = 100, int offset = 0);
    
    // Métodos de utilidad
    void setPassword(const std::string& password);
    bool verifyPassword(const std::string& password) const;
    Json::Value toJson() const;
    static std::shared_ptr<User> fromJson(const Json::Value& json);
    
    // Validaciones
    static bool isValidEmail(const std::string& email);
    static bool isValidUsername(const std::string& username);
    static bool isValidPassword(const std::string& password);

private:
    int id_;
    std::string email_;
    std::string username_;
    std::string password_hash_;
    std::string first_name_;
    std::string last_name_;
    std::string phone_;
    bool is_active_;
    bool is_verified_;
    std::chrono::system_clock::time_point created_at_;
    std::chrono::system_clock::time_point updated_at_;
    
    // Métodos privados
    std::string hashPassword(const std::string& password) const;
    void fromDbRow(const drogon::orm::Row& row);
};

} // namespace models
} // namespace bustracksv
