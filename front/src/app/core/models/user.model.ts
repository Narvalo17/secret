export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'ADMIN' | 'USER';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserResponse {
  user: User;
  token: string;
} 