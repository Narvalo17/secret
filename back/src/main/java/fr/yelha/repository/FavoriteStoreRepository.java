package fr.yelha.repository;

import fr.yelha.model.FavoriteStore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoriteStoreRepository extends JpaRepository<FavoriteStore, Long> {
    List<FavoriteStore> findByUserId(Long userId);
    void deleteByStoreIdAndUserId(Long storeId, Long userId);
    boolean existsByStoreIdAndUserId(Long storeId, Long userId);
} 