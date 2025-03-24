import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../core/services/product.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { CartService } from '../../../../core/services/cart.service';
import { Product } from '../../../../core/models/product.model';

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
  products: Product[] = [
    {
      id: 1,
      name: 'Pommes',
      description: 'Pommes fraîches et juteuses',
      originalPrice: 2.50,
      discountPercentage: 20,
      currentPrice: 2.00,
      quantity: 100,
      price: 2.50,
      stock: 100,
      imageUrl: 'assets/images/products/apples.jpg',
      storeId: 1,
      category: 'fruits',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'Carottes',
      description: 'Carottes bio et fraîches',
      originalPrice: 1.80,
      discountPercentage: 15,
      currentPrice: 1.53,
      quantity: 150,
      price: 1.80,
      stock: 150,
      imageUrl: 'assets/images/products/carrots.jpg',
      storeId: 1,
      category: 'legumes',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      name: 'Croissant',
      description: 'Croissant au beurre',
      originalPrice: 1.20,
      discountPercentage: 10,
      currentPrice: 1.08,
      quantity: 50,
      price: 1.20,
      stock: 50,
      imageUrl: 'assets/images/products/croissant.jpg',
      storeId: 1,
      category: 'patisseries',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4,
      name: 'Sandwich Jambon',
      description: 'Sandwich au jambon et fromage',
      originalPrice: 4.50,
      discountPercentage: 0,
      currentPrice: 4.50,
      quantity: 30,
      price: 4.50,
      stock: 30,
      imageUrl: 'assets/images/products/ham-sandwich.jpg',
      storeId: 1,
      category: 'sandwichs',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 5,
      name: 'Plateau de Fruits',
      description: 'Assortiment de fruits frais',
      originalPrice: 12.00,
      discountPercentage: 25,
      currentPrice: 9.00,
      quantity: 20,
      price: 12.00,
      stock: 20,
      imageUrl: 'assets/images/products/fruit-tray.jpg',
      storeId: 1,
      category: 'plateaux',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 6,
      name: 'Éclair au Chocolat',
      description: 'Éclair au chocolat noir',
      originalPrice: 2.80,
      discountPercentage: 0,
      currentPrice: 2.80,
      quantity: 40,
      price: 2.80,
      stock: 40,
      imageUrl: 'assets/images/products/chocolate-eclair.jpg',
      storeId: 1,
      category: 'patisseries',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  categories: Category[] = [
    { id: 'all', name: 'Tous les produits', icon: 'fa-utensils' },
    { id: 'fruits', name: 'Fruits', icon: 'fa-apple-whole' },
    { id: 'legumes', name: 'Légumes', icon: 'fa-carrot' },
    { id: 'patisseries', name: 'Pâtisseries', icon: 'fa-cake-candles' },
    { id: 'sandwichs', name: 'Sandwichs', icon: 'fa-bread-slice' },
    { id: 'plateaux', name: 'Plateaux Repas', icon: 'fa-plate-wheat' }
  ];

  loading = false;
  error: string | null = null;
  searchTerm = '';
  selectedCategory = 'all';
  selectedQuantities: { [key: number]: number } = {};

  constructor(
    private productService: ProductService,
    private notificationService: NotificationService,
    private cartService: CartService
  ) {
    // Initialiser les quantités sélectionnées pour chaque produit à 1
    this.products.forEach(product => {
      this.selectedQuantities[product.id!] = 1;
    });
  }

  ngOnInit(): void {
    // Dans un environnement réel, nous utiliserions this.loadProducts()
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
    try {
      const quantity = this.selectedQuantities[product.id!];
      this.cartService.addToCart(product, quantity);
      this.notificationService.success(`${quantity} ${product.name} ajouté(s) au panier`);
    } catch (error) {
      this.notificationService.error(`Erreur lors de l'ajout de ${product.name} au panier`);
      console.error('Erreur:', error);
    }
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