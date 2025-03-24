import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product, ProductResponse, ProductFilter } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = `${environment.apiUrl}/admin/product`;

  // Données mockées pour les produits
  private mockProducts: Product[] = [
    {
      id: 1,
      name: 'Pain aux céréales',
      description: 'Pain frais aux céréales complètes, parfait pour le petit-déjeuner',
      originalPrice: 2.50,
      discountPercentage: 0,
      currentPrice: 2.50,
      quantity: 15,
      price: 2.50,
      stock: 15,
      imageUrl: 'assets/images/products/pain-cereales.jpg',
      category: 'Pains',
      storeId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'Croissants',
      description: 'Croissants pur beurre, croustillants et dorés',
      originalPrice: 1.20,
      discountPercentage: 0,
      currentPrice: 1.20,
      quantity: 20,
      price: 1.20,
      stock: 20,
      imageUrl: 'assets/images/products/croissants.jpg',
      category: 'Viennoiseries',
      storeId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      name: 'Baguette tradition',
      description: 'Baguette traditionnelle à la française',
      originalPrice: 1.10,
      discountPercentage: 0,
      currentPrice: 1.10,
      quantity: 25,
      price: 1.10,
      stock: 25,
      imageUrl: 'assets/images/products/baguette.jpg',
      category: 'Pains',
      storeId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4,
      name: 'Pain au chocolat',
      description: 'Pain au chocolat pur beurre avec chocolat noir',
      originalPrice: 1.30,
      discountPercentage: 0,
      currentPrice: 1.30,
      quantity: 18,
      price: 1.30,
      stock: 18,
      imageUrl: 'assets/images/products/pain-chocolat.jpg',
      category: 'Viennoiseries',
      storeId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 5,
      name: 'Tarte aux pommes',
      description: 'Tarte aux pommes maison avec pommes fraîches',
      originalPrice: 12.90,
      discountPercentage: 0,
      currentPrice: 12.90,
      quantity: 5,
      price: 12.90,
      stock: 5,
      imageUrl: 'assets/images/products/tarte-pommes.jpg',
      category: 'Pâtisseries',
      storeId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return of(this.mockProducts);
  }

  getProductsByStore(storeId: number): Observable<Product[]> {
    const storeProducts = this.mockProducts.filter(product => product.storeId === storeId);
    return of(storeProducts);
  }

  getProductById(id: number): Observable<Product | undefined> {
    const product = this.mockProducts.find(p => p.id === id);
    return of(product);
  }

  getProducts(filter?: ProductFilter): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/filters`, { params: filter as any });
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}`, product);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  deleteProducts(ids: number[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/delete-batch`, { ids });
  }

  cloneProduct(id: number): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/${id}/clone`, {});
  }

  getProductFilters(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/filters`);
  }

  addToCart(productId: number, quantity: number): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/shopping/add`, { productId, quantity });
  }

  removeFromCart(productId: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/shopping/${productId}`);
  }
} 