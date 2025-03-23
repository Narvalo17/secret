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
      name: 'Panier de Fruits Frais',
      description: 'Assortiment de fruits de saison : pommes, poires, oranges, bananes',
      originalPrice: 12.99,
      discountPercentage: 30,
      currentPrice: 9.09,
      quantity: 8,
      imageUrl: 'assets/images/products/fruits.jpg',
      storeId: 1,
      category: 'fruits'
    },
    {
      id: 2,
      name: 'Légumes Bio du Jour',
      description: 'Sélection de légumes bio : carottes, tomates, courgettes, poivrons',
      originalPrice: 9.99,
      discountPercentage: 25,
      currentPrice: 7.49,
      quantity: 10,
      imageUrl: 'assets/images/products/legumes.jpg',
      storeId: 1,
      category: 'legumes'
    },
    {
      id: 3,
      name: 'Tarte aux Pommes Maison',
      description: 'Délicieuse tarte aux pommes fraîchement préparée',
      originalPrice: 15.99,
      discountPercentage: 40,
      currentPrice: 9.59,
      quantity: 5,
      imageUrl: 'assets/images/products/tarte-pommes.jpg',
      storeId: 2,
      category: 'patisseries'
    },
    {
      id: 4,
      name: 'Sandwich Club Poulet',
      description: 'Pain frais, poulet grillé, bacon, laitue, tomate, mayonnaise',
      originalPrice: 6.99,
      discountPercentage: 20,
      currentPrice: 5.59,
      quantity: 12,
      imageUrl: 'assets/images/products/sandwich.jpg',
      storeId: 3,
      category: 'sandwichs'
    },
    {
      id: 5,
      name: 'Plateau Repas Végétarien',
      description: 'Quinoa, légumes grillés, houmous, salade verte',
      originalPrice: 13.99,
      discountPercentage: 35,
      currentPrice: 9.09,
      quantity: 6,
      imageUrl: 'assets/images/products/plateau-vege.jpg',
      storeId: 2,
      category: 'plateaux'
    },
    {
      id: 6,
      name: 'Assortiment de Viennoiseries',
      description: 'Croissants, pains au chocolat, chaussons aux pommes',
      originalPrice: 8.99,
      discountPercentage: 45,
      currentPrice: 4.94,
      quantity: 15,
      imageUrl: 'assets/images/products/viennoiseries.jpg',
      storeId: 4,
      category: 'patisseries'
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
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
  }
} 