import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

export interface Category {
  id: number;
  name: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  // Cette méthode peut être utilisée si on n'a pas encore chargé les catégories depuis l'API
  getCategoryName(categoryId: number | null | undefined): string {
    if (!categoryId) return 'Non catégorisé';
    
    // Mapping des IDs aux noms de catégories (à remplacer par la liste réelle)
    const categoryMap: Record<number, string> = {
      1: 'Vêtements',
      2: 'Électronique',
      3: 'Alimentation',
      4: 'Maison',
      5: 'Beauté & Santé',
      6: 'Sport & Loisirs',
      7: 'Autres'
    };
    
    return categoryMap[categoryId] || 'Catégorie inconnue';
  }
} 