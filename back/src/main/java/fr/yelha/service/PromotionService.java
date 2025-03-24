package fr.yelha.service;

import fr.yelha.dto.PromotionDto;
import fr.yelha.model.Promotion;
import fr.yelha.model.Store;
import fr.yelha.model.Product;
import fr.yelha.model.Category;
import fr.yelha.repository.PromotionRepository;
import fr.yelha.repository.StoreRepository;
import fr.yelha.repository.ProductRepository;
import fr.yelha.repository.CategoryRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PromotionService {
    private final PromotionRepository promotionRepository;
    private final StoreRepository storeRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public PromotionDto createPromotion(PromotionDto promotionDto) {
        Store store = storeRepository.findById(promotionDto.getStoreId())
                .orElseThrow(() -> new EntityNotFoundException("Magasin non trouvé"));
        
        Promotion promotion = new Promotion();
        updatePromotionFromDto(promotion, promotionDto);
        promotion.setStore(store);
        
        if (promotionDto.getProductIds() != null) {
            List<Product> products = productRepository.findAllById(promotionDto.getProductIds());
            promotion.setProducts(products);
        }
        
        if (promotionDto.getCategoryIds() != null) {
            List<Category> categories = categoryRepository.findAllById(promotionDto.getCategoryIds());
            promotion.setCategories(categories);
        }
        
        return convertToDto(promotionRepository.save(promotion));
    }

    public PromotionDto updatePromotion(Long id, PromotionDto promotionDto) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Promotion non trouvée"));
        
        updatePromotionFromDto(promotion, promotionDto);
        
        if (promotionDto.getStoreId() != null) {
            Store store = storeRepository.findById(promotionDto.getStoreId())
                    .orElseThrow(() -> new EntityNotFoundException("Magasin non trouvé"));
            promotion.setStore(store);
        }
        
        if (promotionDto.getProductIds() != null) {
            List<Product> products = productRepository.findAllById(promotionDto.getProductIds());
            promotion.setProducts(products);
        }
        
        if (promotionDto.getCategoryIds() != null) {
            List<Category> categories = categoryRepository.findAllById(promotionDto.getCategoryIds());
            promotion.setCategories(categories);
        }
        
        return convertToDto(promotionRepository.save(promotion));
    }

    public PromotionDto getPromotionById(Long id) {
        return promotionRepository.findById(id)
                .map(this::convertToDto)
                .orElseThrow(() -> new EntityNotFoundException("Promotion non trouvée"));
    }

    public Page<PromotionDto> getAllPromotions(Pageable pageable) {
        return promotionRepository.findAll(pageable)
                .map(this::convertToDto);
    }

    public Page<PromotionDto> getActivePromotions(Pageable pageable) {
        return promotionRepository.findByIsActiveTrue(pageable)
                .map(this::convertToDto);
    }

    public Page<PromotionDto> getPromotionsByStore(Long storeId, Pageable pageable) {
        return promotionRepository.findByStoreId(storeId, pageable)
                .map(this::convertToDto);
    }

    public Page<PromotionDto> getActivePromotionsByStore(Long storeId, Pageable pageable) {
        return promotionRepository.findByStoreIdAndIsActiveTrue(storeId, pageable)
                .map(this::convertToDto);
    }

    public PromotionDto validatePromotion(String code, Long storeId) {
        return promotionRepository.findByCodeAndStoreId(code, storeId)
                .filter(this::isPromotionValid)
                .map(this::convertToDto)
                .orElseThrow(() -> new EntityNotFoundException("Promotion non valide"));
    }

    public void deletePromotion(Long id) {
        if (!promotionRepository.existsById(id)) {
            throw new EntityNotFoundException("Promotion non trouvée");
        }
        promotionRepository.deleteById(id);
    }

    public boolean isPromotionOwner(Long promotionId, Long userId) {
        return promotionRepository.existsByIdAndStoreOwnerId(promotionId, userId);
    }

    public boolean isStoreOwner(Long storeId, Long userId) {
        return storeRepository.existsByIdAndOwnerId(storeId, userId);
    }

    private boolean isPromotionValid(Promotion promotion) {
        LocalDateTime now = LocalDateTime.now();
        return promotion.isActive() &&
               (promotion.getStartDate() == null || now.isAfter(promotion.getStartDate())) &&
               (promotion.getEndDate() == null || now.isBefore(promotion.getEndDate()));
    }

    private void updatePromotionFromDto(Promotion promotion, PromotionDto dto) {
        promotion.setCode(dto.getCode());
        promotion.setDescription(dto.getDescription());
        promotion.setDiscountPercentage(dto.getDiscountPercentage());
        promotion.setStartDate(dto.getStartDate());
        promotion.setEndDate(dto.getEndDate());
        promotion.setActive(dto.isActive());
    }

    private PromotionDto convertToDto(Promotion promotion) {
        PromotionDto dto = new PromotionDto();
        dto.setId(promotion.getId());
        dto.setCode(promotion.getCode());
        dto.setDescription(promotion.getDescription());
        dto.setDiscountPercentage(promotion.getDiscountPercentage());
        dto.setStoreId(promotion.getStore().getId());
        dto.setStartDate(promotion.getStartDate());
        dto.setEndDate(promotion.getEndDate());
        dto.setActive(promotion.isActive());
        dto.setCreatedAt(promotion.getCreatedAt());
        dto.setUpdatedAt(promotion.getUpdatedAt());
        
        if (promotion.getProducts() != null) {
            dto.setProductIds(promotion.getProducts().stream()
                    .map(Product::getId)
                    .collect(Collectors.toList()));
            dto.setProductNames(promotion.getProducts().stream()
                    .map(Product::getName)
                    .collect(Collectors.toList()));
        }
        
        if (promotion.getCategories() != null) {
            dto.setCategoryIds(promotion.getCategories().stream()
                    .map(Category::getId)
                    .collect(Collectors.toList()));
            dto.setCategoryNames(promotion.getCategories().stream()
                    .map(Category::getName)
                    .collect(Collectors.toList()));
        }
        
        return dto;
    }
} 