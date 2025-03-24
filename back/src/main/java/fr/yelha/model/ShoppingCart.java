package fr.yelha.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "shopping_carts")
public class ShoppingCart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "shoppingCart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ShoppingCartDetail> items = new ArrayList<>();

    @Column(nullable = false)
    private Double totalAmount = 0.0;

    @Column(nullable = false)
    private Integer totalItems = 0;

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

    public void addItem(ShoppingCartDetail item) {
        items.add(item);
        item.setShoppingCart(this);
        updateCartTotals();
    }

    public void removeItem(ShoppingCartDetail item) {
        items.remove(item);
        item.setShoppingCart(null);
        updateCartTotals();
    }

    public void updateCartTotals() {
        this.totalAmount = items.stream()
                .mapToDouble(item -> item.getQuantity() * item.getProduct().getPrice().doubleValue())
                .sum();
        this.totalItems = items.stream()
                .mapToInt(ShoppingCartDetail::getQuantity)
                .sum();
    }

    public void clear() {
        items.clear();
        totalAmount = 0.0;
        totalItems = 0;
    }
}
