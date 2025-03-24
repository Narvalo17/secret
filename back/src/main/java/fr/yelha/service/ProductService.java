package fr.yelha.service;

import fr.yelha.dto.ProductDto;
import fr.yelha.model.Product;
import fr.yelha.model.Store;
import fr.yelha.model.Category;
import fr.yelha.repository.ProductRepository;
import fr.yelha.repository.StoreRepository;
import fr.yelha.repository.CategoryRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {
    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final CategoryRepository categoryRepository;

    public ProductDto createProduct(ProductDto productDto) {
        Product product = new Product();
        updateProductFromDto(product, productDto);
        return convertToDto(productRepository.save(product));
    }

    public ProductDto updateProduct(Long id, ProductDto productDto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));
        updateProductFromDto(product, productDto);
        return convertToDto(productRepository.save(product));
    }

    public ProductDto getProductById(Long id) {
        return convertToDto(productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id)));
    }

    public Page<ProductDto> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable).map(this::convertToDto);
    }

    public Page<ProductDto> getProductsByStore(Long storeId, Pageable pageable) {
        return productRepository.findByStoreId(storeId, pageable).map(this::convertToDto);
    }

    public Page<ProductDto> getProductsByCategory(Long categoryId, Pageable pageable) {
        return productRepository.findByCategoryId(categoryId, pageable).map(this::convertToDto);
    }

    public Page<ProductDto> searchProducts(String query, Pageable pageable) {
        return productRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query, pageable)
                .map(this::convertToDto);
    }

    public Page<ProductDto> searchProductsByStore(Long storeId, String query, Pageable pageable) {
        return productRepository.findByStoreIdAndNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(storeId, query, query, pageable)
                .map(this::convertToDto);
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new EntityNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    public ProductDto updateProductStatus(Long id, boolean isActive) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));
        product.setActive(isActive);
        return convertToDto(productRepository.save(product));
    }

    public boolean isProductOwner(Long productId, Long userId) {
        return productRepository.existsByIdAndStoreOwnerId(productId, userId);
    }

    private void updateProductFromDto(Product product, ProductDto dto) {
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setQuantity(dto.getQuantity());
        product.setActive(dto.isActive());
        product.setCategory(dto.getCategory());
        product.setStore(dto.getStore());
        product.setImageUrl(dto.getImageUrl());
    }

    private ProductDto convertToDto(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setQuantity(product.getQuantity());
        dto.setActive(product.isActive());
        dto.setCategory(product.getCategory());
        dto.setStore(product.getStore());
        dto.setImageUrl(product.getImageUrl());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        return dto;
    }
} 