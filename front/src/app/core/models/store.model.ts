import { Product } from './product.model';

export interface Store {
  id: number;
  name: string;
  description?: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  category?: string;
  image_url?: string;
  rating?: number;
  distance?: number;
  isFavorite?: boolean;
  is_active?: boolean;
}

export interface StoreResponse {
  content: Store[];
  pageable: any;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: any;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface CreateStoreDto {
  name: string;
  description: string;
  category: string;
  location: string;
  address: string;
  openingHours: string;
  contactEmail: string;
  contactPhone: string;
  imageUrl?: string;
} 