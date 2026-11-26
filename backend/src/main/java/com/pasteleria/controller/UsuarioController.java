package com.pasteleria.controller;

import com.pasteleria.model.Usuario;
import com.pasteleria.repository.UsuarioRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
<<<<<<< HEAD
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
=======
>>>>>>> 157a1e9a56f636a192c0a9eadebbcc6601ecca2e
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
<<<<<<< HEAD
 * Controlador REST para administración de usuarios.
 * Rutas: /api/v1/usuarios y /api/usuarios
 *
 * SEGURIDAD:
 *   - GET /             → requiere rol ADMINISTRADOR  (lista todos los usuarios)
 *   - POST /registro    → público (crea cliente, rol fijo)
 *   - POST /login       → público (compatibilidad legacy; sin JWT)
 *   - DELETE /{id}      → requiere rol ADMINISTRADOR
 *   - PUT /{id}         → requiere rol ADMINISTRADOR
 *
 * Las reglas de acceso se aplican en SecurityConfig antes de llegar aquí.
 * El endpoint /registro y /login están explícitamente en la lista pública de SecurityConfig.
 */
@Tag(name = "5. Gestión de Usuarios",
     description = "Endpoints para consulta y administración de usuarios del sistema.")
=======
 * Controlador REST para la administración y consulta de usuarios.
 * Maneja el ciclo de vida de clientes, encriptación de contraseñas con BCrypt
 * y asignación de beneficios comerciales (promociones por edad y cupones).
 * Rutas: /api/v1/usuarios y /api/usuarios
 */
@Tag(name = "5. Gestión de Usuarios", description = "Endpoints para consulta de usuarios del sistema y operaciones de compatibilidad.")
>>>>>>> 157a1e9a56f636a192c0a9eadebbcc6601ecca2e
@RestController
@RequestMapping({"/api/v1/usuarios", "/api/usuarios"})
public class UsuarioController {

    public static final String CODIGO_FELICES50 = "FELICES50";

    /** DTO solo para /registro del UsuarioController (sin campo 'rol') */
    public record RegistroRequest(
        String nombre, String correo, String password,
        String fechaNacimiento, String codigoPromo
    ) {}

    /**
     * DTO legacy para /login.
     * Retorna el usuario sin JWT (el frontend debería usar /api/v1/auth/login en su lugar).
     */
    public record LoginRequest(String correo, String password) {}

    private final UsuarioRepository repo;
    private final PasswordEncoder encoder;

    public UsuarioController(UsuarioRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

<<<<<<< HEAD
    // ── SOLO ADMINISTRADOR ─────────────────────────────────────────────────────

    @Operation(summary = "Listar todos los usuarios",
               description = "Requiere rol ADMINISTRADOR. Retorna todos los usuarios sin exponer contraseñas.")
    @ApiResponse(responseCode = "200", description = "Lista obtenida")
    @ApiResponse(responseCode = "401", description = "Sin token JWT")
    @ApiResponse(responseCode = "403", description = "Rol insuficiente (requiere ADMINISTRADOR)")
    @SecurityRequirement(name = "Bearer Authentication")
=======
    /**
     * Retorna la lista de usuarios registrados.
     * Nota de seguridad: La contraseña nunca se incluye en las respuestas JSON gracias a @JsonProperty(WRITE_ONLY).
     * @return Lista de usuarios.
     */
    @Operation(summary = "Listar usuarios", description = "Retorna la lista de usuarios registrados sin exponer credenciales. Requiere rol ADMINISTRADOR.")
    @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida")
    @ApiResponse(responseCode = "403", description = "Acceso denegado (requiere rol ADMINISTRADOR)")
>>>>>>> 157a1e9a56f636a192c0a9eadebbcc6601ecca2e
    @GetMapping
    public List<Usuario> listar() {
        return repo.findAll();
    }

    @Operation(summary = "Obtener usuario por ID",
               description = "Requiere rol ADMINISTRADOR.")
    @ApiResponse(responseCode = "200", description = "Usuario encontrado")
    @ApiResponse(responseCode = "403", description = "Rol insuficiente")
    @ApiResponse(responseCode = "404", description = "No encontrado")
    @SecurityRequirement(name = "Bearer Authentication")
    @GetMapping("/{id}")
    public Usuario obtener(@PathVariable Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
    }

    @Operation(summary = "Eliminar usuario",
               description = "Requiere rol ADMINISTRADOR. Elimina una cuenta por ID.")
    @ApiResponse(responseCode = "204", description = "Eliminado")
    @ApiResponse(responseCode = "403", description = "Rol insuficiente")
    @ApiResponse(responseCode = "404", description = "No encontrado")
    @SecurityRequirement(name = "Bearer Authentication")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado");
        }
        repo.deleteById(id);
    }

    // ── PÚBLICOS (permitidos en SecurityConfig antes del bloque /api/usuarios/**) ──

    /**
     * Registro público de nuevos clientes.
     * El rol asignado es SIEMPRE "CLIENTE" — no se acepta ningún rol del body.
     */
<<<<<<< HEAD
    @Operation(summary = "Registro de cliente (ruta directa)",
               description = "Ruta alternativa a /api/v1/auth/registro. " +
                             "Rol asignado siempre es CLIENTE sin importar el body enviado.")
    @ApiResponse(responseCode = "201", description = "Registrado")
    @ApiResponse(responseCode = "400", description = "Datos inválidos")
=======
    @Operation(summary = "Registro de usuario (endpoint directo)", description = "Registra un cliente nuevo y calcula beneficios de descuento según edad y cupón.")
    @ApiResponse(responseCode = "201", description = "Usuario registrado exitosamente")
    @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos")
>>>>>>> 157a1e9a56f636a192c0a9eadebbcc6601ecca2e
    @ApiResponse(responseCode = "409", description = "Correo ya en uso")
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
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Fecha inválida (AAAA-MM-DD)");
        }
        if (nacimiento.isAfter(LocalDate.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La fecha no puede ser futura");
        }

        String correo = r.correo().trim().toLowerCase();
        if (repo.findByCorreoIgnoreCase(correo).isPresent()) {
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
        u.setPassword(encoder.encode(r.password()));
        u.setRol("CLIENTE");   // ← FIJO: nunca elevable desde el body
        u.setFechaNacimiento(nacimiento.toString());
        u.setBeneficios(beneficios);
        return repo.save(u);
    }

    /**
     * Login legacy (sin JWT). Retorna el objeto usuario si las credenciales son válidas.
     * El frontend debería preferir /api/v1/auth/login que sí incluye JWT en la respuesta.
     */
<<<<<<< HEAD
    @Operation(summary = "Inicio de sesión (ruta directa, sin JWT)",
               description = "Verifica credenciales y retorna el perfil. " +
                             "Para obtener un token use /api/v1/auth/login.")
=======
    @Operation(summary = "Inicio de sesión (endpoint directo)", description = "Autentica al usuario verificando su contraseña cifrada con BCrypt.")
>>>>>>> 157a1e9a56f636a192c0a9eadebbcc6601ecca2e
    @ApiResponse(responseCode = "200", description = "Credenciales válidas")
    @ApiResponse(responseCode = "401", description = "Credenciales incorrectas")
    @PostMapping("/login")
    public Usuario login(@RequestBody LoginRequest r) {
        if (vacio(r.correo()) || r.password() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Correo y contraseña son requeridos");
        }
        Usuario u = repo.findByCorreoIgnoreCase(r.correo().trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas"));
        if (!encoder.matches(r.password(), u.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas");
        }
        return u;
    }

    private static boolean vacio(String s) {
        return s == null || s.isBlank();
    }
}
