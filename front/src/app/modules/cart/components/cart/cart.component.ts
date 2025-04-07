import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '@core/services/cart.service';
import { Cart, CartItem } from '@core/models/cart.model';
import { NotificationService } from '@core/services/notification.service';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { ShoppingCartService } from '@core/services/shopping-cart.service';
import { ShoppingCart, ShoppingCartItem } from '@core/models/shopping-cart.ts';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  cart: Cart | null = null;
  shoppingCart: ShoppingCart = { items: [] };
  loading = false;
  private cartSubscription: Subscription | null = null;

  constructor(
    private cartService: CartService,
    private shoppingCartService: ShoppingCartService,
    private notificationService: NotificationService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Charger les deux carts pour rétrocompatibilité
    this.cartService.getCart().subscribe(cart => {
      this.cart = cart;
    });
    
    // Charge le shopping cart depuis le backend/cache local
    this.loadShoppingCart();
  }
  
  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
  
  loadShoppingCart(): void {
    console.log('🚀 Initialisation du composant de panier');
    this.loading = true;
    this.cartSubscription = this.shoppingCartService.getShoppingCart().subscribe({
      next: (cart) => {
        console.log('✅ Panier récupéré dans CartComponent:', cart);
        this.shoppingCart = cart;
        
        // Si le nouveau panier a des articles, adapter le format pour l'affichage
        if (cart.items && cart.items.length > 0) {
          // Créer un panier au format Cart pour la rétrocompatibilité avec le template
          const adaptedCart: Cart = {
            items: cart.items.map(item => this.adaptShoppingCartItem(item)),
            total: cart.totalAmount || 0
          };
          
          // Calculer le total correct si nécessaire
          if (!adaptedCart.total) {
            adaptedCart.total = adaptedCart.items.reduce((sum, item) => 
              sum + (item.price * item.quantity), 0);
          }
          
          // Remplacer le panier local par le panier backend
          this.cart = adaptedCart;
          console.log('👉 Panier adapté pour l\'affichage:', this.cart);
        } else {
          // Si le panier est vide, s'assurer que cart est également vide
          this.cart = { items: [], total: 0 };
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement du panier:', error);
        this.notificationService.error('Erreur lors du chargement du panier');
        this.loading = false;
      }
    });
  }
  
  // Adapter les items du ShoppingCart pour le format CartItem
  private adaptShoppingCartItem(item: ShoppingCartItem): CartItem {
    return {
      id: String(item.productId), // L'ancienne interface utilise des id en string
      name: item.productName || `Produit #${item.productId}`,
      description: '',
      price: item.productPrice || 0,
      originalPrice: item.productPrice || 0,
      discountPercentage: 0,
      quantity: item.quantity,
      imageUrl: item.productImage || '',
      storeId: '', // Non disponible dans ShoppingCartItem
      storeName: '' // Non disponible dans ShoppingCartItem
    };
  }

  updateItemQuantity(itemId: string, newQuantity: number): void {
    if (newQuantity < 1) {
      this.removeItem(itemId);
      return;
    }
    
    // Convertir itemId en nombre pour ShoppingCartService
    const productId = Number(itemId);
    
    this.loading = true;
    this.shoppingCartService.updateQuantity(productId, newQuantity).subscribe({
      next: (cart) => {
        console.log('✅ Quantité mise à jour avec succès');
        this.loadShoppingCart(); // Recharger le panier pour avoir les données à jour
        this.notificationService.success('Quantité mise à jour');
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Erreur lors de la mise à jour de la quantité:', error);
        this.notificationService.error('Erreur lors de la mise à jour de la quantité');
        this.loading = false;
      }
    });
  }

  removeItem(itemId: string): void {
    // Convertir itemId en nombre pour ShoppingCartService
    const productId = Number(itemId);
    
    this.loading = true;
    this.shoppingCartService.removeFromCart(productId).subscribe({
      next: (cart) => {
        console.log('✅ Article supprimé avec succès');
        this.loadShoppingCart(); // Recharger le panier pour avoir les données à jour
        this.notificationService.info('Article retiré du panier');
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Erreur lors de la suppression de l\'article:', error);
        this.notificationService.error('Erreur lors de la suppression de l\'article');
        this.loading = false;
      }
    });
  }

  checkout(): void {
    if ((!this.cart || this.cart.items.length === 0) && (!this.shoppingCart || this.shoppingCart.items.length === 0)) {
      this.notificationService.warning('Votre panier est vide');
      return;
    }

    if (!this.authService.isAuthenticated()) {
      this.notificationService.info('Veuillez vous connecter pour continuer');
      // Sauvegarder l'URL de redirection
      localStorage.setItem('redirectAfterLogin', '/checkout');
      this.router.navigate(['/auth/login']);
      return;
    }
    
    // TODO: Implémenter la logique de paiement
    this.notificationService.success('Commande en cours de traitement');
    this.router.navigate(['/checkout']);
  }

  // Méthode pour vider complètement le panier
  clearAllItems(): void {
    if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
      this.loading = true;
      this.shoppingCartService.clearCart().subscribe({
        next: (emptyCart) => {
          console.log('✅ Panier vidé avec succès');
          // Mise à jour de l'interface
          this.cart = { items: [], total: 0 };
          this.shoppingCart = emptyCart;
          this.notificationService.success('Votre panier a été vidé');
          this.loading = false;
        },
        error: (error) => {
          console.error('❌ Erreur lors du vidage du panier:', error);
          this.notificationService.error('Erreur lors du vidage du panier');
          this.loading = false;
        }
      });
    }
  }
} 