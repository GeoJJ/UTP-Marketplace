package pe.edu.utp.marketplace_api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pe.edu.utp.marketplace_api.model.Product;
import pe.edu.utp.marketplace_api.repository.ProductRepository;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*") // ¡Clave! Permite que tu Frontend en HTML se conecte sin bloqueos de seguridad (CORS)
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    // Método para LEER los productos (Lo usará el catálogo)
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Método para CREAR un producto (Lo usará el panel de Administrador)
    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }
}