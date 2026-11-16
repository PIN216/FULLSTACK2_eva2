package com.pasteleria;

import com.pasteleria.model.Usuario;
import com.pasteleria.security.JwtTokenProvider;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Pruebas Unitarias Backend - Evaluación Parcial 3 (DSY1104)")
class PasteleriaBackendTests {

    @Test
    @DisplayName("1. Normalización de roles de usuario (ADMIN, VENDEDOR, CLIENTE)")
    void testNormalizacionRoles() {
        assertEquals("ADMINISTRADOR", Usuario.normalizarRol("admin"));
        assertEquals("ADMINISTRADOR", Usuario.normalizarRol("ROLE_ADMIN"));
        assertEquals("ADMINISTRADOR", Usuario.normalizarRol("ADMINISTRADOR"));
        assertEquals("VENDEDOR", Usuario.normalizarRol("vendedor"));
        assertEquals("VENDEDOR", Usuario.normalizarRol("ROLE_VENDEDOR"));
        assertEquals("CLIENTE", Usuario.normalizarRol("cliente"));
        assertEquals("CLIENTE", Usuario.normalizarRol(""));
        assertEquals("CLIENTE", Usuario.normalizarRol(null));
    }

    @Test
    @DisplayName("2. Generación, firma y validación de tokens JWT")
    void testJwtTokenProviderGeneracionYValidacion() {
        JwtTokenProvider provider = new JwtTokenProvider();
        ReflectionTestUtils.setField(provider, "secret", "claveSecretaUltraSeguraPasteleriaMilSaboresEvaluacion3DuocUC2026FullstackII");
        ReflectionTestUtils.setField(provider, "expirationMs", 3600000L);

        Usuario usuario = new Usuario();
        usuario.setId(10L);
        usuario.setCorreo("admin@milsabores.cl");
        usuario.setNombre("Administrador Prueba");
        usuario.setRol("ADMINISTRADOR");
        usuario.setBeneficios(List.of("ADMIN"));

        String token = provider.generarToken(usuario);

        assertNotNull(token);
        assertFalse(token.isBlank());
        assertTrue(provider.validarToken(token));
        assertEquals("admin@milsabores.cl", provider.obtenerCorreoDeToken(token));
        assertEquals("ADMINISTRADOR", provider.obtenerRolDeToken(token));
    }

    @Test
    @DisplayName("3. Detección y rechazo de tokens JWT inválidos o alterados")
    void testJwtRechazoTokenInvalido() {
        JwtTokenProvider provider = new JwtTokenProvider();
        ReflectionTestUtils.setField(provider, "secret", "claveSecretaUltraSeguraPasteleriaMilSaboresEvaluacion3DuocUC2026FullstackII");
        ReflectionTestUtils.setField(provider, "expirationMs", 3600000L);

        assertFalse(provider.validarToken("token_invalido_totalmente_falso"));
        assertFalse(provider.validarToken(""));
        assertFalse(provider.validarToken(null));
    }

    @Test
    @DisplayName("4. Renovación de token JWT válido")
    void testJwtRenovacion() {
        JwtTokenProvider provider = new JwtTokenProvider();
        ReflectionTestUtils.setField(provider, "secret", "claveSecretaUltraSeguraPasteleriaMilSaboresEvaluacion3DuocUC2026FullstackII");
        ReflectionTestUtils.setField(provider, "expirationMs", 3600000L);

        Usuario usuario = new Usuario();
        usuario.setId(20L);
        usuario.setCorreo("vendedor@milsabores.cl");
        usuario.setNombre("Vendedor Prueba");
        usuario.setRol("VENDEDOR");

        String tokenOriginal = provider.generarToken(usuario);
        String tokenRenovado = provider.renovarToken(tokenOriginal, usuario);

        assertNotNull(tokenRenovado);
        assertTrue(provider.validarToken(tokenRenovado));
        assertEquals("vendedor@milsabores.cl", provider.obtenerCorreoDeToken(tokenRenovado));
        assertEquals("VENDEDOR", provider.obtenerRolDeToken(tokenRenovado));
    }
}

