package fr.yelha.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ShoppingCartDto {
    private Long id;
    private Long userId;
    private List<ShoppingCartDetailDto> items;
    private Double totalAmount;
    private Integer totalItems;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 