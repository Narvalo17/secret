import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '@core/models/user.model';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl + '/users';

  constructor(private http: HttpClient) {}

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  updateUser(id: number, userData: Partial<User>): Observable<User> {
    console.log('Mise à jour du profil utilisateur ID:', id);
    console.log('Données envoyées avant traitement:', userData);
    
    // S'assurer que tous les champs requis sont présents, même avec des valeurs vides
    const updateData = {
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      email: userData.email || '',
      phoneNumber: userData.phoneNumber || '',
      // Ajouter confirmPassword pour respecter le format attendu par l'API
      password: userData.password || '',
      confirmPassword: userData.password || '',
      // Préserver le rôle s'il est fourni
      role: userData.role || 'USER'
    };
    
    console.log('Données envoyées après traitement:', updateData);
    return this.http.put<User>(`${this.apiUrl}/${id}`, updateData);
  }

  updatePassword(id: number, newPassword: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/password`, { password: newPassword });
  }
}