import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StoreService } from '@core/services/store.service';
import { NotificationService } from '@core/services/notification.service';
import { Store } from '@core/models/store.model';

@Component({
  selector: 'app-store-management',
  templateUrl: './store-management.component.html',
  styleUrls: ['./store-management.component.scss']
})
export class StoreManagementComponent implements OnInit {
  stores: Store[] = [];
  loading = false;
  showForm = false;
  editingStore: Store | null = null;
  storeForm: FormGroup;
  searchForm: FormGroup;

  constructor(
    private storeService: StoreService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.storeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      location: ['', Validators.required],
      category: ['', Validators.required],
      openingHours: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactPhone: ['', Validators.required]
    });

    this.searchForm = this.fb.group({
      searchTerm: [''],
      category: [''],
      location: ['']
    });
  }

  ngOnInit(): void {
    this.loadStores();
    this.setupSearchSubscription();
  }

  private setupSearchSubscription(): void {
    this.searchForm.valueChanges.subscribe(() => {
      this.filterStores();
    });
  }

  private loadStores(): void {
    this.loading = true;
    this.storeService.getAllStores().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.stores = response.data || [];
          this.filterStores();
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

  private filterStores(): void {
    const filters = this.searchForm.value;
    let filteredStores = [...this.stores];

    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filteredStores = filteredStores.filter(store =>
        store.name.toLowerCase().includes(searchTerm) ||
        (store.description && store.description.toLowerCase().includes(searchTerm))
      );
    }

    if (filters.category) {
      filteredStores = filteredStores.filter(store =>
        store.category === filters.category
      );
    }

    if (filters.location) {
      filteredStores = filteredStores.filter(store =>
        store.location && store.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    this.stores = filteredStores;
  }

  onSubmit(): void {
    if (this.storeForm.valid) {
      const storeData = this.storeForm.value;
      
      if (this.editingStore) {
        this.updateStore(this.editingStore.id, storeData);
      } else {
        this.createStore(storeData);
      }
    } else {
      this.notificationService.error('Veuillez remplir tous les champs requis');
    }
  }

  private createStore(storeData: any): void {
    this.storeService.createStore(storeData).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.success('Magasin créé avec succès');
          this.loadStores();
          this.resetForm();
        }
      },
      error: (error) => {
        this.notificationService.error('Erreur lors de la création du magasin');
        console.error('Error creating store:', error);
      }
    });
  }

  private updateStore(id: number, storeData: any): void {
    this.storeService.updateStore(id, storeData).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.success('Magasin mis à jour avec succès');
          this.loadStores();
          this.resetForm();
        }
      },
      error: (error) => {
        this.notificationService.error('Erreur lors de la mise à jour du magasin');
        console.error('Error updating store:', error);
      }
    });
  }

  editStore(store: Store): void {
    this.editingStore = store;
    this.storeForm.patchValue({
      name: store.name,
      description: store.description,
      location: store.location,
      category: store.category,
      openingHours: store.openingHours,
      contactEmail: store.contactEmail,
      contactPhone: store.contactPhone
    });
    this.showForm = true;
  }

  deleteStore(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce magasin ?')) {
      this.storeService.deleteStore(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.notificationService.success('Magasin supprimé avec succès');
            this.loadStores();
          }
        },
        error: (error) => {
          this.notificationService.error('Erreur lors de la suppression du magasin');
          console.error('Error deleting store:', error);
        }
      });
    }
  }

  resetForm(): void {
    this.storeForm.reset();
    this.editingStore = null;
    this.showForm = false;
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }
} 