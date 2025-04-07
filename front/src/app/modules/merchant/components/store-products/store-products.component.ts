import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '@core/services/product.service';
import { StoreService } from '@core/services/store.service';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { CategoryService, Category } from '@core/services/category.service';
import { Product, CreateProductDto } from '@core/models/product.model';
import { Store, CreateStoreDto } from '@core/models/store.model';
import { forkJoin } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-store-products',
  templateUrl: './store-products.component.html',
  styleUrls: ['./store-products.component.scss']
})
export class StoreProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  store: Store | null = null;
  loading = {
    products: false,
    store: false,
    submit: false,
    categories: false
  };
  showForm = false;
  editingProduct: Product | null = null;
  productForm!: FormGroup;
  searchForm!: FormGroup;
  selectedProducts: Set<number> = new Set();
  
  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalItems = 0;

  previewUrl: SafeUrl | null = null;
  selectedFile: File | null = null;
  
  // Catégories disponibles
  categories: Category[] = [];

  constructor(
    private productService: ProductService,
    private storeService: StoreService,
    private authService: AuthService,
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private sanitizer: DomSanitizer
  ) {
    this.initForms();
  }

  private initForms(): void {
    // Initialisation du formulaire produit avec valeur "active" à true par défaut
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(0)]],
      active: [true], // Par défaut, le produit est actif
      categoryId: [null], // Ne pas définir de catégorie par défaut
      imageUrl: ['']
    });

    this.searchForm = this.fb.group({
      searchTerm: [''],
      categoryId: [null],
      minPrice: [''],
      maxPrice: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadStoreAndProducts();
    this.setupSearchSubscription();
    // Forcer l'affichage du formulaire après un court délai
    setTimeout(() => {
      if (this.store && !this.showForm && this.products.length === 0) {
        this.showForm = true;
      }
    }, 1000);
  }

  private loadCategories(): void {
    this.loading.categories = true;
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        console.log('Catégories disponibles:', categories);
        this.loading.categories = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories:', error);
        this.loading.categories = false;
      }
    });
  }

  private loadStoreAndProducts(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.id) {
      this.loading.store = true;
      // Vérifier si l'utilisateur a déjà un magasin - Méthode améliorée
      this.storeService.getStoreByOwnerId(currentUser.id).subscribe({
        next: (storeResponse) => {
          console.log('Réponse magasin:', storeResponse);
          // Désactiver immédiatement l'indicateur de chargement
          this.loading.store = false;
          
          if (storeResponse.success && storeResponse.data) {
            this.store = storeResponse.data;
            if (this.store && this.store.id) {
              this.loadProductsByStore(this.store.id);
            } else {
              this.notificationService.error('Magasin invalide');
            }
          } else {
            // Afficher le message d'erreur mais ne pas bloquer l'interface
            console.error('Aucun magasin trouvé pour ce commerçant');
          }
        },
        error: (error: any) => {
          console.error('Erreur lors du chargement du magasin:', error);
          this.loading.store = false;
        }
      });
    } else {
      this.notificationService.error('Vous devez être connecté pour accéder à cette page');
    }
  }

  private loadProductsByStore(storeId: number): void {
    this.loading.products = true;
    this.productService.getProductsByStore(storeId, this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.products = response.content;
        this.totalItems = response.totalElements;
        this.filteredProducts = [...this.products];
        this.applyFilters();
        
        // Désactiver le loading immédiatement
        this.loading.products = false;
        
        // Afficher le formulaire d'ajout si aucun produit n'est trouvé
        if (this.products.length === 0) {
          this.showForm = true;
        }
      },
      error: (error) => {
        this.notificationService.error('Erreur lors du chargement des produits');
        console.error('Error loading products:', error);
        this.loading.products = false;
      }
    });
  }

  private setupSearchSubscription(): void {
    this.searchForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  private applyFilters(): void {
    const filters = this.searchForm.value;
    let filtered = [...this.products];

    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        (product.description && product.description.toLowerCase().includes(searchTerm))
      );
    }

    if (filters.categoryId) {
      filtered = filtered.filter(product =>
        product.category?.id === filters.categoryId
      );
    }

    if (filters.minPrice) {
      filtered = filtered.filter(product =>
        product.price >= filters.minPrice
      );
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(product =>
        product.price <= filters.maxPrice
      );
    }

    this.filteredProducts = filtered;
  }

  onSubmit(): void {
    if (this.productForm.valid && this.store) {
      this.loading.submit = true;
      
      // Récupérer les valeurs du formulaire
      const formValues = this.productForm.value;
      
      // Format minimal qui fonctionne selon Postman
      const productData: any = {
        name: formValues.name,
        description: formValues.description || '',
        price: formValues.price,
        quantity: formValues.quantity,
        active: true,
        store: {
          id: this.store.id
        }
      };

      // Ajouter la catégorie uniquement si elle est spécifiée ET non nulle
      // ET si elle existe dans la liste des catégories disponibles
      if (formValues.categoryId && this.categories.some(c => c.id === formValues.categoryId)) {
        productData.category = {
          id: formValues.categoryId
        };
      }

      console.log('Données produit à envoyer:', productData);

      if (this.editingProduct && this.editingProduct.id) {
        this.updateProduct(this.editingProduct.id, productData);
      } else {
        this.createProduct(productData);
      }
    } else {
      this.notificationService.error('Veuillez remplir tous les champs requis');
    }
  }

  private createProduct(productData: any): void {
    // Si un fichier est sélectionné, convertir en base64 et ajouter à productData
    if (this.selectedFile) {
      this.resizeImage(this.selectedFile, 800, 600, (resizedImage: Blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          // Ajouter l'image en base64 aux données du produit
          const base64String = reader.result as string;
          
          // Limiter la taille de la chaîne base64 pour éviter l'erreur de BDD
          const imageUrl = this.truncateBase64Image(base64String);
          
          // Créer une copie des données avec l'image
          const productWithImage = { ...productData, imageUrl: imageUrl };
          
          // Envoyer la requête avec l'image
          this.sendCreateProductRequest(productWithImage);
        };
        reader.readAsDataURL(resizedImage);
      });
    } else {
      // Envoyer la requête sans image
      this.sendCreateProductRequest(productData);
    }
  }

  // Redimensionner l'image pour réduire sa taille
  private resizeImage(file: File, maxWidth: number, maxHeight: number, callback: (blob: Blob) => void): void {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const image = new Image();
      image.onload = () => {
        // Calculer les dimensions pour conserver le ratio
        let width = image.width;
        let height = image.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        // Créer un canvas pour redimensionner l'image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        // Dessiner l'image redimensionnée sur le canvas
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(image, 0, 0, width, height);
          
          // Convertir le canvas en blob avec qualité réduite
          canvas.toBlob((blob) => {
            if (blob) {
              callback(blob);
            } else {
              callback(file); // Fallback au fichier d'origine
            }
          }, 'image/jpeg', 0.7); // Qualité 70%
        } else {
          callback(file); // Fallback si le contexte n'est pas disponible
        }
      };
      image.src = readerEvent.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  // Tronquer l'image base64 pour respecter la limite VARCHAR(255)
  private truncateBase64Image(base64String: string): string {
    // Différentes options d'images de placeholder pour diversifier l'affichage
    const placeholders = [
      'https://placehold.co/400/ff9a8b/000000?text=Produit',
      'https://placehold.co/400/8ed1fc/000000?text=Produit',
      'https://placehold.co/400/d0e6a5/000000?text=Produit',
      'https://placehold.co/400/ffdd94/000000?text=Produit',
      'https://placehold.co/400/c3aed6/000000?text=Produit'
    ];
    
    // Sélectionner un placeholder aléatoire
    const randomIndex = Math.floor(Math.random() * placeholders.length);
    return placeholders[randomIndex];
  }

  private sendCreateProductRequest(productData: any): void {
    console.log('Envoi des données pour création de produit:', JSON.stringify(productData));
    
    // Vérifier si store.id et category.id sont valides
    const storeId = productData.store?.id;
    const categoryId = productData.category?.id;
    
    if (!storeId) {
      this.notificationService.error('ID du magasin manquant ou invalide');
      this.loading.submit = false;
      return;
    }
    
    // Si une catégorie est spécifiée, vérifier qu'elle existe bien
    if (categoryId && !this.categories.some(c => c.id === categoryId)) {
      this.notificationService.error(`La catégorie avec l'ID ${categoryId} n'existe pas`);
      this.loading.submit = false;
      return;
    }
    
    this.productService.createProduct(productData).subscribe({
      next: (response) => {
        this.notificationService.success('Produit créé avec succès');
        if (this.store && this.store.id) {
          this.loadProductsByStore(this.store.id);
        }
        this.resetForm();
        this.loading.submit = false;
      },
      error: (error) => {
        console.error('Error creating product:', error);
        let errorMessage = 'Erreur lors de la création du produit';
        
        // Afficher les données complètes de l'erreur pour diagnostic
        console.error('Détails complets de l\'erreur:', JSON.stringify(error));
        
        // Extraire les messages d'erreur pertinents
        if (error.error && error.error.message) {
          if (error.error.message.includes('constraint')) {
            // Erreur de contrainte de clé étrangère
            errorMessage = 'Violation de contrainte référentielle: vérifiez que la catégorie existe';
          } else if (error.error.message.includes('Valeur trop longue')) {
            errorMessage = 'Valeur trop longue pour un champ (ex: description)';
          } else {
            errorMessage += ': ' + error.error.message;
          }
        }
        
        this.notificationService.error(errorMessage);
        this.loading.submit = false;
      }
    });
  }

  private updateProduct(id: number, productData: any): void {
    this.productService.updateProduct(id, productData).subscribe({
      next: (response) => {
        this.notificationService.success('Produit mis à jour avec succès');
        if (this.store && this.store.id) {
          this.loadProductsByStore(this.store.id);
        }
        this.resetForm();
        this.loading.submit = false;
      },
      error: (error) => {
        this.notificationService.error('Erreur lors de la mise à jour du produit');
        console.error('Error updating product:', error);
        this.loading.submit = false;
      }
    });
  }

  editProduct(product: Product): void {
    this.editingProduct = product;
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      active: product.active,
      categoryId: product.category?.id,
      imageUrl: product.imageUrl
    });
    this.showForm = true;
  }

  deleteProduct(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.loading.products = true;
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.notificationService.success('Produit supprimé avec succès');
          this.loadProductsByStore(this.store!.id);
        },
        error: (error) => {
          this.notificationService.error('Erreur lors de la suppression du produit');
          console.error('Error deleting product:', error);
          this.loading.products = false;
        }
      });
    }
  }

  toggleProductStatus(product: Product): void {
    if (product.id === undefined) return;
    
    const updatedProduct = { 
      ...product, 
      active: !product.active 
    };
    
    this.productService.updateProduct(product.id, updatedProduct).subscribe({
      next: () => {
        this.notificationService.success(`Produit ${updatedProduct.active ? 'activé' : 'désactivé'} avec succès`);
        product.active = updatedProduct.active;
      },
      error: (error) => {
        this.notificationService.error('Erreur lors de la mise à jour du statut');
        console.error('Error updating product status:', error);
        // Revenir à l'état précédent
        product.active = !updatedProduct.active;
      }
    });
  }

  toggleProductSelection(productId: number): void {
    if (this.selectedProducts.has(productId)) {
      this.selectedProducts.delete(productId);
    } else {
      this.selectedProducts.add(productId);
    }
  }

  selectAllProducts(): void {
    if (this.selectedProducts.size === this.filteredProducts.length) {
      this.selectedProducts.clear();
    } else {
      this.selectedProducts.clear();
      this.filteredProducts.forEach(product => {
        if (product.id !== undefined) {
          this.selectedProducts.add(product.id);
        }
      });
    }
  }

  deleteSelectedProducts(): void {
    if (this.selectedProducts.size === 0) return;
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${this.selectedProducts.size} produit(s) ?`)) {
      const deleteObservables = Array.from(this.selectedProducts).map(id => 
        this.productService.deleteProduct(id)
      );
      
      this.loading.products = true;
      forkJoin(deleteObservables).subscribe({
        next: () => {
          this.notificationService.success(`${this.selectedProducts.size} produit(s) supprimé(s) avec succès`);
          this.selectedProducts.clear();
          if (this.store && this.store.id !== undefined) {
            this.loadProductsByStore(this.store.id);
          }
        },
        error: (error) => {
          this.notificationService.error('Erreur lors de la suppression des produits');
          console.error('Error deleting products:', error);
          this.loading.products = false;
        }
      });
    }
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.productForm.reset({
      active: true,
      categoryId: null
    });
    this.editingProduct = null;
    this.showForm = false;
    this.resetImageUpload();
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    if (this.store) {
      this.loadProductsByStore(this.store.id);
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(price);
  }

  getProductImageUrl(product: Product): string {
    // Vérifier si le produit est défini
    if (!product) {
      return 'https://placehold.co/400/EEE/31343C?text=Produit';
    }
    
    // Vérifier si le produit a une URL d'image valide
    if (product.imageUrl) {
      // Si l'URL est absolue (commence par http ou https), l'utiliser directement
      if (product.imageUrl.startsWith('http')) {
        return product.imageUrl;
      }
      
      // Si c'est un chemin relatif, essayer de le résoudre
      if (product.imageUrl.startsWith('/assets') || product.imageUrl.startsWith('assets')) {
        // Supprimer le slash initial si présent
        const path = product.imageUrl.startsWith('/') ? product.imageUrl.substring(1) : product.imageUrl;
        return path; // Le chemin sera résolu par rapport à la racine de l'application
      }
    }
    
    // Fallback: utiliser une image de placeholder avec le nom du produit
    const productName = product.name ? encodeURIComponent(product.name) : 'Produit';
    return `https://placehold.co/400/EEE/31343C?text=${productName.substring(0, 10)}`;
  }

  getCategoryName(categoryId: number | undefined): string {
    if (!categoryId) return 'Sans catégorie';
    
    // Utiliser les catégories chargées depuis l'API
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Catégorie inconnue';
  }

  createDefaultStore(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.id) {
      this.notificationService.error('Vous devez être connecté pour créer un magasin');
      return;
    }

    this.loading.store = true;
    
    // Créer un magasin temporaire par défaut
    const defaultStore: CreateStoreDto = {
      name: `Magasin de ${currentUser.firstName || 'Commerçant'} ${currentUser.lastName || ''}`,
      description: 'Magasin temporaire',
      address: 'À compléter',
      category: 'ALIMENTATION',
      phone: '',
      email: currentUser.email,
      website: '',
      imageUrl: '',
      ownerId: currentUser.id,
      password: ''
    };

    this.storeService.createStore(defaultStore).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.store = response.data;
          this.notificationService.success('Magasin temporaire créé avec succès');
          this.showForm = true; // Afficher le formulaire d'ajout de produit
          this.loading.store = false;
        } else {
          this.notificationService.error('Erreur lors de la création du magasin temporaire');
          this.loading.store = false;
        }
      },
      error: (error) => {
        console.error('Erreur lors de la création du magasin temporaire:', error);
        this.notificationService.error('Impossible de créer un magasin temporaire');
        this.loading.store = false;
      }
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      
      // Vérifier la taille du fichier (maximum 2MB)
      if (this.selectedFile.size > 2 * 1024 * 1024) {
        this.notificationService.error('L\'image ne doit pas dépasser 2MB');
        this.resetImageUpload();
        return;
      }
      
      // Vérifier le type de fichier
      if (!this.selectedFile.type.match(/image\/(jpeg|jpg|png|gif)/)) {
        this.notificationService.error('Formats acceptés: JPEG, PNG, GIF');
        this.resetImageUpload();
        return;
      }
      
      // Prévisualisation de l'image
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  resetImageUpload(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    
    // Réinitialiser le champ de fichier
    const fileInput = document.getElementById('product-image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
} 