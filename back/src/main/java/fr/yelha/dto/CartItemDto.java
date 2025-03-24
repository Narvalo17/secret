package fr.yelha.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CartItemDto {
    private Long id;
    private Long cartId;
    private Long productId;
    private String productName;
    private String productImage;
    private Double productPrice;
    private Integer quantity;
    private Double totalPrice;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 