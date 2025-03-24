import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '@core/services/product.service';
import { StoreService } from '@core/services/store.service';
import { NotificationService } from '@core/services/notification.service';
import { Product } from '@core/models/product.model';
import { Store } from '@core/models/store.model';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss']
})
export class ProductManagementComponent implements OnInit {
  products: Product[] = [];
  stores: Store[] = [];
  loading = {
    products: false,
    stores: false
  };
  showForm = false;
  editingProduct: Product | null = null;
  productForm: FormGroup;
  searchForm: FormGroup;
  selectedProducts: Set<number> = new Set();

  constructor(
    private productService: ProductService,
    private storeService: StoreService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      originalPrice: ['', [Validators.required, Validators.min(0)]],
      discountPercentage: [0, [Validators.min(0), Validators.max(100)]],
      quantity: ['', [Validators.required, Validators.min(0)]],
      storeId: ['', Validators.required],
      category: ['', Validators.required]
    });

    this.searchForm = this.fb.group({
      searchTerm: [''],
      category: [''],
      store: [''],
      minPrice: [''],
      maxPrice: ['']
    });
  }

  ngOnInit(): void {
    this.loadData();
    this.setupSearchSubscription();
  }

  private loadData(): void {
    this.loadProducts();
    this.loadStores();
  }

  private setupSearchSubscription(): void {
    this.searchForm.valueChanges.subscribe(() => {
      this.filterProducts();
    });
  }

  private loadProducts(): void {
    this.loading.products = true;
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filterProducts();
      },
      error: (error) => {
        this.notificationService.error('Erreur lors du chargement des produits');
        console.error('Error loading products:', error);
      },
      complete: () => {
        this.loading.products = false;
      }
    });
  }

  private loadStores(): void {
    this.loading.stores = true;
    this.storeService.getAllStores().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.stores = response.data || [];
        }
      },
      error: (error) => {
        this.notificationService.error('Erreur lors du chargement des magasins');
        console.error('Error loading stores:', error);
      },
      complete: () => {
        this.loading.stores = false;
      }
    });
  }

  private filterProducts(): void {
    const filters = this.searchForm.value;
    let filteredProducts = [...this.products];

    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        (product.description && product.description.toLowerCase().includes(searchTerm))
      );
    }

    if (filters.category) {
      filteredProducts = filteredProducts.filter(product =>
        product.category === filters.category
      );
    }

    if (filters.store) {
      filteredProducts = filteredProducts.filter(product =>
        product.storeId === parseInt(filters.store)
      );
    }

    if (filters.minPrice) {
      filteredProducts = filteredProducts.filter(product =>
        product.currentPrice >= filters.minPrice
      );
    }

    if (filters.maxPrice) {
      filteredProducts = filteredProducts.filter(product =>
        product.currentPrice <= filters.maxPrice
      );
    }

    this.products = filteredProducts;
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const productData = {
        ...this.productForm.value,
        currentPrice: this.calculateCurrentPrice(
          this.productForm.value.originalPrice,
          this.productForm.value.discountPercentage
        )
      };

      if (this.editingProduct) {
        this.updateProduct(this.editingProduct.id, productData);
      } else {
        this.createProduct(productData);
      }
    } else {
      this.notificationService.error('Veuillez remplir tous les champs requis');
    }
  }

  private calculateCurrentPrice(originalPrice: number, discountPercentage: number): number {
    return originalPrice * (1 - discountPercentage / 100);
  }

  private createProduct(productData: any): void {
    this.productService.createProduct(productData).subscribe({
      next: (response) => {
        this.notificationService.success('Produit créé avec succès');
        this.loadProducts();
        this.resetForm();
      },
      error: (error) => {
        this.notificationService.error('Erreur lors de la création du produit');
        console.error('Error creating product:', error);
      }
    });
  }

  private updateProduct(id: number, productData: any): void {
    this.productService.updateProduct(id, productData).subscribe({
      next: (response) => {
        this.notificationService.success('Produit mis à jour avec succès');
        this.loadProducts();
        this.resetForm();
      },
      error: (error) => {
        this.notificationService.error('Erreur lors de la mise à jour du produit');
        console.error('Error updating product:', error);
      }
    });
  }

  editProduct(product: Product): void {
    this.editingProduct = product;
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      originalPrice: product.originalPrice,
      discountPercentage: product.discountPercentage,
      quantity: product.quantity,
      storeId: product.storeId,
      category: product.category
    });
    this.showForm = true;
  }

  cloneProduct(product: Product): void {
    const clonedProduct = {
      ...product,
      name: `${product.name} (copie)`,
      id: undefined
    };
    this.productService.createProduct(clonedProduct).subscribe({
      next: () => {
        this.notificationService.success('Produit cloné avec succès');
        this.loadProducts();
      },
      error: (error) => {
        this.notificationService.error('Erreur lors du clonage du produit');
        console.error('Error cloning product:', error);
      }
    });
  }

  deleteProduct(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.notificationService.success('Produit supprimé avec succès');
          this.loadProducts();
        },
        error: (error) => {
          this.notificationService.error('Erreur lors de la suppression du produit');
          console.error('Error deleting product:', error);
        }
      });
    }
  }

  deleteSelectedProducts(): void {
    if (this.selectedProducts.size === 0) {
      this.notificationService.info('Veuillez sélectionner des produits à supprimer');
      return;
    }

    if (confirm(`Êtes-vous sûr de vouloir supprimer ${this.selectedProducts.size} produits ?`)) {
      this.productService.deleteProducts(Array.from(this.selectedProducts)).subscribe({
        next: () => {
          this.notificationService.success('Produits supprimés avec succès');
          this.selectedProducts.clear();
          this.loadProducts();
        },
        error: (error) => {
          this.notificationService.error('Erreur lors de la suppression des produits');
          console.error('Error deleting products:', error);
        }
      });
    }
  }

  toggleProductSelection(productId: number): void {
    if (this.selectedProducts.has(productId)) {
      this.selectedProducts.delete(productId);
    } else {
      this.selectedProducts.add(productId);
    }
  }

  selectAllProducts(): void {
    if (this.selectedProducts.size === this.products.length) {
      this.selectedProducts.clear();
    } else {
      this.products.forEach(product => this.selectedProducts.add(product.id));
    }
  }

  getStoreName(storeId: number): string {
    const store = this.stores.find(s => s.id === storeId);
    return store ? store.name : 'Magasin inconnu';
  }

  resetForm(): void {
    this.productForm.reset({
      discountPercentage: 0
    });
    this.editingProduct = null;
    this.showForm = false;
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }
} 