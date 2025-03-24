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

    public ProductDto createProduct(ProductDto productDto, Long userId) {
        Store store = storeRepository.findById(productDto.getStoreId())
                .orElseThrow(() -> new EntityNotFoundException("Magasin non trouvé"));

        if (!store.getOwner().getId().equals(userId)) {
            throw new IllegalStateException("Vous n'êtes pas le propriétaire de ce magasin");
        }

        Product product = new Product();
        updateProductFromDto(product, productDto);
        product.setStore(store);

        if (productDto.getCategoryId() != null) {
            Category category = categoryRepository.findById(productDto.getCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException("Catégorie non trouvée"));
            product.setCategory(category);
        }

        return convertToDto(productRepository.save(product));
    }

    public ProductDto updateProduct(Long id, ProductDto productDto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Produit non trouvé"));

        updateProductFromDto(product, productDto);

        if (productDto.getCategoryId() != null) {
            Category category = categoryRepository.findById(productDto.getCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException("Catégorie non trouvée"));
            product.setCategory(category);
        }

        return convertToDto(productRepository.save(product));
    }

    public ProductDto getProductById(Long id) {
        return productRepository.findById(id)
                .map(this::convertToDto)
                .orElseThrow(() -> new EntityNotFoundException("Produit non trouvé"));
    }

    public Page<ProductDto> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable)
                .map(this::convertToDto);
    }

    public Page<ProductDto> getProductsByStore(Long storeId, Pageable pageable) {
        return productRepository.findByStoreId(storeId, pageable)
                .map(this::convertToDto);
    }

    public Page<ProductDto> getProductsByCategory(String categoryId, Pageable pageable) {
        return productRepository.findByCategoryId(Long.parseLong(categoryId), pageable)
                .map(this::convertToDto);
    }

    public Page<ProductDto> searchProducts(String query, Pageable pageable) {
        return productRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query, pageable)
                .map(this::convertToDto);
    }

    public Page<ProductDto> searchProductsByStore(Long storeId, String query, Pageable pageable) {
        return productRepository.findByStoreIdAndNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
                storeId, query, query, pageable)
                .map(this::convertToDto);
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new EntityNotFoundException("Produit non trouvé");
        }
        productRepository.deleteById(id);
    }

    public ProductDto updateProductStatus(Long id, boolean isActive) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Produit non trouvé"));
        
        product.setActive(isActive);
        return convertToDto(productRepository.save(product));
    }

    public boolean isProductOwner(Long productId, Long userId) {
        return productRepository.existsByIdAndStoreOwnerId(productId, userId);
    }

    private void updateProductFromDto(Product product, ProductDto dto) {
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setCurrentPrice(dto.getPrice().doubleValue());
        product.setImageUrl(dto.getImageUrl());
        product.setActive(dto.isActive());
    }

    private ProductDto convertToDto(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(BigDecimal.valueOf(product.getCurrentPrice()));
        dto.setImageUrl(product.getImageUrl());
        dto.setStoreId(product.getStore().getId());
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getId());
        }
        dto.setActive(product.isActive());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        return dto;
    }
} 