import type { CoachCardData } from "@/components/ui/CoachCard";

export interface CoachingHistoryEntry {
  role: string;
  organization: string;
  start_year: number;
  end_year: number | null;
  description: string;
}

export interface CoachPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  billing_cadence: "monthly" | "weekly" | "one_time";
  includes: string[];
}

export interface CoachLink {
  label: string;
  url: string;
}

export interface CoachProfileData extends CoachCardData {
  banner_url?: string | null;
  full_bio: string;
  coaching_history: CoachingHistoryEntry[];
}
