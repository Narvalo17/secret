export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserResponse {
  success: boolean;
  message: string;
  data?: User;
} 