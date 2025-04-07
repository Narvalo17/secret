import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store, StoreType } from '@core/models/store.model';
import { StoreService } from '@core/services/store.service';
import { NotificationService } from '@core/services/notification.service';
import { AuthService } from '@core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { FavoriteStoreService } from '@core/services/favorite-store.service';

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

  storeTypes = [
    { value: StoreType.BOULANGERIE, label: 'Boulangerie' },
    { value: StoreType.RESTAURANT, label: 'Restaurant' },
    { value: StoreType.SUPERMARCHE, label: 'Supermarché' },
    { value: StoreType.EPICERIE, label: 'Épicerie' },
    { value: StoreType.PRIMEUR, label: 'Primeur' },
    { value: StoreType.PATISSERIE, label: 'Pâtisserie' },
    { value: StoreType.TRAITEUR, label: 'Traiteur' },
    { value: StoreType.AUTRE, label: 'Autre' }
  ];

  constructor(
    private storeService: StoreService,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private favoriteStoreService: FavoriteStoreService
  ) {
    this.initializeForm();
    this.mode = this.route.snapshot.data['mode'] || 'customer';
  }

  ngOnInit(): void {
    this.loadStores();
    this.setupFilterSubscription();
    if (this.authService.isAuthenticated()) {
      this.loadFavoriteStores();
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
      storeType: [''],
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
      next: (stores) => {
        this.stores = stores;
        this.totalElements = stores.length;
        this.isLoading = false;

        // Charger l'état des favoris si l'utilisateur est connecté
        if (this.authService.isAuthenticated()) {
          this.loadFavoriteStores();
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
        (store.storeTypeName && store.storeTypeName.toLowerCase().includes(searchTerm))
      );
    }

    if (filters.storeType) {
      filtered = filtered.filter(store => store.storeType === filters.storeType);
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

  private loadFavoriteStores(): void {
    this.favoriteStoreService.getFavoriteStores().subscribe({
      next: (favoriteStores) => {
        const favoriteStoreIds = new Set(favoriteStores.map(store => store.id));
        this.stores.forEach(store => {
          store.isFavorite = favoriteStoreIds.has(store.id);
        });
        this.filteredStores = [...this.stores];
      },
      error: (error) => {
        console.error('Erreur lors du chargement des favoris:', error);
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