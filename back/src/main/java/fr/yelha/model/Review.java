package fr.yelha.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private Integer rating; // 1-5
    private String comment;
    private String title;
    private Boolean isVerifiedPurchase;
    private Boolean isApproved;
    private Integer helpfulVotes;
    private Integer unhelpfulVotes;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (helpfulVotes == null) helpfulVotes = 0;
        if (unhelpfulVotes == null) unhelpfulVotes = 0;
        if (isApproved == null) isApproved = false;
        if (isVerifiedPurchase == null) isVerifiedPurchase = false;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
} 