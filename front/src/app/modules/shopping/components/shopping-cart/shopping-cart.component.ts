import { Component, OnInit } from '@angular/core';
import { Product } from '@core/models/product.model';
import { ShoppingCartService } from '@core/services/shopping-cart.service';
import { NotificationService } from '@core/services/notification.service';
import { ProductService } from '@core/services/product.service';
import { ShoppingCart, ShoppingCartItem } from '@core/models/shopping-cart.ts';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {
  cart: ShoppingCart = { items: [] };
  cartItems: ShoppingCartItem[] = [];
  loading = false;
  total = 0;

  constructor(
    private shoppingCartService: ShoppingCartService,
    private productService: ProductService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    console.log('🚀 Initialisation du composant de panier');
    this.loadCart();
  }

  loadCart(): void {
    console.log('📥 Début du chargement du panier...');
    this.loading = true;
    this.shoppingCartService.getShoppingCart().subscribe({
      next: (cart) => {
        console.log('✅ Panier récupéré:', cart);
        this.cart = cart;
        this.cartItems = cart.items || [];
        console.log('📋 Items du panier:', this.cartItems);
        this.total = cart.totalAmount || this.calculateTotal();
        this.loading = false;
        
        if (this.cartItems.length === 0) {
          console.log('⚠️ Le panier est vide');
        } else {
          console.log(`📊 Nombre d'articles dans le panier: ${this.cartItems.length}`);
          console.log(`💰 Montant total: ${this.total}`);
        }
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement du panier:', error);
        this.notificationService.error('Erreur lors du chargement du panier');
        this.loading = false;
      }
    });
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity < 1) return;

    this.loading = true;
    this.shoppingCartService.updateQuantity(productId, quantity).subscribe({
      next: (cart) => {
        this.cart = cart;
        this.cartItems = cart.items || [];
        this.total = cart.totalAmount || this.calculateTotal();
        this.loading = false;
        console.log('📝 Quantité mise à jour, nouveau panier:', this.cart);
      },
      error: (error) => {
        console.error('❌ Erreur lors de la mise à jour de la quantité:', error);
        this.notificationService.error('Erreur lors de la mise à jour de la quantité');
        this.loading = false;
      }
    });
  }

  removeItem(productId: number): void {
    if (confirm('Êtes-vous sûr de vouloir retirer cet article du panier ?')) {
      this.loading = true;
      this.shoppingCartService.removeFromCart(productId).subscribe({
        next: (cart) => {
          this.cart = cart;
          this.cartItems = cart.items || [];
          this.total = cart.totalAmount || this.calculateTotal();
          this.notificationService.success('Article retiré du panier');
          this.loading = false;
          console.log('🗑️ Article supprimé, nouveau panier:', this.cart);
        },
        error: (error) => {
          console.error('❌ Erreur lors de la suppression de l\'article:', error);
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
        next: (cart) => {
          this.cart = cart;
          this.cartItems = [];
          this.total = 0;
          this.notificationService.success('Panier vidé avec succès');
          this.loading = false;
          console.log('🧹 Panier vidé');
        },
        error: (error) => {
          console.error('❌ Erreur lors de la suppression du panier:', error);
          this.notificationService.error('Erreur lors de la suppression du panier');
          this.loading = false;
        }
      });
    }
  }

  private calculateTotal(): number {
    if (this.cartItems.length === 0) return 0;
    return this.shoppingCartService.calculateTotal(this.cartItems);
  }

  getProductImageUrl(item: ShoppingCartItem): string {
    // Si l'item a une URL d'image, l'utiliser
    if (item.productImage) {
      return item.productImage;
    }
    
    // Fallback vers la méthode du productService si disponible
    const product: Product = {
      id: item.productId,
      name: item.productName || '',
      price: item.productPrice || 0,
      // Autres propriétés requises par Product
      description: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      quantity: item.quantity,
      active: true,
      store: {
        id: 0,
        name: ''
      }
    };
    
    return this.productService.getProductImageUrl(product);
  }

  formatPrice(price: number): string {
    return this.productService.formatPrice(price);
  }
} 