import { Component, OnInit } from '@angular/core';
import { Store } from '@core/models/store.model';
import { FavoriteStoreService } from '@core/services/favorite-store.service';
import { StoreService } from '@core/services/store.service';
import { NotificationService } from '@core/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorite-stores',
  templateUrl: './favorite-stores.component.html',
  styleUrls: ['./favorite-stores.component.scss']
})
export class FavoriteStoresComponent implements OnInit {
  favoriteStores: Store[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private favoriteStoreService: FavoriteStoreService,
    private storeService: StoreService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadFavoriteStores();
  }

  loadFavoriteStores(): void {
    this.loading = true;
    this.error = null;

    this.favoriteStoreService.getFavoriteStores().subscribe({
      next: (stores) => {
        this.favoriteStores = stores;
        // Marquer tous les magasins comme favoris
        this.favoriteStores.forEach(store => {
          store.isFavorite = true;
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des favoris', error);
        this.error = 'Impossible de charger vos magasins favoris';
        this.loading = false;
      }
    });
  }

  removeFromFavorites(store: Store): void {
    if (!store?.id) return;

    this.favoriteStoreService.removeFromFavorites(store.id).subscribe({
      next: () => {
        this.notificationService.success('Magasin retiré des favoris');
        this.favoriteStores = this.favoriteStores.filter(s => s.id !== store.id);
      },
      error: (error) => {
        console.error('Erreur lors du retrait des favoris', error);
        this.notificationService.error('Erreur lors du retrait des favoris');
      }
    });
  }

  goToStore(storeId: number): void {
    this.router.navigate(['/stores', storeId]);
  }
} 