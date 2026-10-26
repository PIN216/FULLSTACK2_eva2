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

@RestController @RequestMapping("/api/usuarios")
public class UsuarioController {
    public static final String CODIGO_FELICES50 = "FELICES50";

    public record RegistroRequest(String nombre, String correo, String password, String fechaNacimiento, String codigoPromo) {}
    public record LoginRequest(String correo, String password) {}

    private final UsuarioRepository repo;
    private final PasswordEncoder encoder;

    public UsuarioController(UsuarioRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    /** Lista de usuarios (la contraseña nunca se incluye en el JSON). */
    @GetMapping public List<Usuario> listar() { return repo.findAll(); }

    @PostMapping("/registro") @ResponseStatus(HttpStatus.CREATED)
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

        // Los beneficios los decide el servidor (no el navegador): mayor de 50 años y cupón FELICES50.
        List<String> beneficios = new ArrayList<>();
        if (Period.between(nacimiento, LocalDate.now()).getYears() > 50) beneficios.add("MAYOR_50");
        if (r.codigoPromo() != null && CODIGO_FELICES50.equalsIgnoreCase(r.codigoPromo().trim())) {
            beneficios.add("FELICES50");
        }

        Usuario u = new Usuario();
        u.setNombre(r.nombre().trim());
        u.setCorreo(correo);
        u.setPassword(encoder.encode(r.password()));
        u.setRol("cliente"); // nadie puede registrarse como admin desde la API pública
        u.setFechaNacimiento(nacimiento.toString());
        u.setBeneficios(beneficios);
        return repo.save(u);
    }

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

    private static boolean vacio(String s) { return s == null || s.isBlank(); }
}
