import { Component, OnInit } from '@angular/core';
import { Store } from '@core/models/store.model';
import { StoreService } from '@core/services/store.service';
import { NotificationService } from '@core/services/notification.service';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-favorite-stores',
  templateUrl: './favorite-stores.component.html',
  styleUrls: ['./favorite-stores.component.scss']
})
export class FavoriteStoresComponent implements OnInit {
  favoriteStores: Store[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(
    private storeService: StoreService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.getCurrentUser()) {
      this.notificationService.error('Veuillez vous connecter pour voir vos favoris');
      this.router.navigate(['/auth/login']);
      return;
    }
    this.loadFavoriteStores();
  }

  loadFavoriteStores(): void {
    this.isLoading = true;
    this.error = null;

    try {
      this.storeService.getFavoriteStores().subscribe({
        next: (response) => {
          if (response && response.content) {
            this.favoriteStores = response.content;
            if (this.favoriteStores.length === 0) {
              this.notificationService.info('Vous n\'avez pas encore de magasins favoris');
            } else {
              this.notificationService.success('Favoris chargés avec succès');
            }
          } else {
            this.notificationService.error('Aucun favori trouvé');
          }
        },
        error: (error) => {
          console.error('Error loading favorite stores:', error);
          if (error.status === 401) {
            this.notificationService.error('Veuillez vous connecter pour voir vos favoris');
            this.router.navigate(['/auth/login']);
          } else if (error.status === 403) {
            this.notificationService.error('Vous n\'avez pas les droits pour voir les favoris');
            this.router.navigate(['/']);
          } else {
            this.notificationService.error('Erreur lors du chargement des favoris');
          }
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } catch (error: any) {
      console.error('Error in loadFavoriteStores:', error);
      if (error.message === 'Utilisateur non connecté') {
        this.notificationService.error('Veuillez vous connecter pour voir vos favoris');
        this.router.navigate(['/auth/login']);
      } else {
        this.notificationService.error('Une erreur est survenue');
      }
      this.isLoading = false;
    }
  }

  removeFromFavorites(store: Store): void {
    if (!store.id) return;

    try {
      this.storeService.removeFromFavorites(store.id).subscribe({
        next: () => {
          this.favoriteStores = this.favoriteStores.filter(s => s.id !== store.id);
          this.notificationService.success('Magasin retiré des favoris');
          if (this.favoriteStores.length === 0) {
            this.notificationService.info('Vous n\'avez plus de magasins favoris');
          }
        },
        error: (error) => {
          console.error('Error removing from favorites:', error);
          if (error.status === 401) {
            this.notificationService.error('Veuillez vous connecter pour gérer vos favoris');
            this.router.navigate(['/auth/login']);
          } else {
            this.notificationService.error('Erreur lors du retrait des favoris');
          }
        }
      });
    } catch (error: any) {
      console.error('Error in removeFromFavorites:', error);
      if (error.message === 'Utilisateur non connecté') {
        this.notificationService.error('Veuillez vous connecter pour gérer vos favoris');
        this.router.navigate(['/auth/login']);
      } else {
        this.notificationService.error('Une erreur est survenue');
      }
    }
  }
} 