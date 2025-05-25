package com.kma.shop.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;

@Configuration
public class CustomFilter implements Filter {
    private static final Logger logger = LoggerFactory.getLogger(CustomFilter.class);

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        logger.info("📌 Incoming request: [{}] {}", req.getMethod(), req.getRequestURI());

        try {
            chain.doFilter(request, response);
        } catch (Exception e) {
            logger.error("❌ Error processing request: [{}] {} | Status: {}",
                    req.getMethod(), req.getRequestURI(), res.getStatus(), e);
        }

        logger.info("✅ Completed request: [{}] {} | Status: {}",
                req.getMethod(), req.getRequestURI(), res.getStatus());
    }
}
