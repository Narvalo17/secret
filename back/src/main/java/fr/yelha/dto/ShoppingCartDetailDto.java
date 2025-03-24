package fr.yelha.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ShoppingCartDetailDto {
    private Long id;
    private Long cartId;
    
    @NotNull(message = "L'ID du produit est requis")
    private Long productId;
    
    private String productName;
    private String productImage;
    private Double productPrice;
    
    @NotNull(message = "La quantité est requise")
    @Min(value = 1, message = "La quantité doit être supérieure à 0")
    private Integer quantity;
    
    private Double totalPrice;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 