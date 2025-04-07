package fr.yelha.repository;

import fr.yelha.model.FavoriteStore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoriteStoreRepository extends JpaRepository<FavoriteStore, Long> {
    @Query("SELECT fs FROM FavoriteStore fs JOIN FETCH fs.store WHERE fs.user.id = :userId")
    List<FavoriteStore> findByUserId(@Param("userId") Long userId);
    
    void deleteByStoreIdAndUserId(Long storeId, Long userId);
    boolean existsByStoreIdAndUserId(Long storeId, Long userId);
} 