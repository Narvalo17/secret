import { Component, OnInit } from '@angular/core';
import { Store } from '@core/models/store.model';
import { StoreService } from '@core/services/store.service';

@Component({
  selector: 'app-favorite-stores',
  templateUrl: './favorite-stores.component.html',
  styleUrls: ['./favorite-stores.component.scss']
})
export class FavoriteStoresComponent implements OnInit {
  favoriteStores: Store[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private storeService: StoreService) {}

  ngOnInit(): void {
    this.loadFavoriteStores();
  }

  private loadFavoriteStores(): void {
    this.isLoading = true;
    this.error = null;

    this.storeService.getFavoriteStores().subscribe({
      next: (response) => {
        this.favoriteStores = response.data;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement des magasins favoris';
        this.isLoading = false;
      }
    });
  }

  removeFromFavorites(store: Store): void {
    if (!store.id) return;

    this.storeService.removeFromFavorites(store.id).subscribe({
      next: () => {
        this.loadFavoriteStores();
      },
      error: () => {
        this.error = 'Erreur lors du retrait des favoris';
      }
    });
  }
} 