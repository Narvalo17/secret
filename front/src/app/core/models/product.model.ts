export interface Product {
  id: number;
  name: string;
  description?: string;
  originalPrice: number;
  discountPercentage: number;
  currentPrice: number;
  quantity: number;
  price: number;
  stock: number;
  imageUrl: string;
  storeId: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  storeId?: number;
  searchTerm?: string;
}

export interface ProductSortOptions {
  field: keyof Product;
  direction: 'asc' | 'desc';
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product | Product[] | undefined;
} 