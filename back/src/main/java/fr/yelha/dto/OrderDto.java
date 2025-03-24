package fr.yelha.dto;

import fr.yelha.model.enums.OrderStatus;
import fr.yelha.model.enums.PaymentMethod;
import fr.yelha.model.enums.PaymentStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDto {
    private Long id;
    
    @NotNull
    private Long userId;
    
    @NotNull
    private Long storeId;
    
    @Valid
    private List<OrderItemDto> items;
    
    private OrderStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 