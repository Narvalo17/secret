package fr.yelha.service;

import fr.yelha.dto.OrderDto;
import fr.yelha.model.Order;
import fr.yelha.model.User;
import fr.yelha.model.Store;
import fr.yelha.model.enums.OrderStatus;
import fr.yelha.model.enums.PaymentStatus;
import fr.yelha.repository.OrderRepository;
import fr.yelha.repository.UserRepository;
import fr.yelha.repository.StoreRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final StoreRepository storeRepository;

    public OrderDto createOrder(OrderDto orderDto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        
        Store store = storeRepository.findById(orderDto.getStoreId())
                .orElseThrow(() -> new EntityNotFoundException("Store not found"));

        Order order = new Order();
        order.setUser(user);
        order.setStore(store);
        order.setStatus(OrderStatus.PENDING);
        
        // TODO: Convertir OrderItemDto en OrderItem et les ajouter à la commande
        
        return convertToDto(orderRepository.save(order));
    }

    public OrderDto updateOrder(Long id, OrderDto orderDto) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));

        // TODO: Mettre à jour les champs de la commande
        
        return convertToDto(orderRepository.save(order));
    }

    public OrderDto getOrderById(Long id) {
        return orderRepository.findById(id)
                .map(this::convertToDto)
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));
    }

    public Page<OrderDto> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable)
                .map(this::convertToDto);
    }

    public Page<OrderDto> getOrdersByUser(Long userId, Pageable pageable) {
        return orderRepository.findByUserId(userId, pageable)
                .map(this::convertToDto);
    }

    public Page<OrderDto> getOrdersByStore(Long storeId, Pageable pageable) {
        return orderRepository.findByStoreId(storeId, pageable)
                .map(this::convertToDto);
    }

    public OrderDto updateOrderStatus(Long id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));
        
        order.setStatus(status);
        return convertToDto(orderRepository.save(order));
    }

    public OrderDto updatePaymentStatus(Long id, PaymentStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));
        
        order.setPaymentStatus(status);
        if (status == PaymentStatus.PAID) {
            order.setPaidAt(LocalDateTime.now());
        }
        return convertToDto(orderRepository.save(order));
    }

    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new EntityNotFoundException("Order not found");
        }
        orderRepository.deleteById(id);
    }

    public OrderDto cancelOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));
        
        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new IllegalStateException("Order is already cancelled");
        }
        
        order.setStatus(OrderStatus.CANCELLED);
        return convertToDto(orderRepository.save(order));
    }

    public boolean isOrderOwner(Long orderId, Long userId) {
        return orderRepository.existsByIdAndUserId(orderId, userId);
    }

    public boolean isStoreOwner(Long storeId, Long userId) {
        return storeRepository.existsByIdAndOwnerId(storeId, userId);
    }

    private OrderDto convertToDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setUserId(order.getUser().getId());
        dto.setStoreId(order.getStore().getId());
        dto.setStatus(order.getStatus());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());
        // TODO: Convertir les OrderItem en OrderItemDto
        return dto;
    }
} 