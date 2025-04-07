import { Component, OnInit } from '@angular/core';
import { CartService } from '@core/services/cart.service';
import { Cart, CartItem } from '@core/models/cart.model';
import { NotificationService } from '@core/services/notification.service';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;

  constructor(
    private cartService: CartService,
    private notificationService: NotificationService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cartService.getCart().subscribe(cart => {
      this.cart = cart;
    });
  }

  updateItemQuantity(itemId: string, newQuantity: number): void {
    if (newQuantity < 1) {
      this.removeItem(itemId);
      return;
    }
    
    this.cartService.updateItemQuantity(itemId, newQuantity);
    this.notificationService.success('Quantité mise à jour');
  }

  removeItem(itemId: string): void {
    this.cartService.removeFromCart(itemId);
    this.notificationService.info('Article retiré du panier');
  }

  checkout(): void {
    if (!this.cart || this.cart.items.length === 0) {
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
} 