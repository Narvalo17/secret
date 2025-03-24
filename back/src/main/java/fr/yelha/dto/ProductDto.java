package fr.yelha.dto;

import fr.yelha.model.Category;
import fr.yelha.model.Store;
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

    @NotBlank(message = "Le nom est obligatoire")
    private String name;

    private String description;

    @NotNull(message = "Le prix est obligatoire")
    @Positive(message = "Le prix doit être positif")
    private BigDecimal price;

    @NotNull(message = "La quantité est obligatoire")
    @Positive(message = "La quantité doit être positive")
    private Integer quantity;

    private boolean active = true;

    private Category category;

    @NotNull(message = "Le magasin est obligatoire")
    private Store store;

    private String imageUrl;

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