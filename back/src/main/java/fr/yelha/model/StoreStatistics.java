package fr.yelha.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "store_statistics")
public class StoreStatistics {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    private Integer totalOrders = 0;
    private Integer totalProducts = 0;
    private Integer totalCustomers = 0;
    private Double totalRevenue = 0.0;
    private Double averageOrderValue = 0.0;
    private Double averageRating = 0.0;
    private Integer totalReviews = 0;
    private Integer totalViews = 0;
    private Integer totalFavorites = 0;

    // Statistiques journalières
    private Integer dailyOrders = 0;
    private Double dailyRevenue = 0.0;
    private Integer dailyViews = 0;
    private Integer dailyCustomers = 0;

    // Statistiques mensuelles
    private Integer monthlyOrders = 0;
    private Double monthlyRevenue = 0.0;
    private Integer monthlyViews = 0;
    private Integer monthlyCustomers = 0;

    private LocalDateTime lastOrderAt;
    private LocalDateTime lastViewAt;
    private LocalDateTime lastUpdateAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public void incrementOrders(Double orderValue) {
        this.totalOrders++;
        this.dailyOrders++;
        this.monthlyOrders++;
        this.totalRevenue += orderValue;
        this.dailyRevenue += orderValue;
        this.monthlyRevenue += orderValue;
        this.averageOrderValue = this.totalRevenue / this.totalOrders;
        this.lastOrderAt = LocalDateTime.now();
    }

    public void incrementViews() {
        this.totalViews++;
        this.dailyViews++;
        this.monthlyViews++;
        this.lastViewAt = LocalDateTime.now();
    }

    public void updateRating(Double newRating) {
        this.totalReviews++;
        this.averageRating = ((this.averageRating * (this.totalReviews - 1)) + newRating) / this.totalReviews;
    }

    public void resetDailyStats() {
        this.dailyOrders = 0;
        this.dailyRevenue = 0.0;
        this.dailyViews = 0;
        this.dailyCustomers = 0;
    }

    public void resetMonthlyStats() {
        this.monthlyOrders = 0;
        this.monthlyRevenue = 0.0;
        this.monthlyViews = 0;
        this.monthlyCustomers = 0;
    }
} 