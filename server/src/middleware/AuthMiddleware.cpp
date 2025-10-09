#include "AuthMiddleware.h"

namespace bustracksv {
namespace middleware {

void AuthMiddleware::doFilter(const drogon::HttpRequestPtr& req,
                             drogon::FilterCallback&& fcb,
                             drogon::FilterChainCallback&& fccb) {
    // Por ahora, este middleware no hace nada
    // Se puede implementar autenticación JWT aquí en el futuro
    fccb();
}

} // namespace middleware
} // namespace bustracksv
