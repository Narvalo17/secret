import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@core/models/store.model';
import { StoreService } from '@core/services/store.service';
import { NotificationService } from '@core/services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-stores-list',
  templateUrl: './stores-list.component.html',
  styleUrls: ['./stores-list.component.scss']
})
export class StoresListComponent implements OnInit, OnDestroy {
  stores: Store[] = [];
  filteredStores: Store[] = [];
  loading = false;
  filterForm!: FormGroup;
  private filterSubscription?: Subscription;

  categories: string[] = [
    'Boulangeries',
    'Restaurants',
    'Supermarchés',
    'Épiceries',
    'Primeurs',
    'Pâtisseries',
    'Traiteurs',
    'Autres'
  ];

  constructor(
    private storeService: StoreService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadStores();
    this.setupFilterSubscription();
  }

  ngOnDestroy(): void {
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
  }

  private initializeForm(): void {
    this.filterForm = this.fb.group({
      searchTerm: [''],
      category: [''],
      sortBy: ['name']
    });
  }

  private setupFilterSubscription(): void {
    this.filterSubscription = this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  private loadStores(): void {
    this.loading = true;
    this.storeService.getAllStores().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.stores = response.data;
          this.applyFilters();
        } else {
          this.notificationService.error('Erreur lors du chargement des magasins');
        }
      },
      error: (error) => {
        this.notificationService.error('Erreur lors du chargement des magasins');
        console.error('Error loading stores:', error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private applyFilters(): void {
    const filters = this.filterForm.value;
    let filtered = [...this.stores];

    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(store =>
        store.name.toLowerCase().includes(searchTerm) ||
        (store.description && store.description.toLowerCase().includes(searchTerm)) ||
        (store.category && store.category.toLowerCase().includes(searchTerm))
      );
    }

    if (filters.category) {
      filtered = filtered.filter(store => store.category === filters.category);
    }

    filtered = this.sortStores(filtered, filters.sortBy);
    this.filteredStores = filtered;
  }

  private sortStores(stores: Store[], sortBy: string): Store[] {
    return stores.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          return ratingB - ratingA;
        case 'distance':
          const distanceA = a.distance || Infinity;
          const distanceB = b.distance || Infinity;
          return distanceA - distanceB;
        default:
          return 0;
      }
    });
  }

  toggleFavorite(store: Store): void {
    if (!store) return;

    const action = store.isFavorite ? 
      this.storeService.removeFromFavorites(store.id) :
      this.storeService.addToFavorites(store.id);

    action.subscribe({
      next: () => {
        store.isFavorite = !store.isFavorite;
        const message = store.isFavorite ? 
          'Magasin ajouté aux favoris' : 
          'Magasin retiré des favoris';
        this.notificationService.success(message);
      },
      error: (error) => {
        const message = store.isFavorite ?
          'Erreur lors du retrait des favoris' :
          'Erreur lors de l\'ajout aux favoris';
        this.notificationService.error(message);
        console.error('Error toggling favorite:', error);
      }
    });
  }
} 