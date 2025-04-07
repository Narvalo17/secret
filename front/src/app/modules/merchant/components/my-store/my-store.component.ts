import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store, StoreType } from '@core/models/store.model';
import { StoreService } from '@core/services/store.service';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { Router } from '@angular/router';

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
    private authService: AuthService,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private router: Router
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
      storeType: [StoreType.AUTRE, Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{10,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      website: ['', Validators.pattern(/^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/)],
      image_url: [''],
      password: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
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
              storeType: StoreType.AUTRE
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
            storeType: StoreType.AUTRE
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
      // Récupérer les données de l'utilisateur connecté pour les valeurs par défaut
      const currentUser = this.authService.getCurrentUser();
      
      this.storeForm.patchValue({
        name: this.store.name,
        description: this.store.description || '',
        address: this.store.address,
        storeType: this.store.storeType || StoreType.AUTRE,
        phone: this.store.phone || '',
        email: this.store.email || '',
        website: this.store.website || '',
        image_url: this.store.image_url || '',
        password: '',
        firstName: this.store.firstName || currentUser?.firstName || '',
        lastName: this.store.lastName || currentUser?.lastName || ''
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

  private validateStoreData(data: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Vérifier les champs obligatoires
    if (!data.name) errors.push('Le nom du magasin est requis');
    if (!data.description) errors.push('La description est requise');
    if (!data.address) errors.push('L\'adresse est requise');
    if (!data.phone) errors.push('Le téléphone est requis');
    if (!data.email) errors.push('L\'email est requis');
    if (!data.firstName) errors.push('Le prénom est requis');
    if (!data.lastName) errors.push('Le nom est requis');
    
    // Vérifier le format de téléphone
    if (data.phone && !data.phone.match(/^\+?[0-9]{10,15}$/)) {
      errors.push('Le format du téléphone est invalide (10 à 15 chiffres)');
    }
    
    // Vérifier le format d'email
    if (data.email && !data.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      errors.push('Le format de l\'email est invalide');
    }
    
    // Vérifier le type de magasin
    if (!data.storeType || !Object.values(StoreType).includes(data.storeType)) {
      errors.push('Le type de magasin est invalide');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  onSubmit(): void {
    if (this.storeForm.invalid) {
      this.storeForm.markAllAsTouched();
      this.notificationService.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    const storeData = this.storeForm.value;
    
    // Nettoyer le numéro de téléphone
    if (storeData.phone) {
      storeData.phone = storeData.phone.replace(/\D/g, '');
      if (!storeData.phone.match(/^[0-9]{10,15}$/)) {
        this.notificationService.error('Le format du téléphone est invalide (10 à 15 chiffres)');
        return;
      }
    }
    
    this.loading = true;

    if (this.hasStore && this.store?.id) {
      console.log('Mise à jour du magasin ID:', this.store.id);
      
      // Préparation des données complètes pour la mise à jour
      const updateData = {
        ...this.store, // Garder les données existantes comme base
        ...storeData,   // Remplacer par les valeurs du formulaire
        
        // S'assurer que tous les champs obligatoires sont présents et valides
        id: this.store.id,
        ownerId: this.store.ownerId || this.store.owner_id,
        firstName: storeData.firstName || this.store.firstName || '',
        lastName: storeData.lastName || this.store.lastName || '',
        password: storeData.password || this.store.password || 'defaultPassword',
        confirmPassword: storeData.password || this.store.password || 'defaultPassword',
        email: storeData.email || this.store.email || '',
        phone: storeData.phone || this.store.phone || '',
        storeType: storeData.storeType || this.store.storeType || StoreType.AUTRE,
        isActive: this.store.is_active !== undefined ? this.store.is_active : true,
        name: storeData.name || this.store.name,
        description: storeData.description || this.store.description,
        address: storeData.address || this.store.address
      };
      
      // Validation des données avant envoi
      const validation = this.validateStoreData(updateData);
      if (!validation.valid) {
        this.loading = false;
        const errorMsg = validation.errors.join(', ');
        this.notificationService.error(`Données invalides: ${errorMsg}`);
        return;
      }
      
      console.log('Données de mise à jour complètes:', updateData);
      
      this.storeService.updateStore(this.store.id, updateData).subscribe({
        next: (updatedStore) => {
          console.log('Réponse de mise à jour:', updatedStore);
          this.store = updatedStore;
          this.notificationService.success('Magasin mis à jour avec succès');
          this.isEditing = false;
          this.loading = false;
        },
        error: (error) => {
          console.error('Détails de l\'erreur de mise à jour:', error);
          let errorMessage = 'Erreur lors de la mise à jour du magasin';
          
          // Extraire le message d'erreur spécifique du backend
          if (error.error) {
            console.error('Corps de l\'erreur:', JSON.stringify(error.error));
            if (typeof error.error === 'string') {
              errorMessage += `: ${error.error}`;
            } else if (error.error.message) {
              errorMessage += `: ${error.error.message}`;
            } else if (error.error.errors && error.error.errors.length > 0) {
              errorMessage += `: ${error.error.errors[0].defaultMessage || error.error.errors[0].message || JSON.stringify(error.error.errors)}`;
            }
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

      const createStoreDto: Store = {
        id: 0, // Ce champ sera généré par le backend
        name: storeData.name,
        description: storeData.description,
        address: storeData.address,
        phone: storeData.phone || '',
        email: storeData.email || currentUser.email,
        website: storeData.website || '',
        image_url: storeData.image_url || '',
        ownerId: currentUser.id,
        password: storeData.password || '',
        confirmPassword: '',
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        storeType: storeData.storeType || StoreType.AUTRE
      };

      console.log('Création d\'un nouveau magasin pour l\'utilisateur:', currentUser.id);
      console.log('Données du magasin à créer:', createStoreDto);

      this.storeService.createStore(createStoreDto).subscribe({
        next: (createdStore) => {
          this.store = createdStore;
          this.hasStore = true;
          this.notificationService.success('Magasin créé avec succès');
          this.isEditing = false;
          
          // Forcer le rechargement pour s'assurer que toutes les données sont correctes
          this.loadStore();
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

  updateStoreForm(): void {
    if (!this.store) return;

    // Préparer un objet avec les modifications
    const updateData = {
      id: this.store.id,
      name: this.storeForm.value.name,
      description: this.storeForm.value.description,
      address: this.storeForm.value.address,
      phone: this.storeForm.value.phone,
      email: this.storeForm.value.email,
      website: this.storeForm.value.website,
      ownerId: this.store.ownerId,
      storeType: this.storeForm.value.storeType || StoreType.AUTRE,
      image_url: this.storeForm.value.imageUrl || this.store.image_url,
      // Ajouter les champs obligatoires pour le backend
      firstName: this.store.firstName || '',
      lastName: this.store.lastName || '',
      password: this.storeForm.value.password || 'defaultPassword',
      confirmPassword: this.storeForm.value.password || 'defaultPassword'
    };

    this.loading = true;
    console.log('Données de mise à jour complètes:', updateData);
    
    this.storeService.updateStore(this.store.id, updateData)
      .subscribe({
        next: (updatedStore) => {
          this.store = updatedStore;
          this.isEditing = false;
          this.loading = false;
          this.notificationService.success('Magasin mis à jour avec succès');
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour du magasin:', error);
          let errorMessage = 'Erreur lors de la mise à jour du magasin';
          if (error.error && error.error.message) {
            errorMessage += `: ${error.error.message}`;
          }
          this.notificationService.error(errorMessage);
          this.loading = false;
        }
      });
  }

  loadStoreData(): void {
    this.loading = true;
    this.storeService.getCurrentUserStore().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.store = response.data;
          this.patchFormWithStoreData();
          this.loading = false;
        } else {
          this.loading = false;
          this.store = null;
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement du magasin:', error);
        this.loading = false;
        this.store = null;
      }
    });
  }

  createNewStore(): void {
    if (this.storeForm.invalid) {
      this.notificationService.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const newStore: Store = {
      id: 0, // Ce champ sera généré par le backend
      name: this.storeForm.value.name,
      description: this.storeForm.value.description,
      address: this.storeForm.value.address,
      phone: this.storeForm.value.phone,
      email: this.storeForm.value.email,
      website: this.storeForm.value.website,
      storeType: this.storeForm.value.storeType || StoreType.AUTRE,
      image_url: this.storeForm.value.imageUrl,
      ownerId: this.authService.getCurrentUser()?.id,
      password: this.storeForm.value.password,
      confirmPassword: '',
      firstName: this.authService.getCurrentUser()?.firstName || "",
      lastName: this.authService.getCurrentUser()?.lastName || ""
    };

    this.loading = true;
    this.storeService.createStore(newStore).subscribe({
      next: (createdStore) => {
        this.store = createdStore;
        this.isEditing = false;
        this.loading = false;
        this.notificationService.success('Magasin créé avec succès');
        this.router.navigate(['/merchant/products']);
      },
      error: (error) => {
        console.error('Erreur lors de la création du magasin:', error);
        this.notificationService.error('Erreur lors de la création du magasin');
        this.loading = false;
      }
    });
  }
} 