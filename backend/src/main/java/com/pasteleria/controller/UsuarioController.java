package com.pasteleria.controller;

import com.pasteleria.model.Usuario;
import com.pasteleria.repository.UsuarioRepository;
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
 * Controlador REST para la autenticación y registro de usuarios.
 * Maneja el ciclo de vida de clientes, encriptación de contraseñas con BCrypt
 * y asignación de beneficios comerciales (promociones por edad y cupones).
 * Ruta base: /api/usuarios
 */
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    /** Código promocional que otorga 10% de descuento vitalicio al cliente */
    public static final String CODIGO_FELICES50 = "FELICES50";

    /** DTO para la petición de registro de nuevos clientes */
    public record RegistroRequest(String nombre, String correo, String password, String fechaNacimiento, String codigoPromo) {}

    /** DTO para las credenciales de inicio de sesión */
    public record LoginRequest(String correo, String password) {}

    private final UsuarioRepository repo;
    private final PasswordEncoder encoder;

    public UsuarioController(UsuarioRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    /**
     * Retorna la lista de usuarios registrados.
     * Nota de seguridad: La contraseña nunca se incluye en las respuestas JSON gracias a @JsonProperty(WRITE_ONLY).
     * @return Lista de usuarios.
     */
    @GetMapping
    public List<Usuario> listar() {
        return repo.findAll();
    }

    /**
     * Registra un nuevo usuario cliente en el sistema.
     * Valida campos obligatorios, formato de fecha, unicidad de correo
     * y aplica los beneficios correspondientes según las reglas de negocio.
     *
     * @param r Datos de la solicitud de registro.
     * @return Usuario creado y persistido (sin contraseña expuesta).
     * @throws ResponseStatusException HTTP 400 si faltan datos o son inválidos, HTTP 409 si el correo ya existe.
     */
    @PostMapping("/registro")
    @ResponseStatus(HttpStatus.CREATED)
    public Usuario registrar(@RequestBody RegistroRequest r) {
        if (vacio(r.nombre()) || vacio(r.correo()) || r.password() == null || r.password().length() < 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Nombre, correo y contraseña (mínimo 6 caracteres) son obligatorios");
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
        if (repo.findByCorreoIgnoreCase(correo).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe una cuenta con ese correo");
        }

        // Determinación de beneficios comerciales calculados en el backend:
        // 1. Clientes mayores a 50 años acceden al beneficio MAYOR_50 (50% de descuento).
        // 2. Si ingresa el cupón FELICES50, se asigna 10% de descuento.
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
        u.setPassword(encoder.encode(r.password()));
        u.setRol("cliente"); // Todo registro público se asigna con rol cliente por seguridad
        u.setFechaNacimiento(nacimiento.toString());
        u.setBeneficios(beneficios);
        return repo.save(u);
    }

    /**
     * Autentica a un usuario contra las credenciales almacenadas con BCrypt.
     *
     * @param r Credenciales de acceso (correo y contraseña plana).
     * @return El perfil del usuario autenticado si las credenciales coinciden.
     * @throws ResponseStatusException HTTP 401 si las credenciales son inválidas.
     */
    @PostMapping("/login")
    public Usuario login(@RequestBody LoginRequest r) {
        Usuario u = (vacio(r.correo()) || r.password() == null)
                ? null
                : repo.findByCorreoIgnoreCase(r.correo().trim()).orElse(null);
        if (u == null || !encoder.matches(r.password(), u.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas");
        }
        return u;
    }

    /**
     * Valida si una cadena de texto es nula o se encuentra en blanco.
     */
    private static boolean vacio(String s) {
        return s == null || s.isBlank();
    }
}
