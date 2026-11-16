package com.pasteleria.controller;

import com.pasteleria.model.Usuario;
import com.pasteleria.repository.UsuarioRepository;
import com.pasteleria.security.JwtTokenProvider;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.DateTimeException;
import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;

/**
 * Controlador de Autenticación y Emisión de Tokens JWT.
 * Satisface los requisitos del indicador IE3.3.1 y IE3.3.4 (Evaluación Parcial 3).
 */
@Tag(name = "1. Autenticación y Seguridad", description = "Endpoints para inicio de sesión, registro y renovación de tokens JWT.")
@RestController
@RequestMapping({"/api/v1/auth", "/api/auth"})
public class AuthController {

    public static final String CODIGO_FELICES50 = "FELICES50";

    public record LoginRequest(String correo, String password) {}
    public record RegistroRequest(String nombre, String correo, String password, String fechaNacimiento, String codigoPromo, String rol) {}
    public record AuthResponse(String token, String tipoToken, Usuario usuario) {}
    public record RefreshRequest(String token) {}

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthController(UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder,
                          JwtTokenProvider jwtTokenProvider) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Operation(summary = "Inicio de sesión", description = "Valida las credenciales (correo y contraseña encriptada) y retorna un token JWT firmado junto con el perfil del usuario.")
    @ApiResponse(responseCode = "200", description = "Autenticación exitosa")
    @ApiResponse(responseCode = "401", description = "Credenciales incorrectas")
    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        if (vacio(request.correo()) || request.password() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Correo y contraseña son requeridos");
        }

        Usuario usuario = usuarioRepository.findByCorreoIgnoreCase(request.correo().trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas"));

        if (!passwordEncoder.matches(request.password(), usuario.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas");
        }

        String token = jwtTokenProvider.generarToken(usuario);
        return new AuthResponse(token, "Bearer", usuario);
    }

    @Operation(summary = "Registro de nuevo cliente o usuario", description = "Registra un usuario, calcula sus beneficios por edad o cupón, encripta la clave con BCrypt y retorna su sesión con token JWT.")
    @ApiResponse(responseCode = "201", description = "Usuario registrado exitosamente")
    @ApiResponse(responseCode = "400", description = "Datos de registro inválidos")
    @ApiResponse(responseCode = "409", description = "Correo ya registrado")
    @PostMapping("/registro")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse registrar(@RequestBody RegistroRequest r) {
        if (vacio(r.nombre()) || vacio(r.correo()) || r.password() == null || r.password().length() < 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nombre, correo y contraseña (mínimo 6 caracteres) son obligatorios");
        }
        if (vacio(r.fechaNacimiento())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La fecha de nacimiento es obligatoria");
        }

        LocalDate nacimiento;
        try {
            nacimiento = LocalDate.parse(r.fechaNacimiento().trim());
        } catch (DateTimeException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Fecha de nacimiento inválida (AAAA-MM-DD)");
        }

        if (nacimiento.isAfter(LocalDate.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La fecha de nacimiento no puede ser futura");
        }

        String correo = r.correo().trim().toLowerCase();
        if (usuarioRepository.findByCorreoIgnoreCase(correo).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe una cuenta con ese correo");
        }

        List<String> beneficios = new ArrayList<>();
        if (Period.between(nacimiento, LocalDate.now()).getYears() > 50) {
            beneficios.add("MAYOR_50");
        }
        if (r.codigoPromo() != null && CODIGO_FELICES50.equalsIgnoreCase(r.codigoPromo().trim())) {
            beneficios.add("FELICES50");
        }

        Usuario u = new Usuario();
        u.setNombre(r.nombre().trim());
        u.setCorreo(correo);
        u.setPassword(passwordEncoder.encode(r.password()));

        // Asignación de rol: por defecto 'CLIENTE' a menos que sea especificado
        String rolFinal = Usuario.normalizarRol(r.rol() != null ? r.rol() : "CLIENTE");
        u.setRol(rolFinal);
        u.setFechaNacimiento(nacimiento.toString());
        u.setBeneficios(beneficios);

        Usuario guardado = usuarioRepository.save(u);
        String token = jwtTokenProvider.generarToken(guardado);

        return new AuthResponse(token, "Bearer", guardado);
    }

    @Operation(summary = "Renovación de token JWT", description = "Genera un nuevo token JWT a partir de un token válido antes de su expiración.")
    @ApiResponse(responseCode = "200", description = "Token renovado exitosamente")
    @ApiResponse(responseCode = "400", description = "Token inválido o expirado")
    @PostMapping("/refresh")
    public AuthResponse refresh(@RequestBody RefreshRequest request) {
        if (vacio(request.token()) || !jwtTokenProvider.validarToken(request.token())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token inválido o expirado");
        }

        String correo = jwtTokenProvider.obtenerCorreoDeToken(request.token());
        Usuario usuario = usuarioRepository.findByCorreoIgnoreCase(correo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        String nuevoToken = jwtTokenProvider.generarToken(usuario);
        return new AuthResponse(nuevoToken, "Bearer", usuario);
    }

    private static boolean vacio(String s) {
        return s == null || s.isBlank();
    }
}

