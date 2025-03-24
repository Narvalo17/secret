package fr.yelha.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReviewDto {
    private Long id;
    private Long userId;
    private String userName;
    private String userImage;
    private Long storeId;
    private String storeName;
    private Long productId;
    private String productName;
    private Integer rating;
    private String comment;
    private String title;
    private Boolean isVerifiedPurchase;
    private Boolean isApproved;
    private Integer helpfulVotes;
    private Integer unhelpfulVotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 