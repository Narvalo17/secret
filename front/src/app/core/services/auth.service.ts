import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User, UserResponse } from '../models/user.model';
import { SessionService } from './session.service';

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private sessionService: SessionService
  ) {
    if (this.sessionService.isSessionValid()) {
      this.loadUserProfile().subscribe();
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          this.sessionService.setSession(
            response.token,
            response.refreshToken,
            response.expiresIn
          );
          this.currentUserSubject.next(response.user);
        })
      );
  }

  register(username: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { username, email, password })
      .pipe(
        tap(response => {
          this.sessionService.setSession(
            response.token,
            response.refreshToken,
            response.expiresIn
          );
          this.currentUserSubject.next(response.user);
        })
      );
  }

  logout(): void {
    const refreshToken = this.sessionService.getRefreshToken();
    if (refreshToken) {
      this.http.post(`${this.apiUrl}/logout`, { refreshToken }).subscribe();
    }
    this.sessionService.clearSession();
    this.currentUserSubject.next(null);
  }

  refreshToken(refreshToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`, { refreshToken })
      .pipe(
        tap(response => {
          this.sessionService.setSession(
            response.token,
            response.refreshToken,
            response.expiresIn
          );
        })
      );
  }

  isLoggedIn(): boolean {
    return this.sessionService.isSessionValid();
  }

  isAdmin(): boolean {
    const currentUser = this.currentUserSubject.value;
    return currentUser?.role === 'ADMIN';
  }

  private loadUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  registerUser(user: User): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${environment.apiUrl}/user/register`, user);
  }

  loginUser(credentials: { email: string; password: string }): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${environment.apiUrl}/user/login`, credentials);
  }

  updatePassword(userId: number, passwords: { oldPassword: string; newPassword: string }): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${environment.apiUrl}/user/reset/password/${userId}`, passwords);
  }

  createUser(user: User): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${environment.apiUrl}/user/create`, user);
  }

  // Nouvelles méthodes pour la réinitialisation du mot de passe
  requestPasswordReset(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/password-reset/request`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/password-reset/reset`, {
      token,
      newPassword
    });
  }

  validateResetToken(token: string): Observable<{ valid: boolean }> {
    return this.http.get<{ valid: boolean }>(`${this.apiUrl}/password-reset/validate/${token}`);
  }
} 