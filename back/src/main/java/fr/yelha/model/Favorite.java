package fr.yelha.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "favorites")
public class Favorite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "store_id")
    private Store store;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        validateEntity();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        validateEntity();
    }

    // Méthode utilitaire pour vérifier si l'entité est valide
    protected void validateEntity() {
        if (store == null && product == null) {
            throw new IllegalStateException("Un favori doit être associé soit à un magasin, soit à un produit");
        }
        if (store != null && product != null) {
            throw new IllegalStateException("Un favori ne peut pas être associé à la fois à un magasin et à un produit");
        }
    }
} 