import { Component, OnInit } from '@angular/core';
import { CartService } from '@core/services/cart.service';
import { Cart, CartItem } from '@core/models/cart.model';
import { NotificationService } from '@core/services/notification.service';
import { Router } from '@angular/router';

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
    private router: Router
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
    
    // TODO: Implémenter la logique de paiement
    this.notificationService.success('Commande en cours de traitement');
    this.router.navigate(['/checkout']);
  }
} 