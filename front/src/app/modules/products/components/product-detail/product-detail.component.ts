import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '@core/models/product.model';
import { ProductService } from '@core/services/product.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  selectedQuantity: number = 1;
  loading = false;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    const productId = this.route.snapshot.params['id'];
    console.log('🔍 [ProductDetail] Initialisation avec ID:', productId);
    
    if (productId) {
      this.loadProduct(Number(productId));
    } else {
      this.error = true;
      this.loading = false;
      this.notificationService.error('ID du produit manquant');
    }
  }

  private loadProduct(productId: number): void {
    console.log('🔄 [ProductDetail] Chargement du produit:', productId);
    this.productService.getProductById(productId).subscribe({
      next: (product) => {
        console.log('✅ [ProductDetail] Produit chargé:', product);
        this.product = {
          ...product,
          isActive: product.isActive !== undefined ? product.isActive : true
        };
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ [ProductDetail] Erreur lors du chargement du produit:', error);
        this.error = true;
        this.loading = false;
        this.notificationService.error('Erreur lors du chargement du produit');
      }
    });
  }

  incrementQuantity(): void {
    console.log('➕ [ProductDetail] Incrémentation quantité');
    if (this.product && this.selectedQuantity < this.product.quantity) {
      this.selectedQuantity++;
      console.log('📊 [ProductDetail] Nouvelle quantité:', this.selectedQuantity);
    }
  }

  decrementQuantity(): void {
    console.log('➖ [ProductDetail] Décrémentation quantité');
    if (this.selectedQuantity > 1) {
      this.selectedQuantity--;
      console.log('📊 [ProductDetail] Nouvelle quantité:', this.selectedQuantity);
    }
  }

  onAddToCartClick(event: MouseEvent): void {
    console.log('🖱️ [ProductDetail] Clic sur Ajouter au panier');
    event.preventDefault();
    event.stopPropagation();
    this.addToCart();
  }

  addToCart(): void {
    console.log('🛒 [ProductDetail] Début addToCart');
    
    if (!this.product || !this.product.id) {
      console.error('❌ [ProductDetail] Produit invalide:', this.product);
      this.notificationService.error('Produit invalide');
      return;
    }

    // S'assurer que la quantité est un entier valide strictement supérieur à 0
    const quantity = Math.max(1, Math.round(Number(this.selectedQuantity)));
    
    // Log détaillé pour comprendre le problème
    console.log(`Type des données avant conversion:
      - productId: ${typeof this.product.id} (${this.product.id})
      - selectedQuantity: ${typeof this.selectedQuantity} (${this.selectedQuantity})
      - après conversion: ${typeof quantity} (${quantity})
    `);

    // Appeler le service avec les bons paramètres
    this.productService.addToCart(this.product.id, quantity).subscribe({
      next: (response) => {
        console.log('✅ [ProductDetail] Réponse de l\'ajout au panier:', response);
        this.notificationService.success(`${this.product?.name} ajouté au panier`);
        this.selectedQuantity = 1;  // Réinitialiser la quantité
      },
      error: (error: any) => {
        console.error('❌ [ProductDetail] Erreur lors de l\'ajout au panier:', error);
        
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
} 