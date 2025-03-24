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
  private products: Product[] = [
    {
      id: 1,
      name: 'Baguette Tradition',
      description: 'Baguette artisanale à l\'ancienne, croustillante à l\'extérieur et moelleuse à l\'intérieur',
      originalPrice: 1.20,
      discountPercentage: 50,
      currentPrice: 0.60,
      quantity: 15,
      price: 1.20,
      stock: 15,
      imageUrl: 'assets/images/products/baguette.jpg',
      storeId: 1,
      category: 'Pains',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'Croissant au Beurre',
      description: 'Croissant pur beurre, feuilleté et croustillant',
      originalPrice: 1.50,
      discountPercentage: 40,
      currentPrice: 0.90,
      quantity: 20,
      price: 1.50,
      stock: 20,
      imageUrl: 'assets/images/products/croissant.jpg',
      storeId: 1,
      category: 'Viennoiseries',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      name: 'Pain aux Céréales',
      description: 'Pain complet aux graines variées (tournesol, lin, sésame)',
      originalPrice: 2.80,
      discountPercentage: 30,
      currentPrice: 1.96,
      quantity: 8,
      imageUrl: 'assets/images/products/pain-cereales.jpg',
      storeId: 1,
      category: 'Pains Spéciaux',
      createdAt: new Date(),
      updatedAt: new Date(),
      price: 0,
      stock: 0
    },
    {
      id: 4,
      name: 'Éclair au Chocolat',
      description: 'Pâte à choux garnie de crème pâtissière au chocolat noir',
      originalPrice: 3.50,
      discountPercentage: 45,
      currentPrice: 1.93,
      quantity: 12,
      imageUrl: 'assets/images/products/eclair.jpg',
      storeId: 1,
      category: 'Pâtisseries',
      createdAt: new Date(),
      updatedAt: new Date(),
      price: 0,
      stock: 0
    }
  ];

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getProductById(id: number): Observable<Product | undefined> {
    return of(this.products.find(p => p.id === id));
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

  getProductsByStore(storeId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/${storeId}`);
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