package com.pasteleria.config;
import com.pasteleria.model.Producto;
import com.pasteleria.repository.ProductoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Carga el catálogo inicial. Sin esto la base H2 (en memoria) arranca vacía y,
 * como el front sí consigue responder al GET, la tienda se vería sin productos.
 */
@Component
public class DataLoader implements CommandLineRunner {
    private final ProductoRepository repo;

    public DataLoader(ProductoRepository repo) { this.repo = repo; }

    @Override
    public void run(String... args) {
        if (repo.count() > 0) return;
        repo.save(producto("Torta Cuadrada de Chocolate", "Tortas Cuadradas", 45000, 12, false, 0,
                "Capas de ganache con avellanas.", "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600"));
        repo.save(producto("Torta Circular de Manjar", "Tortas Circulares", 42000, 4, true, 15,
                "Receta tradicional chilena con manjar casero.", "https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=600"));
        repo.save(producto("Cheesecake Sin Azúcar", "Sin Azúcar", 47000, 5, false, 0,
                "Suave y cremoso postre saludable.", "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600"));
        repo.save(producto("Brownie Sin Gluten", "Sin Gluten", 4000, 25, true, 10,
                "Rico chocolate amargo apto para celíacos.", "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600"));
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
