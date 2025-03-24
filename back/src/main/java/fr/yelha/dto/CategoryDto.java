package fr.yelha.dto;

import fr.yelha.model.enums.CategoryType;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class CategoryDto {
    private Long id;
    private String name;
    private String description;
    private String slug;
    private String imageUrl;
    private Boolean isActive;
    private CategoryType type;
    private Long parentId;
    private String parentName;
    private List<CategoryDto> children;
    private Integer level;
    private String path;
    
    // Statistiques
    private Integer totalProducts;
    private Integer totalStores;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 