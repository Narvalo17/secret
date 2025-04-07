import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@core/models/store.model';
import { Product } from '@core/models/product.model';
import { StoreService } from '@core/services/store.service';
import { ProductService } from '@core/services/product.service';
import { CategoryService } from '@core/services/category.service';
import { NotificationService } from '@core/services/notification.service';

interface CartItemDto {
  productId: number;
  quantity: number;
  storeId: number;
}

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
  currentPage = 0;
  pageSize = 12;
  totalProducts = 0;

  constructor(
    private route: ActivatedRoute,
    private storeService: StoreService,
    private productService: ProductService,
    private categoryService: CategoryService,
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
    this.productService.getProductsByStore(storeId, this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.products = response.content.map(product => ({
          ...product,
          selectedQuantity: 1
        }));
        this.totalProducts = response.totalElements;
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
    if (product.selectedQuantity < product.quantity) {
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

    if (!this.store || !product.id) {
      this.notificationService.error('Erreur : informations du produit ou du magasin manquantes');
      return;
    }

    const cartItem: CartItemDto = {
      productId: product.id,
      quantity: product.selectedQuantity,
      storeId: this.store.id
    };

    this.productService.addToCart(product.id, product.selectedQuantity).subscribe({
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

  formatPrice(price: number): string {
    return this.productService.formatPrice(price);
  }

  getProductImageUrl(product: Product): string {
    return this.productService.getProductImageUrl(product);
  }

  getCategoryName(categoryId: number | null | undefined): string {
    return this.categoryService.getCategoryName(categoryId);
  }
} 