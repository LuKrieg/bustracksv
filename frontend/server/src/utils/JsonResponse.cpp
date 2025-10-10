#include "JsonResponse.h"

namespace bustracksv {
namespace utils {

void JsonResponse::success(drogon::HttpResponsePtr& resp, const Json::Value& data, 
                          const std::string& message, int status_code) {
    Json::Value response;
    response["success"] = true;
    response["message"] = message;
    response["status_code"] = status_code;
    
    if (data != Json::Value::null) {
        response["data"] = data;
    }
    
    setJsonResponse(resp, status_code, response);
}

void JsonResponse::created(drogon::HttpResponsePtr& resp, const Json::Value& data, 
                          const std::string& message) {
    success(resp, data, message, 201);
}

void JsonResponse::ok(drogon::HttpResponsePtr& resp, const Json::Value& data, 
                     const std::string& message) {
    success(resp, data, message, 200);
}

void JsonResponse::badRequest(drogon::HttpResponsePtr& resp, const std::string& message) {
    Json::Value response;
    response["success"] = false;
    response["message"] = message;
    response["status_code"] = 400;
    setJsonResponse(resp, 400, response);
}

void JsonResponse::unauthorized(drogon::HttpResponsePtr& resp, const std::string& message) {
    Json::Value response;
    response["success"] = false;
    response["message"] = message;
    response["status_code"] = 401;
    setJsonResponse(resp, 401, response);
}

void JsonResponse::forbidden(drogon::HttpResponsePtr& resp, const std::string& message) {
    Json::Value response;
    response["success"] = false;
    response["message"] = message;
    response["status_code"] = 403;
    setJsonResponse(resp, 403, response);
}

void JsonResponse::notFound(drogon::HttpResponsePtr& resp, const std::string& message) {
    Json::Value response;
    response["success"] = false;
    response["message"] = message;
    response["status_code"] = 404;
    setJsonResponse(resp, 404, response);
}

void JsonResponse::conflict(drogon::HttpResponsePtr& resp, const std::string& message) {
    Json::Value response;
    response["success"] = false;
    response["message"] = message;
    response["status_code"] = 409;
    setJsonResponse(resp, 409, response);
}

void JsonResponse::internalError(drogon::HttpResponsePtr& resp, const std::string& message) {
    Json::Value response;
    response["success"] = false;
    response["message"] = message;
    response["status_code"] = 500;
    setJsonResponse(resp, 500, response);
}

void JsonResponse::validationError(drogon::HttpResponsePtr& resp, const Json::Value& errors) {
    Json::Value response;
    response["success"] = false;
    response["message"] = "Validation failed";
    response["status_code"] = 422;
    response["errors"] = errors;
    setJsonResponse(resp, 422, response);
}

void JsonResponse::custom(drogon::HttpResponsePtr& resp, int status_code, const Json::Value& data, 
                         const std::string& message) {
    Json::Value response;
    response["success"] = (status_code >= 200 && status_code < 300);
    response["status_code"] = status_code;
    
    if (!message.empty()) {
        response["message"] = message;
    }
    
    if (data != Json::Value::null) {
        response["data"] = data;
    }
    
    setJsonResponse(resp, status_code, response);
}

void JsonResponse::setJsonResponse(drogon::HttpResponsePtr& resp, int status_code, 
                                  const Json::Value& response_data) {
    resp = drogon::HttpResponse::newHttpJsonResponse(response_data);
    resp->setStatusCode(drogon::k200OK);
    
    // Establecer el código de estado correcto
    switch (status_code) {
        case 201:
            resp->setStatusCode(drogon::k201Created);
            break;
        case 400:
            resp->setStatusCode(drogon::k400BadRequest);
            break;
        case 401:
            resp->setStatusCode(drogon::k401Unauthorized);
            break;
        case 403:
            resp->setStatusCode(drogon::k403Forbidden);
            break;
        case 404:
            resp->setStatusCode(drogon::k404NotFound);
            break;
        case 409:
            resp->setStatusCode(drogon::k409Conflict);
            break;
        case 422:
            resp->setStatusCode(drogon::k422UnprocessableEntity);
            break;
        case 500:
            resp->setStatusCode(drogon::k500InternalServerError);
            break;
        default:
            resp->setStatusCode(drogon::k200OK);
            break;
    }
}

} // namespace utils
} // namespace bustracksv
