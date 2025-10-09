#pragma once

#include <string>
#include <vector>
#include <json/json.h>

namespace bustracksv {
namespace utils {

struct ValidationError {
    std::string field;
    std::string message;
    
    ValidationError(const std::string& f, const std::string& m) 
        : field(f), message(m) {}
};

class ValidationUtils {
public:
    // Validaciones de campos
    static bool isRequired(const std::string& value);
    static bool isEmail(const std::string& email);
    static bool isUsername(const std::string& username);
    static bool isPassword(const std::string& password);
    static bool isPhone(const std::string& phone);
    static bool isLength(const std::string& value, size_t min, size_t max);
    static bool isNumeric(const std::string& value);
    static bool isPositive(const std::string& value);
    
    // Validación de usuario
    static std::vector<ValidationError> validateUser(const Json::Value& user_data);
    static std::vector<ValidationError> validateUserUpdate(const Json::Value& user_data);
    static std::vector<ValidationError> validateUserLogin(const Json::Value& login_data);
    
    // Validación de paginación
    static std::vector<ValidationError> validatePagination(int page, int limit);
    
    // Convertir errores a JSON
    static Json::Value errorsToJson(const std::vector<ValidationError>& errors);
    
    // Validar JSON requerido
    static bool hasRequiredFields(const Json::Value& json, const std::vector<std::string>& required_fields);
    
    // Limpiar y validar string
    static std::string trimString(const std::string& str);
    static bool isEmpty(const std::string& str);

private:
    static const std::string EMAIL_REGEX;
    static const std::string USERNAME_REGEX;
    static const std::string PHONE_REGEX;
};

} // namespace utils
} // namespace bustracksv
