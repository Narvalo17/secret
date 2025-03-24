package fr.yelha.repository;

import fr.yelha.model.Store;
import fr.yelha.model.StoreStatistics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface StoreStatisticsRepository extends JpaRepository<StoreStatistics, Long> {
    Optional<StoreStatistics> findByStore(Store store);
    
    @Query("SELECT ss FROM StoreStatistics ss ORDER BY ss.totalRevenue DESC")
    List<StoreStatistics> findTopRevenueStores();
    
    @Query("SELECT ss FROM StoreStatistics ss ORDER BY ss.averageRating DESC")
    List<StoreStatistics> findTopRatedStores();
    
    @Query("SELECT ss FROM StoreStatistics ss WHERE ss.lastOrderAt >= :startDate " +
           "ORDER BY ss.dailyRevenue DESC")
    List<StoreStatistics> findTopDailyRevenueStores(LocalDateTime startDate);
    
    @Query("SELECT ss FROM StoreStatistics ss WHERE ss.lastUpdateAt < :date")
    List<StoreStatistics> findStoresNeedingUpdate(LocalDateTime date);

    Optional<StoreStatistics> findByStoreId(Long storeId);
} 