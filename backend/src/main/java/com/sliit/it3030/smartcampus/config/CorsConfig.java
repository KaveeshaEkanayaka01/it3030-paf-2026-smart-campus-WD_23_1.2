package com.sliit.it3030.smartcampus.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Allow local dev hosts (Vite may select different localhost ports)
        String[] allowedOrigins = new String[] {"http://localhost:*", "http://127.0.0.1:*"};

        registry.addMapping("/api/**")
            .allowedOriginPatterns(allowedOrigins)
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);

        // Also allow OAuth2 endpoints during local development
        registry.addMapping("/oauth2/**")
            .allowedOriginPatterns(allowedOrigins)
            .allowedMethods("GET", "POST", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
    }
}