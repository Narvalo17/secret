export interface Store {
  id: number;
  name: string;
  description: string;
  category: string;
  location: string;
  address: string;
  openingHours: string;
  contactEmail: string;
  contactPhone: string;
  email: string;
  phone: string;
  imageUrl?: string;
  rating?: number;
  distance?: number;
  isFavorite?: boolean;
  additionalInfo?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StoreResponse {
  success: boolean;
  message: string;
  data?: Store[];
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