package fr.yelha.service;

import fr.yelha.dto.StoreStatisticsDto;
import fr.yelha.model.StoreStatistics;
import fr.yelha.model.Store;
import fr.yelha.repository.StoreStatisticsRepository;
import fr.yelha.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class StoreStatisticsService {
    private final StoreStatisticsRepository storeStatisticsRepository;
    private final StoreRepository storeRepository;

    public StoreStatisticsDto createStoreStatistics(Long storeId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Magasin non trouvé avec l'ID : " + storeId));
        
        StoreStatistics statistics = new StoreStatistics();
        statistics.setStore(store);
        statistics.setLastUpdateAt(LocalDateTime.now());
        
        return convertToDto(storeStatisticsRepository.save(statistics));
    }

    public StoreStatisticsDto updateStoreStatistics(Long id, StoreStatisticsDto statisticsDto) {
        StoreStatistics statistics = getStoreStatisticsOrThrow(id);
        updateStoreStatisticsFromDto(statistics, statisticsDto);
        statistics.setLastUpdateAt(LocalDateTime.now());
        return convertToDto(storeStatisticsRepository.save(statistics));
    }

    public StoreStatisticsDto getStoreStatisticsById(Long id) {
        return convertToDto(getStoreStatisticsOrThrow(id));
    }

    public StoreStatisticsDto getStoreStatisticsByStore(Long storeId) {
        return storeStatisticsRepository.findByStoreId(storeId)
                .map(this::convertToDto)
                .orElseThrow(() -> new RuntimeException("Statistiques non trouvées pour le magasin"));
    }

    public void incrementViewCount(Long storeId) {
        StoreStatistics statistics = storeStatisticsRepository.findByStoreId(storeId)
                .orElseGet(() -> {
                    Store store = storeRepository.findById(storeId)
                            .orElseThrow(() -> new RuntimeException("Magasin non trouvé avec l'ID : " + storeId));
                    StoreStatistics newStats = new StoreStatistics();
                    newStats.setStore(store);
                    return newStats;
                });
        
        statistics.setTotalViews(statistics.getTotalViews() + 1);
        statistics.setDailyViews(statistics.getDailyViews() + 1);
        statistics.setMonthlyViews(statistics.getMonthlyViews() + 1);
        statistics.setLastViewAt(LocalDateTime.now());
        statistics.setLastUpdateAt(LocalDateTime.now());
        
        storeStatisticsRepository.save(statistics);
    }

    public void updateOrderStatistics(Long storeId, Double orderAmount) {
        StoreStatistics statistics = storeStatisticsRepository.findByStoreId(storeId)
                .orElseGet(() -> {
                    Store store = storeRepository.findById(storeId)
                            .orElseThrow(() -> new RuntimeException("Magasin non trouvé avec l'ID : " + storeId));
                    StoreStatistics newStats = new StoreStatistics();
                    newStats.setStore(store);
                    return newStats;
                });
        
        statistics.setTotalOrders(statistics.getTotalOrders() + 1);
        statistics.setTotalRevenue(statistics.getTotalRevenue() + orderAmount);
        statistics.setDailyOrders(statistics.getDailyOrders() + 1);
        statistics.setDailyRevenue(statistics.getDailyRevenue() + orderAmount);
        statistics.setMonthlyOrders(statistics.getMonthlyOrders() + 1);
        statistics.setMonthlyRevenue(statistics.getMonthlyRevenue() + orderAmount);
        statistics.setLastOrderAt(LocalDateTime.now());
        statistics.setLastUpdateAt(LocalDateTime.now());
        
        storeStatisticsRepository.save(statistics);
    }

    public void resetDailyStatistics() {
        List<StoreStatistics> allStatistics = storeStatisticsRepository.findAll();
        allStatistics.forEach(statistics -> {
            statistics.setDailyOrders(0);
            statistics.setDailyRevenue(0.0);
            statistics.setDailyViews(0);
            statistics.setDailyCustomers(0);
        });
        storeStatisticsRepository.saveAll(allStatistics);
    }

    public void resetMonthlyStatistics() {
        List<StoreStatistics> allStatistics = storeStatisticsRepository.findAll();
        allStatistics.forEach(statistics -> {
            statistics.setMonthlyOrders(0);
            statistics.setMonthlyRevenue(0.0);
            statistics.setMonthlyViews(0);
            statistics.setMonthlyCustomers(0);
        });
        storeStatisticsRepository.saveAll(allStatistics);
    }

    private StoreStatistics getStoreStatisticsOrThrow(Long id) {
        return storeStatisticsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Statistiques non trouvées avec l'ID : " + id));
    }

    private void updateStoreStatisticsFromDto(StoreStatistics statistics, StoreStatisticsDto dto) {
        statistics.setTotalOrders(dto.getTotalOrders());
        statistics.setTotalProducts(dto.getTotalProducts());
        statistics.setTotalCustomers(dto.getTotalCustomers());
        statistics.setTotalRevenue(dto.getTotalRevenue());
        statistics.setAverageOrderValue(dto.getAverageOrderValue());
        statistics.setAverageRating(dto.getAverageRating());
        statistics.setTotalReviews(dto.getTotalReviews());
        statistics.setTotalViews(dto.getTotalViews());
        statistics.setTotalFavorites(dto.getTotalFavorites());
        statistics.setDailyOrders(dto.getDailyOrders());
        statistics.setDailyRevenue(dto.getDailyRevenue());
        statistics.setDailyViews(dto.getDailyViews());
        statistics.setDailyCustomers(dto.getDailyCustomers());
        statistics.setMonthlyOrders(dto.getMonthlyOrders());
        statistics.setMonthlyRevenue(dto.getMonthlyRevenue());
        statistics.setMonthlyViews(dto.getMonthlyViews());
        statistics.setMonthlyCustomers(dto.getMonthlyCustomers());
    }

    private StoreStatisticsDto convertToDto(StoreStatistics statistics) {
        StoreStatisticsDto dto = new StoreStatisticsDto();
        dto.setId(statistics.getId());
        dto.setStoreId(statistics.getStore().getId());
        dto.setStoreName(statistics.getStore().getName());
        dto.setTotalOrders(statistics.getTotalOrders());
        dto.setTotalProducts(statistics.getTotalProducts());
        dto.setTotalCustomers(statistics.getTotalCustomers());
        dto.setTotalRevenue(statistics.getTotalRevenue());
        dto.setAverageOrderValue(statistics.getAverageOrderValue());
        dto.setAverageRating(statistics.getAverageRating());
        dto.setTotalReviews(statistics.getTotalReviews());
        dto.setTotalViews(statistics.getTotalViews());
        dto.setTotalFavorites(statistics.getTotalFavorites());
        dto.setDailyOrders(statistics.getDailyOrders());
        dto.setDailyRevenue(statistics.getDailyRevenue());
        dto.setDailyViews(statistics.getDailyViews());
        dto.setDailyCustomers(statistics.getDailyCustomers());
        dto.setMonthlyOrders(statistics.getMonthlyOrders());
        dto.setMonthlyRevenue(statistics.getMonthlyRevenue());
        dto.setMonthlyViews(statistics.getMonthlyViews());
        dto.setMonthlyCustomers(statistics.getMonthlyCustomers());
        dto.setLastOrderAt(statistics.getLastOrderAt());
        dto.setLastViewAt(statistics.getLastViewAt());
        dto.setLastUpdateAt(statistics.getLastUpdateAt());
        dto.setCreatedAt(statistics.getCreatedAt());
        dto.setUpdatedAt(statistics.getUpdatedAt());
        return dto;
    }
} 