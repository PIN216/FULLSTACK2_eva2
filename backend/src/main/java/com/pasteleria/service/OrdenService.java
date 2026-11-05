package com.pasteleria.service;

import com.pasteleria.model.Orden;
import com.pasteleria.repository.OrdenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Capa de servicio para la gestión y procesamiento de órdenes de compra.
 * Proporciona métodos para registrar nuevas transacciones y consultar pedidos.
 */
@Service
public class OrdenService {

    @Autowired
    private OrdenRepository ordenRepository;

    /**
     * Obtiene el listado completo de pedidos registrados en el sistema.
     * @return Lista de órdenes con su detalle de items.
     */
    public List<Orden> listarTodas() {
        return ordenRepository.findAll();
    }

    /**
     * Registra y persiste una orden generada tras el pago o confirmación del cliente.
     * @param o Datos de la orden a registrar.
     * @return Orden guardada en la base de datos.
     */
    public Orden registrarOrden(Orden o) {
        return ordenRepository.save(o);
    }
}
