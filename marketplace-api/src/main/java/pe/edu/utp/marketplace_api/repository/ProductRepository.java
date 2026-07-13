package pe.edu.utp.marketplace_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.utp.marketplace_api.model.Product;

// JpaRepository ya incluye todos los métodos básicos (findAll, save, deleteById, etc.)
public interface ProductRepository extends JpaRepository<Product, Long> {
}