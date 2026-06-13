package com.inventory.inventory.security;

import com.inventory.inventory.service.RateLimiteService;

import io.github.bucket4j.Bucket;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;


@Component
public class RateLimiteFilter extends OncePerRequestFilter {

    private final RateLimiteService rateLimiteService;

    public RateLimiteFilter(RateLimiteService rateLimiteService) {
        this.rateLimiteService = rateLimiteService;
    }


    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return !(path.startsWith("/api/auth/login") || path.startsWith("/api/auth/register"));
    }

    @Override
    public void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String ip = clientIp(request);


        Bucket bucket = request.getRequestURI().endsWith("/login")
                ? rateLimiteService.resolveLoginBucket(ip)
                : rateLimiteService.resolveRegisterBucket(ip)  ;


        if (bucket.tryConsume(1)){
            filterChain.doFilter(request, response);
        }else {
            response.setStatus(429);
            response.setContentType("text/plain");
            response.getWriter().write("Too many requests, try again later");
        }
    }

    public String clientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
