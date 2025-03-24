package fr.yelha.repository;

import fr.yelha.model.Order;
import fr.yelha.model.Store;
import fr.yelha.model.User;
import fr.yelha.model.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByUserId(Long userId, Pageable pageable);
    Page<Order> findByStoreId(Long storeId, Pageable pageable);
    Optional<Order> findByOrderNumber(String orderNumber);
    
    List<Order> findByUserIdAndStatus(Long userId, OrderStatus status);
    List<Order> findByStoreIdAndStatus(Long storeId, OrderStatus status);
    
    @Query("SELECT o FROM Order o WHERE o.status = :status AND o.createdAt < :date")
    List<Order> findOrdersByStatusAndCreatedBefore(OrderStatus status, LocalDateTime date);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.store.id = :storeId AND o.status = :status")
    Long countOrdersByStoreAndStatus(Long storeId, OrderStatus status);
    
    @Query("SELECT o FROM Order o WHERE o.store = :store AND o.createdAt >= :startDate")
    List<Order> findRecentOrdersByStore(Store store, LocalDateTime startDate);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.store = :store AND o.status = :status")
    Long countByStoreAndStatus(Store store, OrderStatus status);
    
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.store = :store AND o.createdAt >= :startDate")
    Double calculateRevenueByStore(Store store, LocalDateTime startDate);

    boolean existsByIdAndUserId(Long orderId, Long userId);
} 