export interface Product {
  id?: number;
  name: string;
  description: string;
  originalPrice: number;
  discountPercentage: number;
  currentPrice: number;
  quantity: number;
  imageUrl?: string;
  image?: string;
  storeId: number;
  category?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data?: Product | Product[];
} 