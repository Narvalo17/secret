package fr.yelha.controller;

import fr.yelha.dto.ProductDto;
import fr.yelha.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('STORE_OWNER')")
    public ResponseEntity<ProductDto> createProduct(@RequestBody ProductDto productDto, Authentication authentication) {
        return ResponseEntity.ok(productService.createProduct(productDto, Long.parseLong(authentication.getName())));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @productService.isProductOwner(#id, authentication.principal.id)")
    public ResponseEntity<ProductDto> updateProduct(@PathVariable Long id, @RequestBody ProductDto productDto) {
        return ResponseEntity.ok(productService.updateProduct(id, productDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping
    public ResponseEntity<Page<ProductDto>> getAllProducts(Pageable pageable) {
        return ResponseEntity.ok(productService.getAllProducts(pageable));
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<Page<ProductDto>> getProductsByStore(@PathVariable Long storeId, Pageable pageable) {
        return ResponseEntity.ok(productService.getProductsByStore(storeId, pageable));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Page<ProductDto>> getProductsByCategory(@PathVariable Long categoryId, Pageable pageable) {
        return ResponseEntity.ok(productService.getProductsByCategory(categoryId.toString(), pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ProductDto>> searchProducts(@RequestParam String query, Pageable pageable) {
        return ResponseEntity.ok(productService.searchProducts(query, pageable));
    }

    @GetMapping("/store/{storeId}/search")
    public ResponseEntity<Page<ProductDto>> searchProductsByStore(
            @PathVariable Long storeId,
            @RequestParam String query,
            Pageable pageable) {
        return ResponseEntity.ok(productService.searchProductsByStore(storeId, query, pageable));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @productService.isProductOwner(#id, authentication.principal.id)")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or @productService.isProductOwner(#id, authentication.principal.id)")
    public ResponseEntity<ProductDto> updateProductStatus(@PathVariable Long id, @RequestParam boolean isActive) {
        return ResponseEntity.ok(productService.updateProductStatus(id, isActive));
    }
}
