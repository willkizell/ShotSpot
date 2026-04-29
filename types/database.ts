export type UserRole = "athlete" | "coach" | "admin";

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  onboarding_complete: boolean;
  created_at: string;
}
