package fr.yelha.dto;

import lombok.Data;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
public class StoreHoursDto {
    private Long id;
    private Long storeId;
    private DayOfWeek dayOfWeek;
    private LocalTime openTime;
    private LocalTime closeTime;
    private Boolean isClosed;
    private LocalTime specialOpenTime;
    private LocalTime specialCloseTime;
    private String specialHours;
    private String note;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
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