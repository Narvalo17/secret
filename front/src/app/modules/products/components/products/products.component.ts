import { Component, OnInit } from '@angular/core';
import { ProductService } from '@core/services/product.service';
import { NotificationService } from '@core/services/notification.service';
import { CategoryService } from '@core/services/category.service';
import { Product, ProductCategory } from '@core/models/product.model';
import { AuthService } from '@core/services/auth.service';

interface Category {
  id: ProductCategory;
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
  categories = [
    { id: 0, name: 'Tous les produits', icon: 'fa-utensils' },
    { id: 1, name: 'Pain', icon: 'fa-bread-slice' },
    { id: 2, name: 'Viennoiserie', icon: 'fa-croissant' },
    { id: 3, name: 'Pâtisserie', icon: 'fa-cake-candles' },
    { id: 4, name: 'Sandwich', icon: 'fa-burger' },
    { id: 5, name: 'Plat', icon: 'fa-plate-wheat' },
    { id: 6, name: 'Boisson', icon: 'fa-glass-water' },
    { id: 7, name: 'Fruit', icon: 'fa-apple-whole' },
    { id: 8, name: 'Légume', icon: 'fa-carrot' },
    { id: 9, name: 'Épicerie', icon: 'fa-shop' },
    { id: 10, name: 'Autre', icon: 'fa-box' }
  ];
  loading = false;
  error = false;
  searchTerm = '';
  selectedCategoryId = 0;
  selectedQuantities: { [key: number]: number } = {};

  currentPage = 0;
  pageSize = 12;
  totalItems = 0;

  // Exposer Math pour le template
  Math = Math;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log('🔍 [Products] Initialisation du composant');
    const currentUser = this.authService.getCurrentUser();
    console.log('👤 [Products] État de l\'utilisateur au chargement:', currentUser);
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        console.log('Réponse du serveur:', response);
        this.products = response.content;
        this.totalItems = response.totalElements;
        
        // Vérifier les données des produits
        this.products.forEach(product => {
          console.log(`Produit ${product.id}:`, {
            name: product.name,
            storeId: product.storeId,
            category: product.category,
            price: product.price
          });
          
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

  selectCategory(categoryId: number): void {
    this.selectedCategoryId = categoryId;
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
    console.log('🛒 [Products] Début addToCart avec le produit:', product);
    
    // Vérifier si l'utilisateur est connecté
    const currentUser = this.authService.getCurrentUser();
    console.log('👤 [Products] État de l\'utilisateur:', currentUser);
    
    if (!currentUser) {
      console.error('❌ [Products] Utilisateur non connecté');
      this.notificationService.error('Veuillez vous connecter pour ajouter des produits au panier');
      return;
    }
    
    if (!product.id) {
      console.error('❌ [Products] Produit invalide - pas d\'ID');
      this.notificationService.error('Produit invalide');
      return;
    }

    const quantity = this.selectedQuantities[product.id] || 1;
    console.log('📦 [Products] Quantité sélectionnée:', quantity);

    this.productService.addToCart(product.id, quantity).subscribe({
      next: (response) => {
        console.log('✅ [Products] Produit ajouté avec succès:', response);
        this.notificationService.success(`${product.name} ajouté au panier`);
      },
      error: (error) => {
        console.error('❌ [Products] Erreur lors de l\'ajout au panier:', error);
        const errorMessage = error.message || 'Erreur lors de l\'ajout au panier';
        this.notificationService.error(errorMessage);
      }
    });
  }

  formatPrice(price: number): string {
    return this.productService.formatPrice(price);
  }

  getProductImageUrl(product: Product): string {
    return this.productService.getProductImageUrl(product);
  }

  getCategoryName(category: ProductCategory | undefined): string {
    if (!category) return 'Non catégorisé';
    
    switch (category) {
      case ProductCategory.PAIN:
        return 'Pain';
      case ProductCategory.VIENNOISERIE:
        return 'Viennoiserie';
      case ProductCategory.PATISSERIE:
        return 'Pâtisserie';
      case ProductCategory.SANDWICH:
        return 'Sandwich';
      case ProductCategory.PLAT:
        return 'Plat';
      case ProductCategory.BOISSON:
        return 'Boisson';
      case ProductCategory.FRUIT:
        return 'Fruit';
      case ProductCategory.LEGUME:
        return 'Légume';
      case ProductCategory.EPICERIE:
        return 'Épicerie';
      case ProductCategory.AUTRE:
        return 'Autre';
      default:
        return 'Non catégorisé';
    }
  }

  getCategoryIcon(category: ProductCategory): string {
    switch (category) {
      case ProductCategory.PAIN:
        return 'fa-bread-slice';
      case ProductCategory.VIENNOISERIE:
        return 'fa-croissant';
      case ProductCategory.PATISSERIE:
        return 'fa-cake-candles';
      case ProductCategory.SANDWICH:
        return 'fa-burger';
      case ProductCategory.PLAT:
        return 'fa-plate-wheat';
      case ProductCategory.BOISSON:
        return 'fa-glass-water';
      case ProductCategory.FRUIT:
        return 'fa-apple-whole';
      case ProductCategory.LEGUME:
        return 'fa-carrot';
      case ProductCategory.EPICERIE:
        return 'fa-shop';
      case ProductCategory.AUTRE:
      default:
        return 'fa-box';
    }
  }

  filterByCategory(products: Product[]): Product[] {
    if (this.selectedCategoryId === 0) {
      return products;
    }
    
    const enumValues = Object.values(ProductCategory);
    const selectedEnum = enumValues[this.selectedCategoryId - 1];
    
    return products.filter(product => product.category === selectedEnum);
  }

  get filteredProducts(): Product[] {
    return this.products
      .filter(product => 
        this.filterByCategory([product]).length > 0 &&
        (product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
         (product.description?.toLowerCase() || '').includes(this.searchTerm.toLowerCase()))
      );
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }
} 