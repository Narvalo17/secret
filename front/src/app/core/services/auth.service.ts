import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, from, catchError, of } from 'rxjs';
import { tap, switchMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface User {
  id?: number;
  email: string;
  password?: string;
  confirmPassword?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailVerified?: boolean;
  role?: string;
}

export interface Store {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  storeType: string;
  isActive: boolean;
  ownerId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  getToken: any;
  // Flag pour éviter les appels récursifs
  private isCheckingRole = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Récupérer l'utilisateur du localStorage au démarrage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(email: string, password: string): Observable<any> {
    console.log('🚀 Envoi de la requête de connexion:', `${this.apiUrl}/users/login`);
    return this.http.post(`${this.apiUrl}/users/login`, { 
      email, 
      password,
      confirmPassword: password, // Ajouter le champ confirmPassword requis par le backend
      firstName: "User", // Ajouter un prénom temporaire
      lastName: "User" // Ajouter un nom temporaire
    })
      .pipe(
        tap((response: any) => {
          console.log('✅ Connexion réussie:', response);
          
          // Stocker l'utilisateur temporairement avec un rôle par défaut
          const basicUser = { ...response, role: 'USER' };
          localStorage.setItem('currentUser', JSON.stringify(basicUser));
          this.currentUserSubject.next(basicUser);
          
          // Récupérer le rôle en arrière-plan si l'ID est disponible
          if (response.id) {
            // On utilise directement l'API de rôle sans passer par fetchUserRole pour éviter les effets de bord
            this.http.get<any>(`${this.apiUrl}/users/${response.id}/role`).subscribe(
              roleResponse => {
                if (roleResponse && roleResponse.role) {
                  console.log('✅ Rôle récupéré après connexion:', roleResponse.role);
                  // Mettre à jour l'utilisateur avec le rôle
                  const updatedUser = { ...response, role: roleResponse.role };
                  localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                  this.currentUserSubject.next(updatedUser);
                }
              },
              // En cas d'erreur, on garde l'utilisateur avec le rôle par défaut
              error => console.error('❌ Erreur lors de la récupération du rôle initial:', error)
            );
          }
          
          // Rediriger vers la page d'accueil
          this.router.navigate(['/']);
        })
      );
  }

  // Récupérer le rôle d'un utilisateur par son ID
  fetchUserRole(userId: number): Observable<User> {
    console.log('🔍 Récupération du rôle pour l\'utilisateur ID:', userId);
    
    // Utiliser directement l'API de rôle que nous avons créée
    return this.http.get<any>(`${this.apiUrl}/users/${userId}/role`).pipe(
      map(roleResponse => {
        console.log('🔍 Réponse de l\'API de rôle:', roleResponse);
        
        // Créer un objet utilisateur minimal avec l'ID et le rôle
        const user: User = {
          id: userId,
          email: '',  // Ces champs sont obligatoires mais ne seront pas utilisés
          firstName: '',
          lastName: '',
          phoneNumber: '',
          role: roleResponse && roleResponse.role ? roleResponse.role : 'USER'
        };
        
        console.log('🔍 Rôle final:', user.role);
        return user;
      }),
      // Gérer les erreurs pour éviter de bloquer la chaîne d'observables
      catchError(error => {
        console.error('❌ Erreur lors de la récupération du rôle:', error);
        // Retourner un utilisateur avec le rôle par défaut en cas d'erreur
        const user: User = {
          id: userId,
          email: '',
          firstName: '',
          lastName: '',
          phoneNumber: '',
          role: 'USER'
        };
        return of(user);
      })
    );
  }

  // Cette méthode ne sera plus utilisée pour modifier le rôle
  checkIfStoreOwner(userId: number): Observable<boolean> {
    return this.http.get<any>(`${this.apiUrl}/stores?ownerId=${userId}`).pipe(
      tap(response => {
        console.log('🏪 Vérification des magasins pour l\'utilisateur:', response);
      }),
      map(response => {
        // Vérifier seulement, sans modifier le rôle
        const isOwner = response && response.content && response.content.length > 0;
        return isOwner;
      })
    );
  }

  register(userData: User, storeData?: Store | null): Observable<any> {
    console.log('🚀 Début de l\'inscription');
    console.log('📦 Données utilisateur:', userData);

    // Si c'est un commerçant, envoyer directement les données du magasin
    if (storeData) {
      console.log('🏪 Création d\'un magasin avec les données utilisateur');
      const storePayload = {
        name: storeData.name,
        description: storeData.description,
        address: storeData.address,
        phone: storeData.phone,
        email: storeData.email,
        website: storeData.website || null,
        storeType: storeData.storeType,
        isActive: true,
        // Ajouter les données utilisateur
        firstName: userData.firstName,
        lastName: userData.lastName,
        password: userData.password,
        confirmPassword: userData.password, // Utiliser le même mot de passe pour la confirmation
        // Ajouter un ownerId temporaire (sera remplacé par le backend)
        ownerId: 0
      };
      console.log('📦 Données magasin envoyées:', storePayload);
      return this.http.post(`${this.apiUrl}/stores`, storePayload).pipe(
        tap(store => console.log('✅ Magasin créé:', store))
      );
    } else {
      // Si ce n'est pas un commerçant, créer uniquement l'utilisateur
      // Ajouter le champ confirmPassword requis par le backend
      const userPayload = {
        ...userData,
        confirmPassword: userData.password // Utiliser le même mot de passe pour la confirmation
      };
      console.log('📦 Données utilisateur envoyées:', userPayload);
      return this.http.post<User>(`${this.apiUrl}/users/register`, userPayload).pipe(
        tap(response => console.log('✅ Utilisateur créé:', response))
      );
    }
  }

  logout(): void {
    console.log('🔒 Déconnexion de l\'utilisateur');
    // Nettoyer le localStorage
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  isAdmin(): boolean {
    const currentUser = this.currentUserSubject.value;
    return currentUser?.role === 'ADMIN';
  }

  isStoreOwner(): boolean {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser) {
      return false;
    }
    
    // Si l'utilisateur existe mais n'a pas de rôle défini et qu'on n'est pas déjà en train de vérifier
    if (!currentUser.role && currentUser.id && !this.isCheckingRole) {
      console.log('⚠️ Utilisateur sans rôle défini, vérification asynchrone du rôle');
      
      // Éviter les appels récursifs
      this.isCheckingRole = true;
      
      // Déclencher une vérification asynchrone du rôle
      this.fetchUserRole(currentUser.id).subscribe(
        userWithRole => {
          console.log('✅ Mise à jour du rôle utilisateur:', userWithRole.role);
          // Mettre à jour l'utilisateur avec le rôle récupéré
          const updatedUser = { ...currentUser, role: userWithRole.role };
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          
          // Réinitialiser le flag avant de mettre à jour le subject
          this.isCheckingRole = false;
          this.currentUserSubject.next(updatedUser);
        },
        error => {
          console.error('❌ Erreur lors de la récupération du rôle:', error);
          this.isCheckingRole = false;
        }
      );
      
      // Par défaut, on retourne false en attendant la vérification asynchrone
      return false;
    }
    
    const role = currentUser.role?.toUpperCase();
    console.log('🔍 Vérification du rôle:', role);
    
    // Accepter uniquement STORE_OWNER comme rôle de commerçant
    return role === 'STORE_OWNER';
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUserRole(): string | null {
    return this.currentUserSubject.value?.role || null;
  }

  updateCurrentUser(user: User): void {
    // Récupérer l'utilisateur actuel pour préserver le rôle si nécessaire
    const currentUser = this.currentUserSubject.value;
    
    // Si le nouveau user n'a pas de rôle mais que l'utilisateur actuel en a un, préserver ce rôle
    if (currentUser && currentUser.role && !user.role) {
      console.log('Préservation du rôle lors de la mise à jour:', currentUser.role);
      user.role = currentUser.role;
    }
    
    console.log('Mise à jour de l\'utilisateur dans le localStorage avec rôle:', user.role);
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
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