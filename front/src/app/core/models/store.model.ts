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
  ownerId?: number;    // ID du propriétaire du magasin
  owner_id?: number;   // Alternative à ownerId selon le format de l'API
  openingHours?: string; // Horaires d'ouverture du magasin
  password?: string;   // Mot de passe utilisateur
  firstName?: string;  // Prénom du propriétaire
  lastName?: string;   // Nom du propriétaire
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
  address: string;
  email: string;
  phone?: string;
  website?: string;
  imageUrl?: string;
  ownerId: number;
  password?: string;
} 