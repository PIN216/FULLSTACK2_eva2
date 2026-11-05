package com.pasteleria.service;

import com.pasteleria.model.Producto;
import com.pasteleria.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Capa de servicio para la lógica de negocio de productos.
 * Encapsula el acceso al repositorio y las operaciones sobre el catálogo.
 */
@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    /**
     * Recupera todos los productos disponibles en inventario.
     * @return Lista con el total de productos.
     */
    public List<Producto> listarTodos() {
        return productoRepository.findAll();
    }

    /**
     * Busca un producto por su clave primaria.
     * @param id Identificador numérico del producto.
     * @return Optional con el producto si existe, o vacío si no se encuentra.
     */
    public Optional<Producto> buscarPorId(Long id) {
        return productoRepository.findById(id);
    }

    /**
     * Persiste un producto nuevo en el repositorio.
     * @param p Entidad de producto a persistir.
     * @return Producto guardado.
     */
    public Producto guardar(Producto p) {
        return productoRepository.save(p);
    }

    /**
     * Actualiza los datos de un producto existente manteniendo la integridad del ID.
     * @param id Identificador del producto a modificar.
     * @param detalles Objeto con los nuevos valores.
     * @return Producto actualizado y persistido.
     */
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

    /**
     * Elimina físicamente un producto del repositorio por su ID.
     * @param id Identificador del producto a eliminar.
     */
    public void eliminar(Long id) {
        productoRepository.deleteById(id);
    }
}
