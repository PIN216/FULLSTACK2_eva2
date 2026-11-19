package com.pasteleria.security;

import com.pasteleria.repository.UsuarioRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Configuración central de Spring Security con autenticación JWT y control de acceso basado en roles.
 * Cumple con los requerimientos del Anexo 1 (Evaluación Parcial 3):
 * - Administrador: Acceso total al sistema.
 * - Vendedor: Puede visualizar lista de productos/detalle y órdenes/detalle.
 * - Cliente: Acceso a la tienda (catálogo y emisión de pedidos).
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public UserDetailsService userDetailsService(UsuarioRepository usuarioRepository) {
        return username -> usuarioRepository.findByCorreoIgnoreCase(username)
                .map(u -> {
                    String rol = u.getRol() != null ? u.getRol().toUpperCase().trim().replace("ROLE_", "") : "CLIENTE";
                    if ("ADMIN".equals(rol)) {
                        rol = "ADMINISTRADOR";
                    }
                    return User.builder()
                            .username(u.getCorreo())
                            .password(u.getPassword() != null ? u.getPassword() : "")
                            .roles(rol)
                            .build();
                })
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.getWriter().write("{\"status\":401,\"error\":\"No autorizado\",\"mensaje\":\"Se requiere token JWT valido para acceder a este recurso.\"}");
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.getWriter().write("{\"status\":403,\"error\":\"Acceso denegado\",\"mensaje\":\"Su rol no posee permisos suficientes para esta operacion.\"}");
                        })
                )
                .authorizeHttpRequests(auth -> auth
                        // Endpoints públicos de Swagger / OpenAPI y consola H2
                        .requestMatchers(
                                "/swagger-ui.html",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-resources/**",
                                "/webjars/**",
                                "/h2-console/**"
                        ).permitAll()

                        // Endpoints de Autenticación y Registro (Públicos)
                        .requestMatchers(
                                "/api/v1/auth",
                                "/api/v1/auth/**",
                                "/api/auth",
                                "/api/auth/**",
                                "/api/usuarios/login",
                                "/api/usuarios/registro"
                        ).permitAll()

                        // Catálogo de Productos y Categorías (Lectura Pública)
                        .requestMatchers(HttpMethod.GET,
                                "/api/v1/productos", "/api/v1/productos/**",
                                "/api/productos", "/api/productos/**"
                        ).permitAll()
                        .requestMatchers(HttpMethod.GET,
                                "/api/v1/categorias", "/api/v1/categorias/**",
                                "/api/categorias", "/api/categorias/**"
                        ).permitAll()

                        // Creación de Órdenes / Boletas (Clientes o anónimos en checkout)
                        .requestMatchers(HttpMethod.POST,
                                "/api/v1/ordenes", "/api/v1/ordenes/**",
                                "/api/ordenes", "/api/ordenes/**",
                                "/api/v1/boletas", "/api/v1/boletas/**",
                                "/api/boletas", "/api/boletas/**"
                        ).permitAll()

                        // Consulta de Órdenes / Boletas: Permitido para Administrador y Vendedor
                        .requestMatchers(HttpMethod.GET,
                                "/api/v1/ordenes", "/api/v1/ordenes/**",
                                "/api/ordenes", "/api/ordenes/**",
                                "/api/v1/boletas", "/api/v1/boletas/**",
                                "/api/boletas", "/api/boletas/**"
                        ).hasAnyRole("ADMINISTRADOR", "ADMIN", "VENDEDOR")

                        // Operaciones de Modificación de Catálogo (Solo Administrador)
                        .requestMatchers(HttpMethod.POST,
                                "/api/v1/productos", "/api/v1/productos/**",
                                "/api/productos", "/api/productos/**"
                        ).hasAnyRole("ADMINISTRADOR", "ADMIN")
                        .requestMatchers(HttpMethod.PUT,
                                "/api/v1/productos", "/api/v1/productos/**",
                                "/api/productos", "/api/productos/**"
                        ).hasAnyRole("ADMINISTRADOR", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE,
                                "/api/v1/productos", "/api/v1/productos/**",
                                "/api/productos", "/api/productos/**"
                        ).hasAnyRole("ADMINISTRADOR", "ADMIN")

                        // Operaciones de Categorías (Solo Administrador)
                        .requestMatchers(HttpMethod.POST,
                                "/api/v1/categorias", "/api/v1/categorias/**",
                                "/api/categorias", "/api/categorias/**"
                        ).hasAnyRole("ADMINISTRADOR", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE,
                                "/api/v1/categorias", "/api/v1/categorias/**",
                                "/api/categorias", "/api/categorias/**"
                        ).hasAnyRole("ADMINISTRADOR", "ADMIN")

                        // Gestión de Usuarios (Solo Administrador)
                        .requestMatchers(
                                "/api/v1/usuarios", "/api/v1/usuarios/**",
                                "/api/usuarios", "/api/usuarios/**"
                        ).hasAnyRole("ADMINISTRADOR", "ADMIN")

                        // Cualquier otra petición debe estar autenticada
                        .anyRequest().authenticated()
                );

        // Permitir frames para la consola H2
        http.headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()));

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept", "X-Requested-With"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
