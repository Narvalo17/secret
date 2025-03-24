import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@core/models/store.model';
import { StoreService } from '@core/services/store.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-store-detail',
  templateUrl: './store-detail.component.html',
  styleUrls: ['./store-detail.component.scss']
})
export class StoreDetailComponent implements OnInit {
  store: Store | null = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private storeService: StoreService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadStore();
  }

  private loadStore(): void {
    const storeId = this.route.snapshot.params['id'];
    if (!storeId) {
      this.error = true;
      this.loading = false;
      this.notificationService.error('ID du magasin non trouvé');
      return;
    }

    this.storeService.getStoreById(storeId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.store = response.data;
        } else {
          this.error = true;
          this.notificationService.error('Impossible de charger les détails du magasin');
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = true;
        this.loading = false;
        this.notificationService.error('Erreur lors du chargement du magasin');
      }
    });
  }

  toggleFavorite(): void {
    if (!this.store) return;

    const action = this.store.isFavorite
      ? this.storeService.removeFromFavorites(this.store.id)
      : this.storeService.addToFavorites(this.store.id);

    action.subscribe({
      next: () => {
        if (this.store) {
          this.store.isFavorite = !this.store.isFavorite;
          const message = this.store.isFavorite
            ? 'Magasin ajouté aux favoris'
            : 'Magasin retiré des favoris';
          this.notificationService.success(message);
        }
      },
      error: () => {
        this.notificationService.error('Erreur lors de la mise à jour des favoris');
      }
    });
  }
} 