package com.pasteleria.repository;
import com.pasteleria.model.Orden;
import org.springframework.data.jpa.repository.JpaRepository;
/**orden de repositorios*/
public interface OrdenRepository extends JpaRepository<Orden, Long> {}
