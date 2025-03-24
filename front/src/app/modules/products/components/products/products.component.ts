import { Component, OnInit } from '@angular/core';
import { ProductService } from '@core/services/product.service';
import { NotificationService } from '@core/services/notification.service';
import { CartService } from '@core/services/cart.service';
import { Product } from '@core/models/product.model';
import { CartItem } from '@core/models/cart.model';

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

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
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

  addToCart(product: Product, quantity: number = 1): void {
    const cartItem: CartItem = {
      id: product.id.toString(),
      name: product.name,
      description: product.description,
      price: product.currentPrice,
      originalPrice: product.originalPrice,
      discountPercentage: product.discountPercentage,
      quantity: quantity,
      imageUrl: product.imageUrl,
      storeId: product.storeId?.toString() || '',
      storeName: '' // Le nom du magasin sera récupéré plus tard si nécessaire
    };

    this.cartService.addToCart(cartItem).subscribe({
      next: () => {
        this.notificationService.success(`${product.name} ajouté au panier`);
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        this.notificationService.error('Erreur lors de l\'ajout au panier');
      }
    });
  }

  get filteredProducts(): Product[] {
    return this.products
      .filter(product => 
        (this.selectedCategory === 'all' || product.category === this.selectedCategory) &&
        (product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (product.description?.toLowerCase() || '').includes(this.searchTerm.toLowerCase()))
      );
  }
} 