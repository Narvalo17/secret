import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Product, ProductResponse } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/admin/product`;
  private products: Product[] = [
    {
      id: 1,
      name: 'Baguette Tradition',
      description: 'Baguette artisanale à l\'ancienne, croustillante à l\'extérieur et moelleuse à l\'intérieur',
      originalPrice: 1.20,
      discountPercentage: 50,
      currentPrice: 0.60,
      quantity: 15,
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
      updatedAt: new Date()
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
      updatedAt: new Date()
    }
  ];

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<ProductResponse> {
    return of({ success: true, message: 'Produits récupérés avec succès', data: this.products });
  }

  getProductById(id: number): Observable<ProductResponse> {
    const product = this.products.find(p => p.id === id);
    if (product) {
      return of({ success: true, message: 'Produit trouvé', data: product });
    }
    return of({ success: false, message: 'Produit non trouvé', data: undefined });
  }

  createProduct(product: Product): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(`${this.apiUrl}`, product);
  }

  updateProduct(id: number, product: Product): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<ProductResponse> {
    return this.http.delete<ProductResponse>(`${this.apiUrl}/${id}`);
  }

  getProductsByStore(storeId: number): Observable<ProductResponse> {
    const storeProducts = this.products.filter(product => product.storeId === storeId);
    return of({ success: true, message: 'Produits du magasin récupérés avec succès', data: storeProducts });
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