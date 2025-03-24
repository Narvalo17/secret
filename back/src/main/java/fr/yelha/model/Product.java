package fr.yelha.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private boolean active = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @Column(name = "image_url")
    private String imageUrl;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public void updateStock(int quantity) {
        if (quantity < 0) {
            throw new IllegalArgumentException("La quantité ne peut pas être négative");
        }
        this.quantity = quantity;
    }

    public void addToStock(int quantity) {
        if (quantity < 0) {
            throw new IllegalArgumentException("La quantité ne peut pas être négative");
        }
        this.quantity += quantity;
    }

    public void removeFromStock(int quantity) {
        if (quantity < 0) {
            throw new IllegalArgumentException("La quantité ne peut pas être négative");
        }
        if (this.quantity < quantity) {
            throw new IllegalStateException("Stock insuffisant");
        }
        this.quantity -= quantity;
    }

    public boolean isAvailable() {
        return active && quantity > 0;
    }
}
