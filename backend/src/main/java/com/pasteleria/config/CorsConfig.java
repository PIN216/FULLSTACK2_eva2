package com.pasteleria.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuración global de CORS (Cross-Origin Resource Sharing).
 * Habilita el intercambio de recursos entre el servidor backend (Spring Boot en puerto 9091)
 * y la aplicación cliente (React Frontend en puerto 3000).
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    /**
     * Mapea todas las rutas /api/** permitiendo peticiones HTTP desde cualquier origen.
     * Permite los métodos estándar de una API RESTful (GET, POST, PUT, DELETE, OPTIONS).
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
    }
}
