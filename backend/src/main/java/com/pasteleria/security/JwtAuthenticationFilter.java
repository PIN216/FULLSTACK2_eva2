package com.pasteleria.security;

import com.pasteleria.model.Usuario;
import com.pasteleria.repository.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

/**
 * Filtro JWT que intercepta cada petición HTTP entrante para extraer y validar
 * el token Bearer de la cabecera Authorization.
 *
 * SEGURIDAD: El rol se lee SIEMPRE desde la base de datos para evitar que un
 * atacante genere un token con un rol elevado aunque conozca el secret.
 * El token solo prueba la identidad (correo); el rol lo otorga la BD.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final UsuarioRepository usuarioRepository;

    public JwtAuthenticationFilter(JwtTokenProvider tokenProvider, UsuarioRepository usuarioRepository) {
        this.tokenProvider = tokenProvider;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        String token = extraerTokenDePeticion(request);

        if (StringUtils.hasText(token) && tokenProvider.validarToken(token)) {
            String correo = tokenProvider.obtenerCorreoDeToken(token);

            // ── Rol desde BD (fuente de verdad), NO desde el token ──────────────
            Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreoIgnoreCase(correo);

            if (usuarioOpt.isPresent()) {
                Usuario usuario = usuarioOpt.get();

                // normalizarRol garantiza ADMINISTRADOR | VENDEDOR | CLIENTE
                String rolNormalizado = Usuario.normalizarRol(usuario.getRol());

                // Spring Security espera el prefijo ROLE_
                SimpleGrantedAuthority authority =
                        new SimpleGrantedAuthority("ROLE_" + rolNormalizado);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                usuario, null, Collections.singletonList(authority));

                authentication.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
            // Si el usuario no existe en BD el token es descartado aunque sea válido
        }

        filterChain.doFilter(request, response);
    }

    private String extraerTokenDePeticion(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7).trim();
        }
        return null;
    }
}
