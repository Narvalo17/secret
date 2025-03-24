package fr.yelha.repository;

import fr.yelha.model.Product;
import fr.yelha.model.Review;
import fr.yelha.model.Store;
import fr.yelha.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Page<Review> findByStore(Store store, Pageable pageable);
    Page<Review> findByProduct(Product product, Pageable pageable);
    Page<Review> findByUser(User user, Pageable pageable);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.store = :store AND r.isApproved = true")
    Double calculateAverageRatingForStore(Store store);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.store = :store AND r.isApproved = true")
    Long countApprovedReviewsForStore(Store store);
    
    @Query("SELECT r FROM Review r WHERE r.store = :store AND r.isApproved = true " +
           "ORDER BY r.helpfulVotes DESC")
    Page<Review> findMostHelpfulReviews(Store store, Pageable pageable);
} 