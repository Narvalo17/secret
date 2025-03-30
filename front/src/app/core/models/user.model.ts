export interface User {
  id?: number;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailVerified?: boolean;
  role?: string;
  street?: string;
  city?: string;
  postalCode?: string;
}

export interface UserResponse {
  user: User;
  token: string;
} 