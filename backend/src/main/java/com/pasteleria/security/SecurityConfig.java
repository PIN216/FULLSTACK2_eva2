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
 * Configuración central de Spring Security con autenticación JWT y control de
 * acceso basado en roles.
 *
 * ROLES del sistema (normalizados, siempre en mayúsculas):
 * - ADMINISTRADOR : acceso total (CRUD catálogo, usuarios, órdenes)
 * - VENDEDOR : lectura de productos, categorías y órdenes (sin escritura)
 * - CLIENTE : puede leer catálogo y crear órdenes (checkout)
 *
 * IMPORTANTE: El orden de las reglas de Spring Security es PRIORITARIO.
 * Las reglas más específicas deben ir antes que las más generales.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthenticationFilter;

        public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
                this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        }

        /**
         * UserDetailsService para validación interna de Spring Security.
         * Normaliza el rol desde la BD al formato ROLE_XXX que espera Spring.
         */
        @Bean
        public UserDetailsService userDetailsService(UsuarioRepository usuarioRepository) {
                return username -> usuarioRepository.findByCorreoIgnoreCase(username)
                                .map(u -> {
                                        // Normalización defensiva: el rol en BD siempre debe ser
                                        // ADMINISTRADOR/VENDEDOR/CLIENTE
                                        String rol = com.pasteleria.model.Usuario.normalizarRol(u.getRol());
                                        return User.builder()
                                                        .username(u.getCorreo())
                                                        .password(u.getPassword() != null ? u.getPassword() : "")
                                                        .roles(rol) // Spring agrega "ROLE_" automáticamente
                                                        .build();
                                })
                                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .csrf(AbstractHttpConfigurer::disable)
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .exceptionHandling(ex -> ex
                                                .authenticationEntryPoint((request, response, authException) -> {
                                                        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                                                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                                                        response.getWriter().write(
                                                                        "{\"status\":401,\"error\":\"No autorizado\"," +
                                                                                        "\"mensaje\":\"Se requiere token JWT valido para acceder a este recurso.\"}");
                                                })
                                                .accessDeniedHandler((request, response, accessDeniedException) -> {
                                                        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                                                        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                                                        response.getWriter().write(
                                                                        "{\"status\":403,\"error\":\"Acceso denegado\","
                                                                                        +
                                                                                        "\"mensaje\":\"Su rol no posee permisos suficientes para esta operacion.\"}");
                                                }))
                                .authorizeHttpRequests(auth -> auth

                                                // ── 1. SWAGGER / OpenAPI y consola H2 (públicos)
                                                // ──────────────────────
                                                .requestMatchers(
                                                                "/swagger-ui.html", "/swagger-ui/**",
                                                                "/v3/api-docs/**", "/swagger-resources/**",
                                                                "/webjars/**", "/h2-console/**")
                                                .permitAll()

                                                // ── 2. AUTENTICACIÓN: login y registro (públicos)
                                                // ─────────────────────
                                                // Rutas de AuthController (endpoint principal recomendado)
                                                .requestMatchers(HttpMethod.POST,
                                                                "/api/v1/auth/login", "/api/auth/login",
                                                                "/api/v1/auth/registro", "/api/auth/registro",
                                                                "/api/v1/auth/refresh", "/api/auth/refresh")
                                                .permitAll()

                                                // Ruta legacy de UsuarioController (solo login/registro, NO el GET de
                                                // lista)
                                                .requestMatchers(HttpMethod.POST,
                                                                "/api/v1/usuarios/login", "/api/usuarios/login",
                                                                "/api/v1/usuarios/registro", "/api/usuarios/registro")
                                                .permitAll()

                                                // ── 3. CATÁLOGO DE PRODUCTOS: sólo lectura pública
                                                // ────────────────────
                                                .requestMatchers(HttpMethod.GET,
                                                                "/api/v1/productos", "/api/v1/productos/**",
                                                                "/api/productos", "/api/productos/**")
                                                .permitAll()

                                                // ── 4. CATEGORÍAS: sólo lectura pública ──────────────────────────────
                                                .requestMatchers(HttpMethod.GET,
                                                                "/api/v1/categorias", "/api/v1/categorias/**",
                                                                "/api/categorias", "/api/categorias/**")
                                                .permitAll()

                                                // ── 5. ÓRDENES (POST): cualquier usuario autenticado o cliente
                                                // ─────────
                                                // El frontend envía el token del cliente; si no hay token, se acepta
                                                // igualmente para el flujo de checkout anónimo.
                                                .requestMatchers(HttpMethod.POST,
                                                                "/api/v1/ordenes", "/api/v1/ordenes/**",
                                                                "/api/ordenes", "/api/ordenes/**")
                                                .permitAll()

                                                // ── 6. ÓRDENES (GET/PUT/DELETE): ADMINISTRADOR y VENDEDOR ────────────
                                                .requestMatchers(HttpMethod.GET,
                                                                "/api/v1/ordenes", "/api/v1/ordenes/**",
                                                                "/api/ordenes", "/api/ordenes/**")
                                                .hasAnyRole("ADMINISTRADOR", "VENDEDOR")

                                                .requestMatchers(HttpMethod.PUT,
                                                                "/api/v1/ordenes", "/api/v1/ordenes/**",
                                                                "/api/ordenes", "/api/ordenes/**")
                                                .hasRole("ADMINISTRADOR")

                                                .requestMatchers(HttpMethod.DELETE,
                                                                "/api/v1/ordenes", "/api/v1/ordenes/**",
                                                                "/api/ordenes", "/api/ordenes/**")
                                                .hasRole("ADMINISTRADOR")

                                                // ── 7. CATÁLOGO ESCRITURA (POST/PUT/DELETE): solo ADMINISTRADOR
                                                // ───────
                                                .requestMatchers(HttpMethod.POST,
                                                                "/api/v1/productos", "/api/v1/productos/**",
                                                                "/api/productos", "/api/productos/**")
                                                .hasRole("ADMINISTRADOR")

                                                .requestMatchers(HttpMethod.PUT,
                                                                "/api/v1/productos", "/api/v1/productos/**",
                                                                "/api/productos", "/api/productos/**")
                                                .hasRole("ADMINISTRADOR")

                                                .requestMatchers(HttpMethod.DELETE,
                                                                "/api/v1/productos", "/api/v1/productos/**",
                                                                "/api/productos", "/api/productos/**")
                                                .hasRole("ADMINISTRADOR")

                                                // ── 8. CATEGORÍAS ESCRITURA: solo ADMINISTRADOR
                                                // ───────────────────────
                                                .requestMatchers(HttpMethod.POST,
                                                                "/api/v1/categorias", "/api/v1/categorias/**",
                                                                "/api/categorias", "/api/categorias/**")
                                                .hasRole("ADMINISTRADOR")

                                                .requestMatchers(HttpMethod.PUT,
                                                                "/api/v1/categorias", "/api/v1/categorias/**",
                                                                "/api/categorias", "/api/categorias/**")
                                                .hasRole("ADMINISTRADOR")

                                                .requestMatchers(HttpMethod.DELETE,
                                                                "/api/v1/categorias", "/api/v1/categorias/**",
                                                                "/api/categorias", "/api/categorias/**")
                                                .hasRole("ADMINISTRADOR")

                                                // ── 9. GESTIÓN DE USUARIOS: solo ADMINISTRADOR ───────────────────────
                                                // IMPORTANTE: estas rutas van DESPUÉS de los permitAll de /login y
                                                // /registro
                                                // para que las excepciones públicas ya hayan sido evaluadas primero.
                                                .requestMatchers(
                                                                "/api/v1/usuarios", "/api/v1/usuarios/**",
                                                                "/api/usuarios", "/api/usuarios/**")
                                                .hasRole("ADMINISTRADOR")

                                                // ── 10. CUALQUIER OTRA RUTA: requiere autenticación válida
                                                // ────────────
                                                .anyRequest().authenticated());

                // Permitir frames para consola H2 (solo en desarrollo)
                http.headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()));

                // El filtro JWT se ejecuta ANTES del filtro de autenticación de Spring
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
