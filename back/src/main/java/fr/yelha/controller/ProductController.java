package fr.yelha.controller;

import fr.yelha.dto.ProductDto;
import fr.yelha.model.enums.ProductCategory;
import fr.yelha.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ProductDto> createProduct(@Valid @RequestBody ProductDto productDto) {
        if (productDto.getCategory() == null) {
            productDto.setCategory(ProductCategory.AUTRE);
        }
        return ResponseEntity.ok(productService.createProduct(productDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDto> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductDto productDto) {
        return ResponseEntity.ok(productService.updateProduct(id, productDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping
    public ResponseEntity<Page<ProductDto>> getAllProducts(
            @RequestParam(required = false) ProductCategory category,
            Pageable pageable) {
        if (category != null) {
            return ResponseEntity.ok(productService.getProductsByCategory(category, pageable));
        }
        return ResponseEntity.ok(productService.getAllProducts(pageable));
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<Page<ProductDto>> getProductsByStore(
            @PathVariable Long storeId,
            @RequestParam(required = false) ProductCategory category,
            Pageable pageable) {
        if (category != null) {
            return ResponseEntity.ok(productService.getProductsByStoreAndCategory(storeId, category, pageable));
        }
        return ResponseEntity.ok(productService.getProductsByStore(storeId, pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ProductDto>> searchProducts(
            @RequestParam String query,
            Pageable pageable) {
        return ResponseEntity.ok(productService.searchProducts(query, pageable));
    }

    @GetMapping("/store/{storeId}/search")
    public ResponseEntity<Page<ProductDto>> searchProductsByStore(
            @PathVariable Long storeId,
            @RequestParam String query,
            Pageable pageable) {
        return ResponseEntity.ok(productService.searchProductsByStore(storeId, query, pageable));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<ProductCategory>> getAllCategories() {
        return ResponseEntity.ok(Arrays.asList(ProductCategory.values()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ProductDto> updateProductStatus(
            @PathVariable Long id,
            @RequestParam boolean isActive) {
        return ResponseEntity.ok(productService.updateProductStatus(id, isActive));
    }
}
