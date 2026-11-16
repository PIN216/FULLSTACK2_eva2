package com.pasteleria.security;

import com.pasteleria.model.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Proveedor de servicios criptográficos para generación, validación,
 * lectura y renovación de tokens JWT (JSON Web Tokens).
 * Cumple con el criterio IE3.3.1 de la Evaluación Parcial 3.
 */
@Component
public class JwtTokenProvider {

    @Value("${app.jwt.secret:claveSecretaUltraSeguraPasteleriaMilSaboresEvaluacion3DuocUC2026FullstackII}")
    private String secret;

    @Value("${app.jwt.expiration-ms:86400000}") // 24 horas por defecto
    private long expirationMs;

    private SecretKey getSigningKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Genera un token JWT firmado digitalmente con HS256 para el usuario autenticado.
     * Incluye claims de rol, id, nombre y lista de beneficios comerciales.
     *
     * @param usuario Entidad con los datos del usuario.
     * @return Cadena JWT compacta y codificada en Base64 URL.
     */
    public String generarToken(Usuario usuario) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMs);

        Map<String, Object> claims = new HashMap<>();
        claims.put("id", usuario.getId());
        claims.put("nombre", usuario.getNombre());
        claims.put("rol", usuario.getRol());
        claims.put("beneficios", usuario.getBeneficios());

        return Jwts.builder()
                .claims(claims)
                .subject(usuario.getCorreo())
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Valida la firma criptográfica y la vigencia temporal del token JWT.
     *
     * @param token Cadena JWT.
     * @return true si es íntegro y vigente; false si está expirado o fue alterado.
     */
    public boolean validarToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Extrae las reclamaciones (claims) del token.
     */
    public Claims obtenerClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Extrae el correo (subject) del usuario contenido en el token.
     */
    public String obtenerCorreoDeToken(String token) {
        return obtenerClaims(token).getSubject();
    }

    /**
     * Extrae el rol asociado en los claims del token.
     */
    public String obtenerRolDeToken(String token) {
        Object rol = obtenerClaims(token).get("rol");
        return rol != null ? rol.toString() : "CLIENTE";
    }

    /**
     * Renueva un token válido emitiendo uno nuevo con expiración actualizada (IE3.3.1.b).
     */
    public String renovarToken(String tokenAntiguo, Usuario usuarioActual) {
        if (!validarToken(tokenAntiguo)) {
            throw new IllegalArgumentException("El token proporcionado no es válido para renovación");
        }
        return generarToken(usuarioActual);
    }
}

