#include "ValidationUtils.h"
#include <regex>
#include <algorithm>
#include <sstream>

namespace bustracksv {
namespace utils {

const std::string ValidationUtils::EMAIL_REGEX = R"(^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$)";
const std::string ValidationUtils::USERNAME_REGEX = R"(^[a-zA-Z0-9_]{3,50}$)";
const std::string ValidationUtils::PHONE_REGEX = R"(^\+?[1-9]\d{1,14}$)";

bool ValidationUtils::isRequired(const std::string& value) {
    return !trimString(value).empty();
}

bool ValidationUtils::isEmail(const std::string& email) {
    std::regex email_regex(EMAIL_REGEX);
    return std::regex_match(email, email_regex);
}

bool ValidationUtils::isUsername(const std::string& username) {
    std::regex username_regex(USERNAME_REGEX);
    return std::regex_match(username, username_regex);
}

bool ValidationUtils::isPassword(const std::string& password) {
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

bool ValidationUtils::isPhone(const std::string& phone) {
    if (phone.empty()) return true; // Phone es opcional
    std::regex phone_regex(PHONE_REGEX);
    return std::regex_match(phone, phone_regex);
}

bool ValidationUtils::isLength(const std::string& value, size_t min, size_t max) {
    return value.length() >= min && value.length() <= max;
}

bool ValidationUtils::isNumeric(const std::string& value) {
    return !value.empty() && std::all_of(value.begin(), value.end(), ::isdigit);
}

bool ValidationUtils::isPositive(const std::string& value) {
    if (!isNumeric(value)) return false;
    int num = std::stoi(value);
    return num > 0;
}

std::vector<ValidationError> ValidationUtils::validateUser(const Json::Value& user_data) {
    std::vector<ValidationError> errors;
    
    // Validar email
    if (!user_data.isMember("email")) {
        errors.emplace_back("email", "Email es requerido");
    } else {
        std::string email = user_data["email"].asString();
        if (!isRequired(email)) {
            errors.emplace_back("email", "Email es requerido");
        } else if (!isEmail(email)) {
            errors.emplace_back("email", "Email debe tener un formato válido");
        }
    }
    
    // Validar username
    if (!user_data.isMember("username")) {
        errors.emplace_back("username", "Username es requerido");
    } else {
        std::string username = user_data["username"].asString();
        if (!isRequired(username)) {
            errors.emplace_back("username", "Username es requerido");
        } else if (!isUsername(username)) {
            errors.emplace_back("username", "Username debe tener entre 3-50 caracteres y solo contener letras, números y guiones bajos");
        }
    }
    
    // Validar password
    if (!user_data.isMember("password")) {
        errors.emplace_back("password", "Password es requerido");
    } else {
        std::string password = user_data["password"].asString();
        if (!isRequired(password)) {
            errors.emplace_back("password", "Password es requerido");
        } else if (!isPassword(password)) {
            errors.emplace_back("password", "Password debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número");
        }
    }
    
    // Validar first_name
    if (!user_data.isMember("first_name")) {
        errors.emplace_back("first_name", "Nombre es requerido");
    } else {
        std::string first_name = user_data["first_name"].asString();
        if (!isRequired(first_name)) {
            errors.emplace_back("first_name", "Nombre es requerido");
        } else if (!isLength(first_name, 1, 100)) {
            errors.emplace_back("first_name", "Nombre debe tener entre 1-100 caracteres");
        }
    }
    
    // Validar last_name
    if (!user_data.isMember("last_name")) {
        errors.emplace_back("last_name", "Apellido es requerido");
    } else {
        std::string last_name = user_data["last_name"].asString();
        if (!isRequired(last_name)) {
            errors.emplace_back("last_name", "Apellido es requerido");
        } else if (!isLength(last_name, 1, 100)) {
            errors.emplace_back("last_name", "Apellido debe tener entre 1-100 caracteres");
        }
    }
    
    // Validar phone (opcional)
    if (user_data.isMember("phone")) {
        std::string phone = user_data["phone"].asString();
        if (!phone.empty() && !isPhone(phone)) {
            errors.emplace_back("phone", "Teléfono debe tener un formato válido");
        }
    }
    
    return errors;
}

std::vector<ValidationError> ValidationUtils::validateUserUpdate(const Json::Value& user_data) {
    std::vector<ValidationError> errors;
    
    // Validar email si está presente
    if (user_data.isMember("email")) {
        std::string email = user_data["email"].asString();
        if (!isRequired(email)) {
            errors.emplace_back("email", "Email no puede estar vacío");
        } else if (!isEmail(email)) {
            errors.emplace_back("email", "Email debe tener un formato válido");
        }
    }
    
    // Validar username si está presente
    if (user_data.isMember("username")) {
        std::string username = user_data["username"].asString();
        if (!isRequired(username)) {
            errors.emplace_back("username", "Username no puede estar vacío");
        } else if (!isUsername(username)) {
            errors.emplace_back("username", "Username debe tener entre 3-50 caracteres y solo contener letras, números y guiones bajos");
        }
    }
    
    // Validar password si está presente
    if (user_data.isMember("password")) {
        std::string password = user_data["password"].asString();
        if (!isRequired(password)) {
            errors.emplace_back("password", "Password no puede estar vacío");
        } else if (!isPassword(password)) {
            errors.emplace_back("password", "Password debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número");
        }
    }
    
    // Validar first_name si está presente
    if (user_data.isMember("first_name")) {
        std::string first_name = user_data["first_name"].asString();
        if (!isRequired(first_name)) {
            errors.emplace_back("first_name", "Nombre no puede estar vacío");
        } else if (!isLength(first_name, 1, 100)) {
            errors.emplace_back("first_name", "Nombre debe tener entre 1-100 caracteres");
        }
    }
    
    // Validar last_name si está presente
    if (user_data.isMember("last_name")) {
        std::string last_name = user_data["last_name"].asString();
        if (!isRequired(last_name)) {
            errors.emplace_back("last_name", "Apellido no puede estar vacío");
        } else if (!isLength(last_name, 1, 100)) {
            errors.emplace_back("last_name", "Apellido debe tener entre 1-100 caracteres");
        }
    }
    
    // Validar phone si está presente
    if (user_data.isMember("phone")) {
        std::string phone = user_data["phone"].asString();
        if (!phone.empty() && !isPhone(phone)) {
            errors.emplace_back("phone", "Teléfono debe tener un formato válido");
        }
    }
    
    return errors;
}

std::vector<ValidationError> ValidationUtils::validateUserLogin(const Json::Value& login_data) {
    std::vector<ValidationError> errors;
    
    // Validar email o username
    if (!login_data.isMember("email") && !login_data.isMember("username")) {
        errors.emplace_back("login", "Email o username es requerido");
    } else {
        if (login_data.isMember("email")) {
            std::string email = login_data["email"].asString();
            if (!isRequired(email)) {
                errors.emplace_back("email", "Email es requerido");
            } else if (!isEmail(email)) {
                errors.emplace_back("email", "Email debe tener un formato válido");
            }
        }
        
        if (login_data.isMember("username")) {
            std::string username = login_data["username"].asString();
            if (!isRequired(username)) {
                errors.emplace_back("username", "Username es requerido");
            }
        }
    }
    
    // Validar password
    if (!login_data.isMember("password")) {
        errors.emplace_back("password", "Password es requerido");
    } else {
        std::string password = login_data["password"].asString();
        if (!isRequired(password)) {
            errors.emplace_back("password", "Password es requerido");
        }
    }
    
    return errors;
}

std::vector<ValidationError> ValidationUtils::validatePagination(int page, int limit) {
    std::vector<ValidationError> errors;
    
    if (page < 1) {
        errors.emplace_back("page", "Página debe ser mayor a 0");
    }
    
    if (limit < 1 || limit > 100) {
        errors.emplace_back("limit", "Límite debe estar entre 1 y 100");
    }
    
    return errors;
}

Json::Value ValidationUtils::errorsToJson(const std::vector<ValidationError>& errors) {
    Json::Value json_errors(Json::arrayValue);
    
    for (const auto& error : errors) {
        Json::Value error_obj;
        error_obj["field"] = error.field;
        error_obj["message"] = error.message;
        json_errors.append(error_obj);
    }
    
    return json_errors;
}

bool ValidationUtils::hasRequiredFields(const Json::Value& json, const std::vector<std::string>& required_fields) {
    for (const auto& field : required_fields) {
        if (!json.isMember(field)) {
            return false;
        }
    }
    return true;
}

std::string ValidationUtils::trimString(const std::string& str) {
    size_t first = str.find_first_not_of(' ');
    if (first == std::string::npos) {
        return "";
    }
    size_t last = str.find_last_not_of(' ');
    return str.substr(first, (last - first + 1));
}

bool ValidationUtils::isEmpty(const std::string& str) {
    return trimString(str).empty();
}

} // namespace utils
} // namespace bustracksv
