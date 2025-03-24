package fr.yelha.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.math.BigDecimal;

@Data
public class ProductDto {
    private Long id;

    @NotBlank(message = "Le nom du produit est obligatoire")
    private String name;

    private String description;

    @NotNull(message = "Le prix est obligatoire")
    @Positive(message = "Le prix doit être positif")
    private BigDecimal price;

    private String imageUrl;

    @NotNull(message = "Le magasin est obligatoire")
    private Long storeId;

    private Long categoryId;

    private boolean isActive;

    // Statistiques
    private Integer totalSales;
    private Integer viewCount;
    private Double rating;
    private Integer ratingCount;
    
    // Relations
    private List<ReviewDto> recentReviews;
    private List<ProductDto> relatedProducts;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 