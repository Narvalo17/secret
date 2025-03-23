import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@core/models/store.model';
import { Product } from '@core/models/product.model';
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
  products: Product[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private storeService: StoreService,
    private productService: ProductService,
    private cartService: CartService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const storeId = this.route.snapshot.params['id'];
    if (storeId) {
      this.loadStoreDetails(+storeId);
    }
  }

  private loadStoreDetails(storeId: number): void {
    this.isLoading = true;
    this.error = null;
    
    this.storeService.getStoreById(storeId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.store = response.data;
          this.loadStoreProducts(storeId);
        } else {
          this.error = response.message || 'Magasin non trouvé';
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement du magasin';
        this.isLoading = false;
      }
    });
  }

  private loadStoreProducts(storeId: number): void {
    this.productService.getProductsByStore(storeId).subscribe({
      next: (response) => {
        this.products = Array.isArray(response.data) ? response.data : [];
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement des produits';
        this.isLoading = false;
      }
    });
  }

  toggleFavorite(): void {
    if (!this.store?.id) return;

    if (this.store.isFavorite) {
      this.storeService.removeFromFavorites(this.store.id).subscribe({
        next: () => {
          if (this.store) {
            this.store.isFavorite = false;
          }
        },
        error: () => {
          this.error = 'Erreur lors du retrait des favoris';
        }
      });
    } else {
      this.storeService.addToFavorites(this.store.id).subscribe({
        next: () => {
          if (this.store) {
            this.store.isFavorite = true;
          }
        },
        error: () => {
          this.error = 'Erreur lors de l\'ajout aux favoris';
        }
      });
    }
  }

  addToCart(product: Product): void {
    try {
      this.cartService.addToCart(product, 1);
      this.notificationService.success('Produit ajouté au panier');
    } catch (error) {
      if (error instanceof Error) {
        this.notificationService.error(error.message);
      } else {
        this.notificationService.error('Erreur lors de l\'ajout au panier');
      }
    }
  }
} 