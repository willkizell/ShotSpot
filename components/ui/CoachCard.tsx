import Link from "next/link";
import { Avatar } from "./Avatar";
import { Badge } from "./Badge";

export interface CoachCardData {
  id: string;
  full_name: string;
  avatar_url?: string | null;
  location: string;
  remote: boolean;
  headline: string;
  organization?: string | null;
  events: string[];
  years_coaching: number;
  intake_mode: "instant_join" | "application_required";
  starting_price: number;
  billing_cadence: "monthly" | "weekly" | "one_time";
  availability: "open" | "limited" | "waitlist" | "closed";
  athlete_count: number;
  athlete_capacity: number;
  response_time: string;
  proof_tags: string[];
  has_elite_athletes: boolean;
  is_featured?: boolean;
}

export const EVENT_LABELS: Record<string, string> = {
  shot_put: "Shot Put",
  discus: "Discus",
  hammer: "Hammer",
  javelin: "Javelin",
};

const CADENCE_LABELS: Record<string, string> = {
  monthly: "/mo",
  weekly: "/wk",
  one_time: " one-time",
};

const AVAILABILITY_CONFIG = {
  open: { label: "Open", color: "text-[#007B6F]" },
  limited: { label: "Limited spots", color: "text-amber-700" },
  waitlist: { label: "Waitlist", color: "text-black/50" },
  closed: { label: "Closed", color: "text-red-600" },
};

// ─── Coach card (handles both regular and featured) ───────────────────────────

export function CoachCard({ coach }: { coach: CoachCardData }) {
  const availability = AVAILABILITY_CONFIG[coach.availability];

  return (
    <div className="flex flex-col h-full">
      {/* Featured banner — sits above the card, outside the link */}
      {coach.is_featured && (
        <div className="flex items-center justify-between px-4 py-2 bg-[#007B6F]">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span
              className="text-[10px] text-white tracking-widest uppercase"
              style={{ fontFamily: "var(--font-anton)" }}
            >
              Featured Coach
            </span>
          </div>
          <Link
            href="/coach-signup"
            className="text-[10px] text-white/70 hover:text-white transition-colors underline underline-offset-2"
          >
            Become a featured coach →
          </Link>
        </div>
      )}

      {/* Card body */}
      <Link href={`/coaches/${coach.id}`} className="block group flex-1">
        <div
          className={`border-2 p-5 bg-[#D7D7D7] transition-colors h-full flex flex-col ${
            coach.is_featured
              ? "border-[#007B6F] border-t-0 group-hover:border-[#005a51]"
              : "border-black group-hover:border-[#007B6F]"
          }`}
        >
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <Avatar src={coach.avatar_url} name={coach.full_name} size="lg" />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base leading-tight truncate">{coach.full_name}</h3>
              {coach.organization && (
                <p className="text-xs text-black/60 truncate mt-0.5">{coach.organization}</p>
              )}
              <p className="text-xs text-black/60 mt-0.5">
                {coach.remote ? "Remote" : coach.location}
                {coach.remote && coach.location !== "Remote" ? ` · ${coach.location}` : ""}
              </p>
              <p className="text-xs text-black/50 mt-0.5">{coach.years_coaching}yr coaching</p>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="font-bold text-base leading-none">${coach.starting_price}</p>
              <p className="text-xs text-black/50">{CADENCE_LABELS[coach.billing_cadence]}</p>
            </div>
          </div>

          {/* Headline */}
          <p className="text-sm text-black/80 leading-snug mb-4 line-clamp-3 flex-1">
            {coach.headline}
          </p>

          {/* Events */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {coach.events.map((event) => (
              <Badge key={event} variant="event">
                {EVENT_LABELS[event] ?? event}
              </Badge>
            ))}
            {coach.has_elite_athletes && (
              <Badge variant="accent">Elite athletes</Badge>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-black/20 pt-3 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-black/60">
              <span className={`font-semibold ${availability.color}`}>
                {availability.label}
              </span>
              <span>·</span>
              <span>{coach.response_time} response</span>
            </div>
            <div className="text-xs font-semibold border border-black px-2 py-0.5">
              {coach.intake_mode === "instant_join" ? "Instant join" : "Apply"}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
