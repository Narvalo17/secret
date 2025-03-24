import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@core/models/store.model';
import { Product } from '@core/models/product.model';
import { CartItem } from '@core/models/cart.model';
import { StoreService } from '@core/services/store.service';
import { ProductService } from '@core/services/product.service';
import { CartService } from '@core/services/cart.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-store-detail',
  templateUrl: './store-detail.component.html',
  styleUrls: ['./store-detail.component.scss']
})
export class StoreDetailComponent implements OnInit {
  store: Store | null = null;
  products: (Product & { selectedQuantity: number })[] = [];
  loading = false;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private storeService: StoreService,
    private productService: ProductService,
    private cartService: CartService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadStore(Number(params['id']));
        this.loadProducts(Number(params['id']));
      }
    });
  }

  private loadStore(id: number): void {
    this.loading = true;
    this.storeService.getStoreById(id).subscribe({
      next: (store) => {
        if (store.success && store.data) {
          this.store = store.data;
        }
        this.loading = false;
      },
      error: (error: Error) => {
        console.error('Error loading store:', error);
        this.error = true;
        this.loading = false;
        this.notificationService.error('Erreur lors du chargement du magasin');
      }
    });
  }

  private loadProducts(storeId: number): void {
    this.loading = true;
    this.productService.getProductsByStore(storeId).subscribe({
      next: (products) => {
        this.products = products.map(product => ({
          ...product,
          selectedQuantity: 1
        }));
        this.loading = false;
      },
      error: (error: Error) => {
        console.error('Error loading products:', error);
        this.error = true;
        this.loading = false;
        this.notificationService.error('Erreur lors du chargement des produits');
      }
    });
  }

  incrementQuantity(product: Product & { selectedQuantity: number }): void {
    if (product.selectedQuantity < product.stock) {
      product.selectedQuantity++;
    }
  }

  decrementQuantity(product: Product & { selectedQuantity: number }): void {
    if (product.selectedQuantity > 1) {
      product.selectedQuantity--;
    }
  }

  addToCart(product: Product & { selectedQuantity: number }): void {
    if (!product.selectedQuantity || product.selectedQuantity < 1) {
      this.notificationService.error('Veuillez sélectionner une quantité valide');
      return;
    }

    if (!this.store) {
      this.notificationService.error('Erreur : informations du magasin manquantes');
      return;
    }

    const cartItem: CartItem = {
      id: product.id.toString(),
      name: product.name,
      description: product.description,
      price: product.currentPrice,
      originalPrice: product.originalPrice,
      discountPercentage: product.discountPercentage,
      quantity: product.selectedQuantity,
      imageUrl: product.imageUrl,
      storeId: this.store.id.toString(),
      storeName: this.store.name
    };

    this.cartService.addToCart(cartItem).subscribe({
      next: () => {
        this.notificationService.success('Produit ajouté au panier');
        product.selectedQuantity = 1;
      },
      error: (error: Error) => {
        console.error('Error adding to cart:', error);
        this.notificationService.error('Erreur lors de l\'ajout au panier');
      }
    });
  }
} 