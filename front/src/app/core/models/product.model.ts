export enum ProductCategory {
    PAIN = 'PAIN',
    VIENNOISERIE = 'VIENNOISERIE',
    PATISSERIE = 'PATISSERIE',
    SANDWICH = 'SANDWICH',
    PLAT = 'PLAT',
    BOISSON = 'BOISSON',
    FRUIT = 'FRUIT',
    LEGUME = 'LEGUME',
    EPICERIE = 'EPICERIE',
    AUTRE = 'AUTRE'
}

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  isActive: boolean;
  quantity: number;
  category: ProductCategory;
  storeId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  active?: boolean;
  category?: ProductCategory;
  storeId: number;
  imageUrl?: string;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  active?: boolean;
  categoryId?: number;
  imageUrl?: string;
}

export interface ProductFilter {
  search?: string;
  category?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface ProductSortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product | Product[] | undefined;
} 