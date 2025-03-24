package fr.yelha.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Entity
@Table(name = "store_hours")
public class StoreHours {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @Enumerated(EnumType.STRING)
    private DayOfWeek dayOfWeek;

    private LocalTime openTime;
    private LocalTime closeTime;
    private Boolean isClosed = false;
    private LocalTime specialOpenTime;
    private LocalTime specialCloseTime;
    private String note; // Informations supplémentaires

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public boolean isOpenNow() {
        if (isClosed) return false;
        
        LocalTime now = LocalTime.now();
        DayOfWeek today = LocalDateTime.now().getDayOfWeek();
        
        if (today != dayOfWeek) return false;
        
        return now.isAfter(openTime) && now.isBefore(closeTime);
    }

    public String getFormattedHours() {
        if (isClosed) return "Fermé";
        return openTime.toString() + " - " + closeTime.toString();
    }
} 