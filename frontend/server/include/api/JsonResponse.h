#pragma once

#include <drogon/drogon.h>
#include <json/json.h>

namespace bustracksv {
namespace utils {

class JsonResponse {
public:
    // Respuestas exitosas
    static void success(drogon::HttpResponsePtr& resp, const Json::Value& data = Json::Value::null, 
                       const std::string& message = "Success", int status_code = 200);
    
    static void created(drogon::HttpResponsePtr& resp, const Json::Value& data = Json::Value::null, 
                       const std::string& message = "Created");
    
    static void ok(drogon::HttpResponsePtr& resp, const Json::Value& data = Json::Value::null, 
                   const std::string& message = "OK");
    
    // Respuestas de error
    static void badRequest(drogon::HttpResponsePtr& resp, const std::string& message = "Bad Request");
    
    static void unauthorized(drogon::HttpResponsePtr& resp, const std::string& message = "Unauthorized");
    
    static void forbidden(drogon::HttpResponsePtr& resp, const std::string& message = "Forbidden");
    
    static void notFound(drogon::HttpResponsePtr& resp, const std::string& message = "Not Found");
    
    static void conflict(drogon::HttpResponsePtr& resp, const std::string& message = "Conflict");
    
    static void internalError(drogon::HttpResponsePtr& resp, const std::string& message = "Internal Server Error");
    
    static void validationError(drogon::HttpResponsePtr& resp, const Json::Value& errors);
    
    // Respuesta personalizada
    static void custom(drogon::HttpResponsePtr& resp, int status_code, const Json::Value& data, 
                      const std::string& message = "");

private:
    static void setJsonResponse(drogon::HttpResponsePtr& resp, int status_code, 
                               const Json::Value& response_data);
};

} // namespace utils
} // namespace bustracksv
