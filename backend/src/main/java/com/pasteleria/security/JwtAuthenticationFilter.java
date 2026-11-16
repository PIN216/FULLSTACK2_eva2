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
 * Filtro de seguridad que intercepta cada petición HTTP entrante para extraer
 * y validar el token JWT presente en la cabecera 'Authorization: Bearer <token>'.
 * Establece el contexto de seguridad de Spring Security para el ciclo de vida del request.
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
            String rolToken = tokenProvider.obtenerRolDeToken(token);

            Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreoIgnoreCase(correo);
            String rolFinal = usuarioOpt.map(Usuario::getRol).orElse(rolToken);

            // Se asignan las autoridades correspondientes (ROLE_ADMINISTRADOR, ROLE_VENDEDOR, ROLE_CLIENTE)
            SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + rolFinal);

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            usuarioOpt.orElse(null),
                            null,
                            Collections.singletonList(authority)
                    );

            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }

    private String extraerTokenDePeticion(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}

