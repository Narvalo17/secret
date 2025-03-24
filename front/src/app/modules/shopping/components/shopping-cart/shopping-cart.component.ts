import { Component, OnInit } from '@angular/core';
import { Product } from '@core/models/product.model';
import { ShoppingCartService } from '@core/services/shopping-cart.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {
  cartItems: Product[] = [];
  loading = false;
  total = 0;

  constructor(
    private shoppingCartService: ShoppingCartService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;
    this.shoppingCartService.getShoppingCart().subscribe({
      next: (products) => {
        this.cartItems = products;
        this.calculateTotal();
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.error('Erreur lors du chargement du panier');
        this.loading = false;
      }
    });
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity < 1) return;

    this.loading = true;
    this.shoppingCartService.updateQuantity(productId, quantity).subscribe({
      next: () => {
        this.loadCart();
      },
      error: (error) => {
        this.notificationService.error('Erreur lors de la mise à jour de la quantité');
        this.loading = false;
      }
    });
  }

  removeItem(productId: number): void {
    if (confirm('Êtes-vous sûr de vouloir retirer cet article du panier ?')) {
      this.loading = true;
      this.shoppingCartService.removeFromCart(productId).subscribe({
        next: () => {
          this.notificationService.success('Article retiré du panier');
          this.loadCart();
        },
        error: (error) => {
          this.notificationService.error('Erreur lors de la suppression de l\'article');
          this.loading = false;
        }
      });
    }
  }

  clearCart(): void {
    if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
      this.loading = true;
      this.shoppingCartService.clearCart().subscribe({
        next: () => {
          this.notificationService.success('Panier vidé avec succès');
          this.cartItems = [];
          this.total = 0;
          this.loading = false;
        },
        error: (error) => {
          this.notificationService.error('Erreur lors de la suppression du panier');
          this.loading = false;
        }
      });
    }
  }

  private calculateTotal(): void {
    this.total = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
} 