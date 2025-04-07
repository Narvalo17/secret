import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductResponse, ProductFilter } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = `${environment.apiUrl}/admin/product`;

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}`);
  }

  getProductsByStore(storeId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/store/${storeId}`);
  }

  getProductById(id: number): Observable<Product | undefined> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
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