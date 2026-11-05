package com.pasteleria.config;

import com.pasteleria.model.Categoria;
import com.pasteleria.model.Producto;
import com.pasteleria.repository.CategoriaRepository;
import com.pasteleria.repository.ProductoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatosIniciales implements CommandLineRunner {

    private final ProductoRepository productos;
    private final CategoriaRepository categorias;

    public DatosIniciales(ProductoRepository productos, CategoriaRepository categorias) {
        this.productos = productos;
        this.categorias = categorias;
    }

    @Override
    public void run(String... args) {
        if (categorias.count() == 0) {
            categorias.save(cat("Tortas Cuadradas", "Tradicionales y para celebraciones grandes"));
            categorias.save(cat("Tortas Circulares", "Recetas chilenas clásicas con manjar casero"));
            categorias.save(cat("Sin Azúcar", "Opciones saludables endulzadas naturalmente"));
            categorias.save(cat("Sin Gluten", "100% libres de gluten, certificadas"));
        }
        if (productos.count() == 0) {
            productos.save(prod("Torta Cuadrada de Chocolate", "Tortas Cuadradas", 45000.0, 12, false, 0.0,
                "Capas de ganache con toque de avellanas. Personalizable con mensajes.",
                "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600"));
            productos.save(prod("Torta Circular de Manjar", "Tortas Circulares", 42000.0, 8, true, 15.0,
                "Tradicional receta chilena con manjar casero y nueces seleccionadas.",
                "https://www.elingenio.cl/productos/bizcocho-manjar-lucuma.jpg"));
            productos.save(prod("Cheesecake Sin Azúcar", "Sin Azúcar", 47000.0, 5, false, 0.0,
                "Suave y cremoso, perfecto para disfrutar de un postre saludable sin culpas.",
                "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600"));
            productos.save(prod("Brownie Sin Gluten", "Sin Gluten", 4000.0, 25, true, 10.0,
                "Rico y denso chocolate amargo, apto para celíacos sin sacrificar sabor.",
                "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600"));
        }
    }

    private Categoria cat(String nombre, String desc) {
        Categoria c = new Categoria();
        c.setNombre(nombre);
        c.setDescripcion(desc);
        return c;
    }

    private Producto prod(String n, String cat, Double precio, Integer stock, Boolean oferta,
                          Double dcto, String desc, String img) {
        Producto p = new Producto();
        p.setNombre(n); p.setCategoria(cat); p.setPrecio(precio); p.setStock(stock);
        p.setEnOferta(oferta); p.setDescuento(dcto); p.setDescripcion(desc); p.setImagen(img);
        return p;
    }
}