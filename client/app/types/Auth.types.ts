export interface User {
  name: string;
  email: string;
  role: string;
  profilePicture: {
    public_id: string;
    secure_url: string;
  };
  emailVerified: boolean;
  permissions: string[];
}

export interface AuthState {
  accessToken: string | null;
  isLoading: boolean;
  user: User | null;
  isLoggedIn: boolean;
}
