package fr.yelha.service;

import fr.yelha.dto.ShoppingCartDto;
import fr.yelha.dto.ShoppingCartDetailDto;
import fr.yelha.model.ShoppingCartDetail;
import fr.yelha.model.User;
import fr.yelha.model.Product;
import fr.yelha.repository.ShoppingCartDetailRepository;
import fr.yelha.repository.UserRepository;
import fr.yelha.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ShoppingCartService {
    private final ShoppingCartDetailRepository cartDetailRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public ShoppingCartDto getCartByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID : " + userId));
        
        List<ShoppingCartDetail> cartItems = cartDetailRepository.findByUserId(userId);
        return convertToDto(user, cartItems);
    }

    public ShoppingCartDto addItemToCart(Long userId, Long productId, Integer quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID : " + userId));
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé avec l'ID : " + productId));
        
        if (!product.isAvailable()) {
            throw new RuntimeException("Le produit n'est pas disponible");
        }
        
        // Vérifier si le produit existe déjà dans le panier
        ShoppingCartDetail cartItem = cartDetailRepository.findByUserIdAndProductId(userId, productId)
                .orElseGet(() -> {
                    ShoppingCartDetail newItem = new ShoppingCartDetail();
                    newItem.setUser(user);
                    newItem.setProduct(product);
                    newItem.setQuantity(quantity);
                    return newItem;
                });

        if (cartItem.getId() != null) {
            // Si le produit existe déjà, mettre à jour la quantité
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
        }
        
        cartDetailRepository.save(cartItem);
        List<ShoppingCartDetail> cartItems = cartDetailRepository.findByUserId(userId);
        return convertToDto(user, cartItems);
    }

    public ShoppingCartDto updateCartItemQuantity(Long userId, Long productId, Integer quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID : " + userId));
        
        ShoppingCartDetail cartItem = cartDetailRepository.findByUserIdAndProductId(userId, productId)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé dans le panier"));
        
        if (quantity <= 0) {
            cartDetailRepository.delete(cartItem);
        } else {
            cartItem.setQuantity(quantity);
            cartDetailRepository.save(cartItem);
        }
        
        List<ShoppingCartDetail> cartItems = cartDetailRepository.findByUserId(userId);
        return convertToDto(user, cartItems);
    }

    public ShoppingCartDto removeItemFromCart(Long userId, Long productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID : " + userId));
        
        cartDetailRepository.deleteByUserIdAndProductId(userId, productId);
        
        List<ShoppingCartDetail> cartItems = cartDetailRepository.findByUserId(userId);
        return convertToDto(user, cartItems);
    }

    public void clearCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID : " + userId));
        
        cartDetailRepository.deleteByUserId(userId);
    }

    private ShoppingCartDto convertToDto(User user, List<ShoppingCartDetail> items) {
        ShoppingCartDto dto = new ShoppingCartDto();
        dto.setUserId(user.getId());
        
        List<ShoppingCartDetailDto> itemDtos = items.stream()
                .map(this::convertCartItemToDto)
                .collect(Collectors.toList());
        dto.setItems(itemDtos);
        
        // Calculer les totaux
        double totalAmount = items.stream()
                .mapToDouble(item -> item.getQuantity() * item.getProduct().getPrice().doubleValue())
                .sum();
        int totalItems = items.stream()
                .mapToInt(ShoppingCartDetail::getQuantity)
                .sum();
        
        dto.setTotalAmount(totalAmount);
        dto.setTotalItems(totalItems);
        
        return dto;
    }

    private ShoppingCartDetailDto convertCartItemToDto(ShoppingCartDetail item) {
        ShoppingCartDetailDto dto = new ShoppingCartDetailDto();
        dto.setId(item.getId());
        dto.setUserId(item.getUser().getId());
        dto.setProductId(item.getProduct().getId());
        dto.setProductName(item.getProduct().getName());
        dto.setProductImage(item.getProduct().getImageUrl());
        dto.setProductPrice(item.getProduct().getPrice().doubleValue());
        dto.setQuantity(item.getQuantity());
        dto.setTotalPrice(item.getProduct().getPrice().doubleValue() * item.getQuantity());
        dto.setCreatedAt(item.getCreatedAt());
        dto.setUpdatedAt(item.getUpdatedAt());
        return dto;
    }
} 