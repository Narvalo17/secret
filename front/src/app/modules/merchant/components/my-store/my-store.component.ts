import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store, CreateStoreDto } from '@core/models/store.model';
import { StoreService } from '@core/services/store.service';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-my-store',
  templateUrl: './my-store.component.html',
  styleUrls: ['./my-store.component.scss']
})
export class MyStoreComponent implements OnInit {
  store: Store | null = null;
  storeForm: FormGroup;
  loading = false;
  isEditing = false;
  hasStore = false;
  categories = [
    'ALIMENTATION',
    'VETEMENTS',
    'ELECTRONIQUE',
    'MAISON',
    'BEAUTE',
    'SPORT',
    'AUTRES'
  ];

  constructor(
    private storeService: StoreService,
    private authService: AuthService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.storeForm = this.createStoreForm();
  }

  ngOnInit(): void {
    this.loadStore();
  }

  private createStoreForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      address: ['', Validators.required],
      category: ['', Validators.required],
      phone: ['', Validators.pattern(/^\+?[0-9]{10,15}$/)],
      email: ['', [Validators.email]],
      website: ['', Validators.pattern(/^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/)],
      image_url: [''],
      password: ['']
    });
  }

  private loadStore(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.id) {
      this.loading = true;
      console.log('Chargement du magasin pour l\'utilisateur ID:', currentUser.id);
      
      // Utiliser la méthode spécifique pour récupérer le magasin du propriétaire connecté
      this.storeService.getStoreByOwnerId(currentUser.id).subscribe({
        next: (response) => {
          console.log('Réponse API magasin:', response);
          if (response.success && response.data) {
            this.store = response.data;
            this.hasStore = true;
            this.patchFormWithStoreData();
            console.log('Magasin chargé:', this.store);
          } else {
            this.hasStore = false;
            this.isEditing = true; // Permettre la création d'un magasin
            this.storeForm.reset({
              category: 'ALIMENTATION'
            });
            console.log('Aucun magasin trouvé pour cet utilisateur');
          }
        },
        error: (error) => {
          this.notificationService.error('Erreur lors du chargement du magasin');
          console.error('Détails de l\'erreur API:', error);
          
          // En cas d'erreur, permettre quand même à l'utilisateur de créer un magasin
          this.hasStore = false;
          this.isEditing = true;
          this.storeForm.reset({
            category: 'ALIMENTATION'
          });
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      this.notificationService.error('Vous devez être connecté pour accéder à cette page');
    }
  }

  private patchFormWithStoreData(): void {
    if (this.store) {
      this.storeForm.patchValue({
        name: this.store.name,
        description: this.store.description || '',
        address: this.store.address,
        category: this.store.category || 'AUTRES',
        phone: this.store.phone || '',
        email: this.store.email || '',
        website: this.store.website || '',
        image_url: this.store.image_url || '',
        password: ''
      });
    }
  }

  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.store) {
      // Annuler les modifications
      this.patchFormWithStoreData();
    }
  }

  onSubmit(): void {
    if (this.storeForm.invalid) {
      this.storeForm.markAllAsTouched();
      this.notificationService.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    const storeData = this.storeForm.value;
    this.loading = true;

    if (this.hasStore && this.store?.id) {
      console.log('Mise à jour du magasin ID:', this.store.id);
      
      // Envoyer directement les données du formulaire
      // Le service s'occupera de la transformation des propriétés
      this.storeService.updateStore(this.store.id, {
        ...storeData,
        // Conserver l'ID du propriétaire existant
        ownerId: this.store.ownerId || this.store.owner_id,
        password: storeData.password,
        firstName: this.store.firstName || '',
        lastName: this.store.lastName || ''
      }).subscribe({
        next: (response) => {
          console.log('Réponse de mise à jour:', response);
          // Vérifier si la réponse contient des données, même si success n'est pas explicitement true
          if (response.data) {
            this.store = response.data;
            this.notificationService.success('Magasin mis à jour avec succès');
            this.isEditing = false;
            this.loading = false;
          } else {
            this.notificationService.error('Erreur lors de la mise à jour du magasin');
            this.loading = false;
          }
        },
        error: (error) => {
          console.error('Détails de l\'erreur de mise à jour:', error);
          let errorMessage = 'Erreur lors de la mise à jour du magasin';
          if (error.error && error.error.message) {
            errorMessage += `: ${error.error.message}`;
          }
          this.notificationService.error(errorMessage);
          this.loading = false;
        }
      });
    } else {
      // Créer un nouveau magasin
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser?.id) {
        this.notificationService.error('Vous devez être connecté pour créer un magasin');
        this.loading = false;
        return;
      }

      const createStoreDto: CreateStoreDto = {
        name: storeData.name,
        description: storeData.description,
        category: storeData.category,
        address: storeData.address,
        phone: storeData.phone || '',
        email: storeData.email || currentUser.email,
        website: storeData.website || '',
        imageUrl: storeData.image_url || '',
        ownerId: currentUser.id,
        password: storeData.password || '',
      };

      console.log('Création d\'un nouveau magasin pour l\'utilisateur:', currentUser.id);
      console.log('Données du magasin à créer:', createStoreDto);

      this.storeService.createStore(createStoreDto).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.store = response.data;
            this.hasStore = true;
            this.notificationService.success('Magasin créé avec succès');
            this.isEditing = false;
            
            // Forcer le rechargement pour s'assurer que toutes les données sont correctes
            this.loadStore();
          } else {
            this.notificationService.error('Erreur lors de la création du magasin');
          }
        },
        error: (error) => {
          console.error('Détails de l\'erreur de création:', error);
          let errorMessage = 'Erreur lors de la création du magasin';
          if (error.error && error.error.message) {
            errorMessage += `: ${error.error.message}`;
          }
          this.notificationService.error(errorMessage);
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  updateStoreStatus(isActive: boolean): void {
    if (!this.store?.id) return;

    this.loading = true;
    console.log(`Mise à jour du statut du magasin ID ${this.store.id} vers ${isActive ? 'actif' : 'inactif'}`);
    
    this.storeService.updateStoreStatus(this.store.id, isActive).subscribe({
      next: (response) => {
        console.log('Réponse de mise à jour du statut:', response);
        if (response.success && response.data) {
          this.store = response.data;
          const status = isActive ? 'activé' : 'désactivé';
          this.notificationService.success(`Magasin ${status} avec succès`);
        } else {
          this.notificationService.error('Erreur lors de la mise à jour du statut du magasin');
        }
      },
      error: (error) => {
        this.notificationService.error('Erreur lors de la mise à jour du statut du magasin');
        console.error('Détails de l\'erreur de mise à jour du statut:', error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
} 