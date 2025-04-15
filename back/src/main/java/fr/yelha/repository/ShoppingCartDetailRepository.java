package fr.yelha.repository;

import fr.yelha.model.ShoppingCartDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShoppingCartDetailRepository extends JpaRepository<ShoppingCartDetail, Long> {
    List<ShoppingCartDetail> findByUserId(Long userId);
    Optional<ShoppingCartDetail> findByUserIdAndProductId(Long userId, Long productId);
    void deleteByUserIdAndProductId(Long userId, Long productId);
    void deleteByUserId(Long userId);
} 