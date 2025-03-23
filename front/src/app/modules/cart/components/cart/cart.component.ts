import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../../core/services/cart.service';
import { Cart } from '../../../../core/models/cart.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart: Cart = {
    items: [],
    total: 0
  };

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });
  }

  updateQuantity(productId: number, quantity: number): void {
    try {
      this.cartService.updateQuantity(productId, quantity);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la quantité:', error);
    }
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }
} 