import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '@core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Gestion des utilisateurs
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  updateUser(id: number, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, userData);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }

  // Statistiques
  getUsersCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/users/count`);
  }

  getActiveUsersCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/users/count/active`);
  }

  // Gestion des rôles
  updateUserRole(userId: number, role: string): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${userId}/role`, { role });
  }
} 