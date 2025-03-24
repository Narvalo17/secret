package fr.yelha.repository;

import fr.yelha.model.StoreHours;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

@Repository
public interface StoreHoursRepository extends JpaRepository<StoreHours, Long> {
    List<StoreHours> findByStoreId(Long storeId);
    Optional<StoreHours> findByStoreIdAndDayOfWeek(Long storeId, DayOfWeek dayOfWeek);
} 