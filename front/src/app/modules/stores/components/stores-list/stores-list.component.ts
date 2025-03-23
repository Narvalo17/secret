import { Component, OnInit } from '@angular/core';
import { Store } from '@core/models/store.model';
import { StoreService } from '@core/services/store.service';

@Component({
  selector: 'app-stores-list',
  templateUrl: './stores-list.component.html',
  styleUrls: ['./stores-list.component.scss']
})
export class StoresListComponent implements OnInit {
  stores: Store[] = [];
  filteredStores: Store[] = [];
  searchTerm = '';
  selectedCategory = 'Tous';
  isLoading = false;
  error: string | null = null;

  constructor(private storeService: StoreService) {}

  ngOnInit(): void {
    this.loadStores();
  }

  private loadStores(): void {
    this.isLoading = true;
    this.error = null;

    this.storeService.getAllStores().subscribe({
      next: (response) => {
        this.stores = Array.isArray(response.data) ? response.data : [];
        this.filterStores();
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement des magasins';
        this.isLoading = false;
      }
    });
  }

  filterStores(): void {
    this.filteredStores = this.stores.filter(store => {
      const matchesSearch = !this.searchTerm || 
        store.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (store.description?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false);

      const matchesCategory = this.selectedCategory === 'Tous' || 
        store.category === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }

  onSearchChange(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.filterStores();
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.filterStores();
  }

  toggleFavorite(store: Store): void {
    if (!store.id) return;

    if (store.isFavorite) {
      this.storeService.removeFromFavorites(store.id).subscribe({
        next: () => {
          store.isFavorite = false;
        },
        error: () => {
          this.error = 'Erreur lors du retrait des favoris';
        }
      });
    } else {
      this.storeService.addToFavorites(store.id).subscribe({
        next: () => {
          store.isFavorite = true;
        },
        error: () => {
          this.error = 'Erreur lors de l\'ajout aux favoris';
        }
      });
    }
  }
} 