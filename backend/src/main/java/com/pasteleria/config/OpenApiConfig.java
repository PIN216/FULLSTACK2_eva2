package com.pasteleria.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Configuración de OpenAPI 3 / Swagger UI para documentar interactivamente todos
 * los endpoints de la API REST de la Pastelería Mil Sabores.
 * Cumple con el criterio IE3.2.1 de la Evaluación Parcial 3.
 */
@Configuration
public class OpenApiConfig {

    public static final String SECURITY_SCHEME_NAME = "Bearer Authentication";

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Pastelería Mil Sabores - API RESTful v1")
                        .description("API REST para la integración Fullstack de la tienda online Pastelería Mil Sabores. " +
                                "Permite operaciones CRUD para catálogo, categorías, boletas/órdenes y usuarios, " +
                                "con seguridad basada en tokens JWT y control de roles (Administrador, Vendedor, Cliente).")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Equipo de Desarrollo Fullstack II - Duoc UC")
                                .email("contacto@milsabores.cl")
                                .url("https://www.milsabores.cl"))
                        .license(new License()
                                .name("Educativa Duoc UC")
                                .url("https://www.duoc.cl")))
                .servers(List.of(
                        new Server().url("http://localhost:9091").description("Servidor de Desarrollo Local")
                ))
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME, new SecurityScheme()
                                .name(SECURITY_SCHEME_NAME)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Ingrese su token JWT generado en /api/v1/auth/login con el prefijo Bearer.")
                        ));
    }
}

