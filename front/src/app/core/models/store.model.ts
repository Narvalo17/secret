export interface Store {
  id?: number;
  name: string;
  address: string;
  description?: string;
  imageUrl?: string;
  rating?: number;
  distance?: number;
  category?: string;
  isFavorite?: boolean;
  openingHours?: string;
  phone?: string;
  additionalInfo?: string;
  qrCode?: string;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StoreResponse {
  success: boolean;
  message: string;
  data?: Store | Store[];
} 