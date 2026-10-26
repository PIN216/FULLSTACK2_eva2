package com.pasteleria.config;
import com.pasteleria.model.Categoria;
import com.pasteleria.model.Producto;
import com.pasteleria.model.Usuario;
import com.pasteleria.repository.CategoriaRepository;
import com.pasteleria.repository.ProductoRepository;
import com.pasteleria.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Datos iniciales de la tienda (antes vivían en frontend/src/data/dataService.js).
 * Se insertan en la base SQL cada vez que el backend arranca y la tabla correspondiente está vacía,
 * así que si la base es persistente no se duplican.
 */
@Component
public class DataLoader implements CommandLineRunner {
    public static final String ADMIN_CORREO = "admin@milsabores.cl";

    private final CategoriaRepository categorias;
    private final ProductoRepository productos;
    private final UsuarioRepository usuarios;
    private final PasswordEncoder encoder;
    private final String adminPassword;

    public DataLoader(CategoriaRepository categorias, ProductoRepository productos, UsuarioRepository usuarios,
                        PasswordEncoder encoder, @Value("${app.admin.password:Admin1234}") String adminPassword) {
        this.categorias = categorias;
        this.productos = productos;
        this.usuarios = usuarios;
        this.encoder = encoder;
        this.adminPassword = adminPassword;
    }

    @Override
    public void run(String... args) {
        cargarCategorias();
        cargarProductos();
        cargarAdministrador();
    }

    private void cargarCategorias() {
        if (categorias.count() > 0) return;
        categorias.save(categoria("Tortas Cuadradas", "Tradicionales y para celebraciones grandes"));
        categorias.save(categoria("Tortas Circulares", "Recetas chilenas clásicas con manjar casero"));
        categorias.save(categoria("Sin Azúcar", "Opciones saludables endulzadas naturalmente"));
        categorias.save(categoria("Sin Gluten", "100% libres de gluten, certificadas"));
    }

    private void cargarProductos() {
        if (productos.count() > 0) return;
        productos.save(producto("Torta Cuadrada de Chocolate", "Tortas Cuadradas", 45000, 12, false, 0,
                "Capas de ganache con toque de avellanas. Personalizable con mensajes.",
                "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600"));
        productos.save(producto("Torta Circular de Manjar", "Tortas Circulares", 42000, 8, true, 15,
                "Tradicional receta chilena con manjar casero y nueces seleccionadas.",
                "https://www.elingenio.cl/productos/bizcocho-manjar-lucuma.jpg"));
        productos.save(producto("Cheesecake Sin Azúcar", "Sin Azúcar", 47000, 5, false, 0,
                "Suave y cremoso, perfecto para disfrutar de un postre saludable sin culpas.",
                "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600"));
        productos.save(producto("Brownie Sin Gluten", "Sin Gluten", 4000, 25, true, 10,
                "Rico y denso chocolate amargo, apto para celíacos sin sacrificar sabor.",
                "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600"));
    }

    private void cargarAdministrador() {
        if (usuarios.findByCorreoIgnoreCase(ADMIN_CORREO).isPresent()) return;
        Usuario admin = new Usuario();
        admin.setNombre("Administrador General");
        admin.setCorreo(ADMIN_CORREO);
        admin.setPassword(encoder.encode(adminPassword)); // se guarda cifrada
        admin.setRol("admin");
        usuarios.save(admin);
    }

    private Categoria categoria(String nombre, String descripcion) {
        Categoria c = new Categoria();
        c.setNombre(nombre);
        c.setDescripcion(descripcion);
        return c;
    }

    private Producto producto(String nombre, String categoria, double precio, int stock,
                                boolean enOferta, double descuento, String descripcion, String imagen) {
        Producto p = new Producto();
        p.setNombre(nombre);
        p.setCategoria(categoria);
        p.setPrecio(precio);
        p.setStock(stock);
        p.setEnOferta(enOferta);
        p.setDescuento(descuento);
        p.setDescripcion(descripcion);
        p.setImagen(imagen);
        return p;
    }
}
