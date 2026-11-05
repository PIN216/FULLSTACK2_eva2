package com.pasteleria.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Configuración para el cifrado y validación segura de contraseñas.
 * Utiliza el algoritmo BCrypt provisto por la dependencia spring-security-crypto.
 * Nota: No activa las restricciones de Spring Security Web, manteniendo los endpoints abiertos.
 */
@Configuration
public class PasswordConfig {

    /**
     * Expone el Bean PasswordEncoder para su inyección en controladores y servicios.
     * @return Instancia de BCryptPasswordEncoder con factor de costo por defecto.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
