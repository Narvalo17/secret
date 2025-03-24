package fr.yelha.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class StoreStatisticsDto {
    private Long id;
    private Long storeId;
    private String storeName;
    
    // Statistiques globales
    private Integer totalOrders;
    private Integer totalProducts;
    private Integer totalCustomers;
    private Double totalRevenue;
    private Double averageOrderValue;
    private Double averageRating;
    private Integer totalReviews;
    private Integer totalViews;
    private Integer totalFavorites;
    
    // Statistiques journalières
    private Integer dailyOrders;
    private Double dailyRevenue;
    private Integer dailyViews;
    private Integer dailyCustomers;
    
    // Statistiques mensuelles
    private Integer monthlyOrders;
    private Double monthlyRevenue;
    private Integer monthlyViews;
    private Integer monthlyCustomers;
    
    private LocalDateTime lastOrderAt;
    private LocalDateTime lastViewAt;
    private LocalDateTime lastUpdateAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 