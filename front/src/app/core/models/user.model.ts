export interface User {
  id?: number;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailVerified?: boolean;
  role?: string;
}

export interface UserResponse {
  user: User;
  token: string;
} 