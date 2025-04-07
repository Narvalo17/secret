import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store, StoreResponse } from '@core/models/store.model';
import { StoreService } from '@core/services/store.service';
import { NotificationService } from '@core/services/notification.service';
import { AuthService } from '@core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';

@Component({
  selector: 'app-stores-list',
  templateUrl: './stores-list.component.html',
  styleUrls: ['./stores-list.component.scss']
})
export class StoresListComponent implements OnInit, OnDestroy {
  stores: Store[] = [];
  filteredStores: Store[] = [];
  isLoading = false;
  isLoadingFavorites = false;
  error: string | null = null;
  totalElements = 0;
  filterForm!: FormGroup;
  mode: 'merchant' | 'customer' = 'customer';
  private filterSubscription?: Subscription;
  private destroy$ = new Subject<void>();

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
    private notificationService: NotificationService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();
    this.mode = this.route.snapshot.data['mode'] || 'customer';
  }

  ngOnInit(): void {
    this.loadStores();
    this.setupFilterSubscription();
    if (this.authService.isAuthenticated()) {
      this.loadFavoriteStates();
    }
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
    this.isLoading = true;
    this.error = null;

    const filters: any = {};
    if (this.mode === 'merchant') {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser?.id) {
        filters.ownerId = currentUser.id;
      }
    }

    this.storeService.getAllStores(filters).subscribe({
      next: (response) => {
        this.stores = response.content;
        this.totalElements = response.totalElements;
        this.isLoading = false;

        // Charger l'état des favoris si l'utilisateur est connecté
        if (this.authService.isAuthenticated()) {
          this.loadFavoriteStates();
        }
      },
      error: (error) => {
        console.error('Error loading stores:', error);
        this.error = 'Erreur lors du chargement des magasins';
        this.isLoading = false;
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

  private loadFavoriteStates(): void {
    if (!this.authService.isAuthenticated()) {
      return;
    }

    this.isLoadingFavorites = true;
    this.error = null;

    this.storeService.getFavoriteStores().subscribe({
      next: (response) => {
        const favoriteStoreIds = new Set(response.content.map(store => store.id));
        this.stores = this.stores.map(store => ({
          ...store,
          isFavorite: favoriteStoreIds.has(store.id)
        }));
        this.applyFilters();
        this.isLoadingFavorites = false;
      },
      error: (error) => {
        console.error('Error loading favorite states:', error);
        this.stores = this.stores.map(store => ({
          ...store,
          isFavorite: false
        }));
        this.applyFilters();
        this.isLoadingFavorites = false;
      }
    });
  }

  toggleFavorite(store: Store): void {
    if (!store?.id) {
      this.notificationService.error('Impossible d\'ajouter ce magasin aux favoris');
      return;
    }

    try {
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
        error: (error: any) => {
          console.error('Error toggling favorite:', error);
          if (error.message === 'Utilisateur non connecté') {
            this.notificationService.error('Veuillez vous connecter pour ajouter des favoris');
            this.router.navigate(['/auth/login']);
          } else {
            const message = store.isFavorite ?
              'Erreur lors du retrait des favoris' :
              'Erreur lors de l\'ajout aux favoris';
            this.notificationService.error(message);
          }
        }
      });
    } catch (error: any) {
      console.error('Error in toggleFavorite:', error);
      if (error.message === 'Utilisateur non connecté') {
        this.notificationService.error('Veuillez vous connecter pour ajouter des favoris');
        this.router.navigate(['/auth/login']);
      } else {
        this.notificationService.error('Une erreur est survenue');
      }
    }
  }
} 