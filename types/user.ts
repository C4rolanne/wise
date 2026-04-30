export interface UserProfile {
  id: string;
  email: string;
  name?: string | null;
  fullName?: string | null;
  avatarUrl?: string | null;
  picture?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUserProfileInput {
  name?: string;
  fullName?: string;
  avatarUrl?: string;
}
