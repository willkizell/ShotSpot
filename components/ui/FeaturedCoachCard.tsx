import Link from "next/link";
import { Avatar } from "./Avatar";
import { Badge } from "./Badge";
import type { CoachCardData } from "./CoachCard";

const EVENT_LABELS: Record<string, string> = {
  shot_put: "Shot Put",
  discus: "Discus",
  hammer: "Hammer",
  javelin: "Javelin",
};

const CADENCE_LABELS: Record<string, string> = {
  monthly: "/mo",
  weekly: "/wk",
  one_time: "one-time",
};

export function FeaturedCoachCard({ coach }: { coach: CoachCardData }) {
  return (
    <Link href={`/coaches/${coach.id}`} className="block group mb-8">
      <div className="border-2 border-[#007B6F] bg-[#D7D7D7] group-hover:border-black transition-colors">
        {/* Featured label */}
        <div className="flex items-center gap-2 border-b border-[#007B6F] px-5 py-2 bg-[#007B6F]">
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span
            className="text-xs text-white tracking-widest uppercase"
            style={{ fontFamily: "var(--font-anton)" }}
          >
            Featured Coach
          </span>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Left: Avatar + core info */}
            <div className="flex items-start gap-5 flex-1">
              <Avatar src={coach.avatar_url} name={coach.full_name} size="xl" />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                  <h2 className="text-2xl font-bold leading-tight">{coach.full_name}</h2>
                  <div className="text-right">
                    <span className="text-2xl font-bold">
                      From ${coach.starting_price}
                    </span>
                    <span className="text-sm text-black/50 ml-1">
                      {CADENCE_LABELS[coach.billing_cadence]}
                    </span>
                  </div>
                </div>
                {coach.organization && (
                  <p className="text-sm font-medium text-black/70 mb-1">{coach.organization}</p>
                )}
                <p className="text-sm text-black/60 mb-3">
                  {coach.remote ? "Remote" : coach.location}
                  {coach.remote && coach.location ? ` · Based in ${coach.location}` : ""}
                  {" · "}
                  {coach.years_coaching} years coaching
                </p>
                <p className="text-sm text-black/80 leading-relaxed mb-4 max-w-xl">
                  {coach.headline}
                </p>
                <div className="flex flex-wrap gap-2">
                  {coach.events.map((event) => (
                    <Badge key={event} variant="event">
                      {EVENT_LABELS[event] ?? event}
                    </Badge>
                  ))}
                  {coach.has_elite_athletes && (
                    <Badge variant="accent">Elite athletes</Badge>
                  )}
                  {coach.proof_tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: CTA */}
            <div className="flex flex-col justify-between items-end gap-4 sm:min-w-[160px]">
              <div className="text-right space-y-1">
                <p className="text-xs text-black/50">{coach.response_time} response</p>
                <p className="text-xs text-black/50">
                  {coach.athlete_capacity - coach.athlete_count} spots left
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <div className="border-2 border-black bg-black text-[#D7D7D7] px-6 py-2.5 text-sm font-semibold text-center group-hover:bg-[#007B6F] group-hover:border-[#007B6F] transition-colors">
                  {coach.intake_mode === "instant_join" ? "Join now" : "View & Apply"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
