import { Component, OnInit } from '@angular/core';
import { ProductService } from '@core/services/product.service';
import { NotificationService } from '@core/services/notification.service';
import { CategoryService } from '@core/services/category.service';
import { Product } from '@core/models/product.model';

interface Category {
  id: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [
    { id: 'all', name: 'Tous les produits', icon: 'fa-utensils' },
    { id: 'fruits', name: 'Fruits', icon: 'fa-apple-whole' },
    { id: 'legumes', name: 'Légumes', icon: 'fa-carrot' },
    { id: 'patisseries', name: 'Pâtisseries', icon: 'fa-cake-candles' },
    { id: 'sandwichs', name: 'Sandwichs', icon: 'fa-bread-slice' },
    { id: 'plateaux', name: 'Plateaux Repas', icon: 'fa-plate-wheat' }
  ];
  loading = false;
  error = false;
  searchTerm = '';
  selectedCategory = 'all';
  selectedQuantities: { [key: number]: number } = {};

  currentPage = 0;
  pageSize = 12;
  totalItems = 0;

  // Exposer Math pour le template
  Math = Math;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.products = response.content;
        this.totalItems = response.totalElements;
        // Initialiser les quantités sélectionnées pour chaque produit
        this.products.forEach(product => {
          if (product.id) {
            this.selectedQuantities[product.id] = 1;
          }
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.error = true;
        this.loading = false;
        this.notificationService.error('Erreur lors du chargement des produits');
      }
    });
  }

  selectCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
  }

  updateQuantity(productId: number, change: number): void {
    const currentQuantity = this.selectedQuantities[productId];
    const product = this.products.find(p => p.id === productId);
    
    if (product) {
      const newQuantity = currentQuantity + change;
      if (newQuantity >= 1 && newQuantity <= product.quantity) {
        this.selectedQuantities[productId] = newQuantity;
      }
    }
  }

  addToCart(product: Product): void {
    if (!product.id) {
      this.notificationService.error('Produit invalide');
      return;
    }

    const quantity = this.selectedQuantities[product.id] || 1;

    this.productService.addToCart(product.id, quantity).subscribe({
      next: () => {
        this.notificationService.success(`${product.name} ajouté au panier`);
      },
      error: (error) => {
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

  get filteredProducts(): Product[] {
    return this.products
      .filter(product => 
        (this.selectedCategory === 'all' || 
         // Filtre basé sur la catégorie (ID ou nom)
         (product.category?.name?.toLowerCase().includes(this.selectedCategory.toLowerCase()) || 
          this.getCategoryName(product.category?.id).toLowerCase().includes(this.selectedCategory.toLowerCase()))
        ) &&
        // Filtre basé sur le terme de recherche
        (product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
         (product.description?.toLowerCase() || '').includes(this.searchTerm.toLowerCase()))
      );
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }
} 