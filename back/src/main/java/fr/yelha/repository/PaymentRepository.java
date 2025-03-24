package fr.yelha.repository;

import fr.yelha.model.Order;
import fr.yelha.model.Payment;
import fr.yelha.model.User;
import fr.yelha.model.enums.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Page<Payment> findByUser(User user, Pageable pageable);
    Optional<Payment> findByOrder(Order order);
    List<Payment> findByStatus(PaymentStatus status);
    Optional<Payment> findByTransactionId(String transactionId);
    
    @Query("SELECT p FROM Payment p WHERE p.user = :user AND p.createdAt >= :startDate")
    List<Payment> findRecentPayments(User user, LocalDateTime startDate);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.user = :user AND p.status = :status")
    Double calculateTotalAmountByStatus(User user, PaymentStatus status);
} 