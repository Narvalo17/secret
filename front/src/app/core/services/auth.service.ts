import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  id?: number;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailVerified?: boolean;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Récupérer l'utilisateur du localStorage au démarrage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(email: string, password: string): Observable<any> {
    console.log('🚀 Envoi de la requête de connexion:', `${this.apiUrl}/users/login`);
    return this.http.post(`${this.apiUrl}/users/login`, { email, password })
      .pipe(
        tap((response: any) => {
          console.log('✅ Connexion réussie:', response);
          // Sauvegarder l'utilisateur dans le localStorage
          localStorage.setItem('currentUser', JSON.stringify(response));
          this.currentUserSubject.next(response);
        })
      );
  }

  register(userData: User): Observable<any> {
    console.log('🚀 Envoi de la requête d\'inscription:', `${this.apiUrl}/users/register`);
    console.log('📦 Données envoyées:', userData);
    return this.http.post(`${this.apiUrl}/users/register`, userData)
      .pipe(
        tap((response: any) => {
          console.log('✅ Inscription réussie:', response);
        })
      );
  }

  logout(): void {
    console.log('🔒 Déconnexion de l\'utilisateur');
    // Nettoyer le localStorage
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  isAdmin(): boolean {
    const currentUser = this.currentUserSubject.value;
    return currentUser?.role === 'ADMIN';
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  requestPasswordReset(email: string): Observable<any> {
    console.log('🚀 Recherche de l\'utilisateur par email:', `${this.apiUrl}/users/find-by-email`);
    console.log('📧 Email recherché:', email);
    return this.http.post(`${this.apiUrl}/users/find-by-email`, { email })
      .pipe(
        tap((user: any) => {
          if (!user || !user.id) {
            console.error('❌ Utilisateur non trouvé');
            throw new Error('Utilisateur non trouvé');
          }
          console.log('✅ Utilisateur trouvé:', user);
        })
      );
  }

  resetPassword(userId: number, newPassword: string): Observable<any> {
    console.log('🚀 Envoi de la requête de réinitialisation du mot de passe:', `${this.apiUrl}/users/${userId}/reset-password`);
    return this.http.post(`${this.apiUrl}/users/${userId}/reset-password`, {
      newPassword
    }).pipe(
      tap((response: any) => {
        console.log('✅ Mot de passe réinitialisé avec succès');
      })
    );
  }

  updatePassword(oldPassword: string, newPassword: string): Observable<any> {
    const userId = this.currentUserSubject.value?.id;
    if (!userId) {
      console.error('❌ Utilisateur non connecté');
      return new Observable(subscriber => subscriber.error('User not logged in'));
    }
    
    console.log('🚀 Envoi de la requête de mise à jour du mot de passe:', `${this.apiUrl}/users/${userId}/update-password`);
    return this.http.put(`${this.apiUrl}/users/${userId}/update-password`, {
      oldPassword,
      newPassword
    }).pipe(
      tap((response: any) => {
        console.log('✅ Mot de passe mis à jour avec succès');
      })
    );
  }
} 