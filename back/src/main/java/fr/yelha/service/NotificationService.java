package fr.yelha.service;

import fr.yelha.dto.NotificationDto;
import fr.yelha.model.Notification;
import fr.yelha.model.User;
import fr.yelha.repository.NotificationRepository;
import fr.yelha.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationDto createNotification(NotificationDto notificationDto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID : " + userId));
        
        Notification notification = new Notification();
        updateNotificationFromDto(notification, notificationDto);
        notification.setUser(user);
        
        return convertToDto(notificationRepository.save(notification));
    }

    public NotificationDto updateNotification(Long id, NotificationDto notificationDto) {
        Notification notification = getNotificationOrThrow(id);
        updateNotificationFromDto(notification, notificationDto);
        return convertToDto(notificationRepository.save(notification));
    }

    public NotificationDto getNotificationById(Long id) {
        return convertToDto(getNotificationOrThrow(id));
    }

    public Page<NotificationDto> getNotificationsByUser(Long userId, Pageable pageable) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::convertToDto);
    }

    public List<NotificationDto> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public NotificationDto markAsRead(Long id) {
        Notification notification = getNotificationOrThrow(id);
        notification.setIsRead(true);
        notification.setReadAt(LocalDateTime.now());
        return convertToDto(notificationRepository.save(notification));
    }

    public void markAllAsRead(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndIsReadFalse(userId);
        notifications.forEach(notification -> {
            notification.setIsRead(true);
            notification.setReadAt(LocalDateTime.now());
        });
        notificationRepository.saveAll(notifications);
    }

    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }

    public void deleteExpiredNotifications() {
        List<Notification> expiredNotifications = notificationRepository.findByExpiresAtBeforeAndIsReadTrue(LocalDateTime.now());
        notificationRepository.deleteAll(expiredNotifications);
    }

    private Notification getNotificationOrThrow(Long id) {
        return notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification non trouvée avec l'ID : " + id));
    }

    private void updateNotificationFromDto(Notification notification, NotificationDto dto) {
        notification.setTitle(dto.getTitle());
        notification.setMessage(dto.getMessage());
        notification.setType(dto.getType());
        notification.setLink(dto.getLink());
        notification.setIcon(dto.getIcon());
        notification.setAction(dto.getAction());
        notification.setCategory(dto.getCategory());
        notification.setExpiresAt(dto.getExpiresAt());
    }

    private NotificationDto convertToDto(Notification notification) {
        NotificationDto dto = new NotificationDto();
        dto.setId(notification.getId());
        dto.setUserId(notification.getUser().getId());
        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getMessage());
        dto.setType(notification.getType());
        dto.setLink(notification.getLink());
        dto.setIsRead(notification.getIsRead());
        dto.setIcon(notification.getIcon());
        dto.setAction(notification.getAction());
        dto.setCategory(notification.getCategory());
        dto.setCreatedAt(notification.getCreatedAt());
        dto.setUpdatedAt(notification.getUpdatedAt());
        dto.setReadAt(notification.getReadAt());
        dto.setExpiresAt(notification.getExpiresAt());
        return dto;
    }
} 