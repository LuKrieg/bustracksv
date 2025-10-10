#pragma once

#include <drogon/drogon.h>
#include <drogon/HttpFilter.h>

namespace bustracksv {
namespace middleware {

class AuthMiddleware : public drogon::HttpFilter<AuthMiddleware> {
public:
    virtual void doFilter(const drogon::HttpRequestPtr& req,
                         drogon::FilterCallback&& fcb,
                         drogon::FilterChainCallback&& fccb) override;
};

} // namespace middleware
} // namespace bustracksv
