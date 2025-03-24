package fr.yelha.service;

import fr.yelha.dto.StoreHoursDto;
import fr.yelha.model.StoreHours;
import fr.yelha.model.Store;
import fr.yelha.repository.StoreHoursRepository;
import fr.yelha.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class StoreHoursService {
    private final StoreHoursRepository storeHoursRepository;
    private final StoreRepository storeRepository;

    public StoreHoursDto createStoreHours(StoreHoursDto storeHoursDto) {
        Store store = storeRepository.findById(storeHoursDto.getStoreId())
                .orElseThrow(() -> new RuntimeException("Magasin non trouvé avec l'ID : " + storeHoursDto.getStoreId()));
        
        StoreHours storeHours = new StoreHours();
        updateStoreHoursFromDto(storeHours, storeHoursDto);
        storeHours.setStore(store);
        
        return convertToDto(storeHoursRepository.save(storeHours));
    }

    public StoreHoursDto updateStoreHours(Long id, StoreHoursDto storeHoursDto) {
        StoreHours storeHours = getStoreHoursOrThrow(id);
        updateStoreHoursFromDto(storeHours, storeHoursDto);
        return convertToDto(storeHoursRepository.save(storeHours));
    }

    public StoreHoursDto getStoreHoursById(Long id) {
        return convertToDto(getStoreHoursOrThrow(id));
    }

    public List<StoreHoursDto> getStoreHoursByStore(Long storeId) {
        return storeHoursRepository.findByStoreId(storeId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public StoreHoursDto getStoreHoursByDay(Long storeId, DayOfWeek dayOfWeek) {
        return storeHoursRepository.findByStoreIdAndDayOfWeek(storeId, dayOfWeek)
                .map(this::convertToDto)
                .orElseThrow(() -> new RuntimeException("Horaires non trouvés pour ce jour"));
    }

    public void deleteStoreHours(Long id) {
        storeHoursRepository.deleteById(id);
    }

    public void updateSpecialHours(Long storeId, DayOfWeek dayOfWeek, LocalTime openTime, LocalTime closeTime, String note) {
        StoreHours storeHours = storeHoursRepository.findByStoreIdAndDayOfWeek(storeId, dayOfWeek)
                .orElseThrow(() -> new RuntimeException("Horaires non trouvés pour ce jour"));
        
        storeHours.setSpecialOpenTime(openTime);
        storeHours.setSpecialCloseTime(closeTime);
        storeHours.setNote(note);
        
        storeHoursRepository.save(storeHours);
    }

    private StoreHours getStoreHoursOrThrow(Long id) {
        return storeHoursRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Horaires non trouvés avec l'ID : " + id));
    }

    private void updateStoreHoursFromDto(StoreHours storeHours, StoreHoursDto dto) {
        storeHours.setDayOfWeek(dto.getDayOfWeek());
        storeHours.setOpenTime(dto.getOpenTime());
        storeHours.setCloseTime(dto.getCloseTime());
        storeHours.setIsClosed(dto.getIsClosed() != null ? dto.getIsClosed() : false);
        storeHours.setSpecialOpenTime(dto.getSpecialOpenTime());
        storeHours.setSpecialCloseTime(dto.getSpecialCloseTime());
        storeHours.setNote(dto.getNote());
    }

    private StoreHoursDto convertToDto(StoreHours storeHours) {
        StoreHoursDto dto = new StoreHoursDto();
        dto.setId(storeHours.getId());
        dto.setStoreId(storeHours.getStore().getId());
        dto.setDayOfWeek(storeHours.getDayOfWeek());
        dto.setOpenTime(storeHours.getOpenTime());
        dto.setCloseTime(storeHours.getCloseTime());
        dto.setIsClosed(storeHours.getIsClosed());
        dto.setSpecialOpenTime(storeHours.getSpecialOpenTime());
        dto.setSpecialCloseTime(storeHours.getSpecialCloseTime());
        dto.setNote(storeHours.getNote());
        dto.setCreatedAt(storeHours.getCreatedAt());
        dto.setUpdatedAt(storeHours.getUpdatedAt());
        return dto;
    }
} 