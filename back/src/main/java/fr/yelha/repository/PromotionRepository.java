package fr.yelha.repository;

import fr.yelha.model.Promotion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    Page<Promotion> findByStoreId(Long storeId, Pageable pageable);
    Page<Promotion> findByIsActiveTrue(Pageable pageable);
    Page<Promotion> findByStoreIdAndIsActiveTrue(Long storeId, Pageable pageable);
    Optional<Promotion> findByCodeAndStoreId(String code, Long storeId);
    boolean existsByIdAndStoreOwnerId(Long promotionId, Long ownerId);
    
    @Query("SELECT p FROM Promotion p WHERE p.isActive = true AND p.startDate <= :now AND p.endDate >= :now")
    Page<Promotion> findActivePromotions(LocalDateTime now, Pageable pageable);
    
    @Query("SELECT p FROM Promotion p WHERE p.isActive = true AND p.startDate <= :now AND p.endDate >= :now AND p.store.id = :storeId")
    Page<Promotion> findActivePromotionsByStore(Long storeId, LocalDateTime now, Pageable pageable);
    
    List<Promotion> findByStoreIdAndIsActiveTrue(Long storeId);
} 