export interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  active: boolean;
  category?: {
    id: number;
    name: string;
  };
  store: {
    id: number;
    name: string;
  };
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  active?: boolean;
  categoryId?: number;
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
  category?: number;
  minPrice?: number;
  maxPrice?: number;
  storeId?: number;
  searchTerm?: string;
  active?: boolean;
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