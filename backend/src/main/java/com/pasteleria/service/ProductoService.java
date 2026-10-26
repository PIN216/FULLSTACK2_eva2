package com.pasteleria.service;

import com.pasteleria.model.Producto;
import com.pasteleria.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    public List<Producto> listarTodos() {
        return productoRepository.findAll();
    }

    public Optional<Producto> buscarPorId(Long id) {
        return productoRepository.findById(id);
    }

    public Producto guardar(Producto p) {
        return productoRepository.save(p);
    }

    public Producto actualizar(Long id, Producto detalles) {
        Producto actual = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        actual.setNombre(detalles.getNombre());
        actual.setCategoria(detalles.getCategoria());
        actual.setPrecio(detalles.getPrecio());
        actual.setStock(detalles.getStock());
        actual.setDescripcion(detalles.getDescripcion());
        actual.setImagen(detalles.getImagen());
        return productoRepository.save(actual);
    }

    public void eliminar(Long id) {
        productoRepository.deleteById(id);
    }
}
