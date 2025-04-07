import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

export interface Order {
  id: number;
  customerName: string;
  orderDate: Date;
  status: string;
  total: number;
  items: number;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data: Order[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  getMerchantOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/merchant`);
  }

  updateOrderStatus(orderId: number, status: string): Observable<{ success: boolean; message: string }> {
    return this.http.put<{ success: boolean; message: string }>(`${this.apiUrl}/${orderId}/status`, { status });
  }

  getOrderDetails(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${orderId}`);
  }
} 