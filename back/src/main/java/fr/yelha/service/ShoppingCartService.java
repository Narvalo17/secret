package fr.yelha.service;

import fr.yelha.dto.ShoppingCartDto;
import fr.yelha.dto.ShoppingCartDetailDto;
import fr.yelha.model.ShoppingCart;
import fr.yelha.model.ShoppingCartDetail;
import fr.yelha.model.User;
import fr.yelha.model.Product;
import fr.yelha.repository.ShoppingCartRepository;
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
    private final ShoppingCartRepository shoppingCartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public ShoppingCartDto getCartByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID : " + userId));
        
        ShoppingCart cart = shoppingCartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    ShoppingCart newCart = new ShoppingCart();
                    newCart.setUser(user);
                    return shoppingCartRepository.save(newCart);
                });
        
        return convertToDto(cart);
    }

    public ShoppingCartDto addItemToCart(Long userId, Long productId, Integer quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID : " + userId));
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé avec l'ID : " + productId));
        
        if (!product.isAvailable()) {
            throw new RuntimeException("Le produit n'est pas disponible");
        }
        
        ShoppingCart cart = shoppingCartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    ShoppingCart newCart = new ShoppingCart();
                    newCart.setUser(user);
                    return shoppingCartRepository.save(newCart);
                });
        
        ShoppingCartDetail cartItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElseGet(() -> {
                    ShoppingCartDetail newItem = new ShoppingCartDetail();
                    newItem.setShoppingCart(cart);
                    newItem.setProduct(product);
                    newItem.setQuantity(0);
                    return newItem;
                });
        
        cartItem.setQuantity(cartItem.getQuantity() + quantity);
        cart.addItem(cartItem);
        
        return convertToDto(shoppingCartRepository.save(cart));
    }

    public ShoppingCartDto updateCartItemQuantity(Long userId, Long productId, Integer quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID : " + userId));
        
        ShoppingCart cart = shoppingCartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Panier non trouvé pour l'utilisateur"));
        
        ShoppingCartDetail cartItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Produit non trouvé dans le panier"));
        
        cartItem.setQuantity(quantity);
        
        if (quantity <= 0) {
            cart.removeItem(cartItem);
        }
        
        return convertToDto(shoppingCartRepository.save(cart));
    }

    public ShoppingCartDto removeItemFromCart(Long userId, Long productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID : " + userId));
        
        ShoppingCart cart = shoppingCartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Panier non trouvé pour l'utilisateur"));
        
        cart.getItems().removeIf(item -> item.getProduct().getId().equals(productId));
        
        return convertToDto(shoppingCartRepository.save(cart));
    }

    public void clearCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID : " + userId));
        
        ShoppingCart cart = shoppingCartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Panier non trouvé pour l'utilisateur"));
        
        cart.clear();
        shoppingCartRepository.save(cart);
    }

    private ShoppingCartDto convertToDto(ShoppingCart cart) {
        ShoppingCartDto dto = new ShoppingCartDto();
        dto.setId(cart.getId());
        dto.setUserId(cart.getUser().getId());
        
        List<ShoppingCartDetailDto> items = cart.getItems().stream()
                .map(this::convertCartItemToDto)
                .collect(Collectors.toList());
        dto.setItems(items);
        
        dto.setTotalAmount(cart.getTotalAmount());
        dto.setTotalItems(cart.getTotalItems());
        dto.setCreatedAt(cart.getCreatedAt());
        dto.setUpdatedAt(cart.getUpdatedAt());
        
        return dto;
    }

    private ShoppingCartDetailDto convertCartItemToDto(ShoppingCartDetail item) {
        ShoppingCartDetailDto dto = new ShoppingCartDetailDto();
        dto.setId(item.getId());
        dto.setCartId(item.getShoppingCart().getId());
        dto.setProductId(item.getProduct().getId());
        dto.setProductName(item.getProduct().getName());
        dto.setProductImage(item.getProduct().getImageUrl());
        dto.setProductPrice(item.getProduct().getCurrentPrice());
        dto.setQuantity(item.getQuantity());
        dto.setTotalPrice(item.getProduct().getCurrentPrice() * item.getQuantity());
        dto.setCreatedAt(item.getCreatedAt());
        dto.setUpdatedAt(item.getUpdatedAt());
        return dto;
    }
} 