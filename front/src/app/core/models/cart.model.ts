import { Product } from './product.model';

export interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  quantity: number;
  imageUrl: string;
  storeId: string;
  storeName: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface CartResponse {
  success: boolean;
  message: string;
  data?: Cart;
} 