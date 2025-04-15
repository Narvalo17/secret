import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '@env/environment';
import { ProductCategory } from '@core/models/product.model';

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
  private categories: Category[] = [];
  private categoriesLoaded = false;
  private categoriesSubject = new BehaviorSubject<Category[]>([]);

  constructor(private http: HttpClient) {
    this.loadCategories();
  }

  getAllCategories(): Observable<Category[]> {
    return this.categoriesSubject.asObservable();
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  getCategoryName(categoryId: number | null | undefined): string {
    if (!categoryId) return 'Non catégorisé';
    
    // Convertir l'index en valeur d'énumération
    const enumValues = Object.values(ProductCategory);
    const category = enumValues[categoryId - 1]; // -1 car les IDs commencent à 1
    
    return category ? this.getDisplayName(category as ProductCategory) : 'Catégorie inconnue';
  }

  private getDisplayName(category: ProductCategory): string {
    switch (category) {
      case ProductCategory.PAIN: return 'Pain';
      case ProductCategory.VIENNOISERIE: return 'Viennoiserie';
      case ProductCategory.PATISSERIE: return 'Pâtisserie';
      case ProductCategory.SANDWICH: return 'Sandwich';
      case ProductCategory.PLAT: return 'Plat';
      case ProductCategory.BOISSON: return 'Boisson';
      case ProductCategory.FRUIT: return 'Fruit';
      case ProductCategory.LEGUME: return 'Légume';
      case ProductCategory.EPICERIE: return 'Épicerie';
      case ProductCategory.AUTRE: return 'Autre';
      default: return 'Catégorie inconnue';
    }
  }

  private loadCategories(): void {
    if (this.categoriesLoaded) return;

    const categories = Object.values(ProductCategory).map((category, index) => ({
      id: index + 1,
      name: this.getDisplayName(category as ProductCategory),
      description: ''
    }));

    this.categories = categories;
    this.categoriesLoaded = true;
    this.categoriesSubject.next(categories);
  }
} 