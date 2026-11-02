package com.pasteleria.repository;
import com.pasteleria.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
/**productos*/
public interface ProductoRepository extends JpaRepository<Producto, Long> {}
