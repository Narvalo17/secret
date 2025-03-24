package fr.yelha.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PromotionDto {
    private Long id;

    @NotBlank(message = "Le code de promotion est obligatoire")
    private String code;

    @NotBlank(message = "La description est obligatoire")
    private String description;

    @NotNull(message = "Le pourcentage de réduction est obligatoire")
    @PositiveOrZero(message = "Le pourcentage de réduction doit être positif ou nul")
    private Double discountPercentage;

    @NotNull(message = "Le magasin est obligatoire")
    private Long storeId;

    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<Long> productIds;
    private List<String> productNames;
    private List<Long> categoryIds;
    private List<String> categoryNames;

    public boolean isValid() {
        LocalDateTime now = LocalDateTime.now();
        return isActive &&
               now.isAfter(startDate) &&
               now.isBefore(endDate);
    }

    public String getFormattedValue() {
        return discountPercentage.toString() + "%";
    }
} 