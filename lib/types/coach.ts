import type { CoachCardData } from "@/components/ui/CoachCard";

export interface CoachingHistoryEntry {
  role: string;
  organization: string;
  start_year: number;
  end_year: number | null; // null = present
  description: string;
}

export interface CoachProfileData extends CoachCardData {
  banner_url?: string | null;
  full_bio: string;
  coaching_history: CoachingHistoryEntry[];
}
