package com.kma.shop.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String path = httpRequest.getRequestURI();
        System.err.println(path);
        if (path.startsWith("/shop/api/v1/swagger-ui") || path.startsWith("/shop/api/v1/v3/api-docs")) {
            chain.doFilter(request, response); // Bỏ qua xác thực
            return;
        }
        // Logic xác thực khác
        chain.doFilter(request, response);
    }
}