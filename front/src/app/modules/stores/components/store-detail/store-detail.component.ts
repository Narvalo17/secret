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
        const storeId = Number(params['id']);
        console.log('Chargement du magasin avec ID:', storeId);
        this.loadStore(storeId);
        this.loadProducts(storeId);
      }
    });
  }

  private loadStore(id: number): void {
    this.loading = true;
    this.storeService.getStoreById(id).subscribe({
      next: (response: any) => {
        console.log('Réponse du magasin reçue:', response);
        
        // Vérifie si c'est un objet de réponse enveloppé (avec success et data) ou un objet magasin direct
        if (response && typeof response === 'object') {
          if (response.success && response.data) {
            // Format {success: true, data: Store}
            this.store = response.data;
          } else if ('id' in response) {
            // Format direct Store (avec un id)
            this.store = response as Store;
          } else {
            console.error('Format de réponse non reconnu:', response);
            this.error = true;
            this.notificationService.error('Erreur lors du chargement du magasin: Format de réponse incorrect');
          }
          
          if (this.store) {
            console.log('Magasin chargé avec succès:', this.store);
          }
        } else {
          console.error('Réponse de l\'API invalide:', response);
          this.error = true;
          this.notificationService.error('Erreur lors du chargement du magasin: Réponse invalide');
        }
        
        this.loading = false;
      },
      error: (error: Error) => {
        console.error('Erreur lors du chargement du magasin:', error);
        this.error = true;
        this.loading = false;
        this.notificationService.error('Erreur lors du chargement du magasin');
      }
    });
  }

  public loadProducts(storeId: number): void {
    this.loading = true;
    console.log('Chargement des produits du magasin:', storeId);
    
    this.productService.getProductsByStore(storeId, this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        console.log('Produits reçus:', response);
        
        if (response && response.content) {
          this.products = response.content.map(product => ({
            ...product,
            selectedQuantity: 1
          }));
          this.totalProducts = response.totalElements || 0;
          console.log('Produits chargés:', this.products.length);
        } else {
          console.error('Format de réponse des produits incorrect:', response);
          this.notificationService.error('Erreur de format dans la réponse des produits');
        }
        
        this.loading = false;
      },
      error: (error: Error) => {
        console.error('Erreur lors du chargement des produits:', error);
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
    if (!product || !product.id) {
      this.notificationService.error('Erreur : informations du produit manquantes');
      return;
    }

    if (!this.store) {
      this.notificationService.error('Erreur : informations du magasin manquantes');
      return;
    }

    // S'assurer que la quantité est un entier valide strictement supérieur à 0
    const quantity = Math.max(1, Math.round(Number(product.selectedQuantity)));
    
    // Log détaillé pour comprendre le problème
    console.log(`Type des données avant conversion:
      - productId: ${typeof product.id} (${product.id})
      - selectedQuantity: ${typeof product.selectedQuantity} (${product.selectedQuantity})
      - après conversion: ${typeof quantity} (${quantity})
    `);
    
    // Collecter les données pour le débogage
    const cartItem = {
      productId: product.id,
      quantity: quantity,
      storeId: this.store.id
    };

    console.log('Ajout au panier:', cartItem);

    // Appeler le service avec les bons paramètres
    this.productService.addToCart(product.id, quantity).subscribe({
      next: (response) => {
        console.log('Réponse de l\'ajout au panier:', response);
        this.notificationService.success(`${product.name} ajouté au panier`);
        product.selectedQuantity = 1;  // Réinitialiser la quantité
      },
      error: (error: any) => {
        console.error('Erreur lors de l\'ajout au panier:', error);
        
        // Extraire le message d'erreur du serveur pour l'afficher à l'utilisateur
        if (error && error.error) {
          if (error.error.message) {
            this.notificationService.error(`Erreur: ${error.error.message}`);
          } else if (typeof error.error === 'string') {
            this.notificationService.error(`Erreur: ${error.error}`);
          } else {
            this.notificationService.error(`Erreur lors de l'ajout au panier (${error.status})`);
          }
        } else {
          this.notificationService.error('Erreur lors de l\'ajout au panier');
        }
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