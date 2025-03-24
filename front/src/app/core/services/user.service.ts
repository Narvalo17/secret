import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  role: string;
}

export interface UserUpdate {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  currentPassword?: string;
  newPassword?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = 'api/user';

  constructor(private http: HttpClient) { }

  updateUser(userId: number, userData: UserUpdate): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/update`, userData);
  }

  resetPassword(email: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reset/password`, { email });
  }

  createUser(userData: Omit<User, 'id' | 'role'>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/create`, userData);
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  updatePassword(currentPassword: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/update-password`, {
      currentPassword,
      newPassword
    });
  }
} 