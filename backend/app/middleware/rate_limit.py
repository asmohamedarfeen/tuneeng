"""
Rate limiting middleware for FastAPI.
Prevents brute-force attacks and abuse.
"""

from collections import defaultdict
from datetime import datetime, timedelta
from typing import Dict, Tuple
from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware


class RateLimiter:
    """Simple in-memory rate limiter for development/testing."""
    
    def __init__(self):
        self.requests: Dict[str, list] = defaultdict(list)
        self.cleanup_interval = timedelta(minutes=5)
        self.last_cleanup = datetime.now()
    
    def is_allowed(self, key: str, max_requests: int, window_seconds: int) -> Tuple[bool, int]:
        """
        Check if request is allowed.
        
        Returns:
            (is_allowed, remaining_requests)
        """
        now = datetime.now()
        
        # Cleanup old entries periodically
        if now - self.last_cleanup > self.cleanup_interval:
            self._cleanup(now)
            self.last_cleanup = now
        
        # Get requests in the time window
        window_start = now - timedelta(seconds=window_seconds)
        recent_requests = [
            req_time for req_time in self.requests[key]
            if req_time > window_start
        ]
        
        # Update stored requests
        self.requests[key] = recent_requests
        
        # Check if limit exceeded
        if len(recent_requests) >= max_requests:
            return False, 0
        
        return True, max_requests - len(recent_requests)
    
    def _cleanup(self, now: datetime):
        """Remove old entries to prevent memory leak."""
        cutoff = now - timedelta(hours=1)
        keys_to_remove = []
        
        for key, requests in self.requests.items():
            self.requests[key] = [r for r in requests if r > cutoff]
            if not self.requests[key]:
                keys_to_remove.append(key)
        
        for key in keys_to_remove:
            del self.requests[key]


# Global rate limiter instance
rate_limiter = RateLimiter()


def get_client_ip(request: Request) -> str:
    """Extract client IP address from request."""
    # Check for forwarded IP (if behind proxy)
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    
    # Check for real IP header
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip
    
    # Fallback to direct client IP
    if request.client:
        return request.client.host
    
    return "unknown"


def rate_limit(max_requests: int = 5, window_seconds: int = 900):
    """
    Rate limit decorator for endpoints.
    
    Args:
        max_requests: Maximum number of requests allowed
        window_seconds: Time window in seconds (default 15 minutes)
    """
    async def rate_limit_middleware(request: Request, call_next):
        # Only apply rate limiting to auth endpoints
        if request.url.path.startswith("/api/auth/login") or request.url.path.startswith("/api/auth/register"):
            client_ip = get_client_ip(request)
            endpoint = request.url.path
            
            # Create unique key for this IP + endpoint
            key = f"{client_ip}:{endpoint}"
            
            is_allowed, remaining = rate_limiter.is_allowed(key, max_requests, window_seconds)
            
            if not is_allowed:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=f"Too many requests. Please try again later. Limit: {max_requests} requests per {window_seconds // 60} minutes.",
                    headers={"Retry-After": str(window_seconds)},
                )
            
            # Add remaining count to response headers
            response = await call_next(request)
            response.headers["X-RateLimit-Limit"] = str(max_requests)
            response.headers["X-RateLimit-Remaining"] = str(remaining)
            response.headers["X-RateLimit-Reset"] = str(int((datetime.now() + timedelta(seconds=window_seconds)).timestamp()))
            return response
        
        return await call_next(request)
    
    return rate_limit_middleware


class RateLimitMiddleware(BaseHTTPMiddleware):
    """FastAPI middleware for rate limiting."""
    
    async def dispatch(self, request: Request, call_next):
        # Apply rate limiting to auth endpoints
        if request.url.path.startswith("/api/auth/login") or request.url.path.startswith("/api/auth/register"):
            client_ip = get_client_ip(request)
            endpoint = request.url.path
            key = f"{client_ip}:{endpoint}"
            
            # 5 requests per 15 minutes for auth endpoints
            is_allowed, remaining = rate_limiter.is_allowed(key, max_requests=5, window_seconds=900)
            
            if not is_allowed:
                from fastapi.responses import JSONResponse
                return JSONResponse(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    content={
                        "detail": "Too many authentication attempts. Please try again in 15 minutes."
                    },
                    headers={"Retry-After": "900"},
                )
            
            response = await call_next(request)
            response.headers["X-RateLimit-Limit"] = "5"
            response.headers["X-RateLimit-Remaining"] = str(remaining)
            return response
        
        return await call_next(request)

