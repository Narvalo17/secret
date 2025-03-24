package fr.yelha.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class OrderItemDto {
    private Long id;
    private Long orderId;
    private Long productId;
    private String productName;
    private String productImage;
    private Integer quantity;
    private Double price;
    private Double totalPrice;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 