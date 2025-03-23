import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User, UserResponse } from '../models/user.model';

export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private apiUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    if (token) {
      // TODO: Vérifier la validité du token
      this.getCurrentUser().subscribe();
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(response.user);
        })
      );
  }

  register(username: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, { username, email, password })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(response.user);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/auth/me`)
      .pipe(
        tap(user => this.currentUserSubject.next(user))
      );
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  registerUser(user: User): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/register`, user);
  }

  loginUser(credentials: { email: string; password: string }): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/login`, credentials);
  }

  updatePassword(userId: number, passwords: { oldPassword: string; newPassword: string }): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}/reset/password/${userId}`, passwords);
  }

  createUser(user: User): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/create`, user);
  }
} 