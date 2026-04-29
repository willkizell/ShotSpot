import Link from "next/link";
import { Badge } from "./Badge";
import type { CoachCardData } from "./CoachCard";

const EVENT_LABELS: Record<string, string> = {
  shot_put: "Shot Put",
  discus: "Discus",
  hammer: "Hammer",
  javelin: "Javelin",
};

function PhotoBlock({ name, src }: { name: string; src?: string | null }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (src) {
    return (
      <div className="w-56 flex-shrink-0 self-stretch hidden sm:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className="w-56 flex-shrink-0 self-stretch bg-black text-[#D7D7D7] items-center justify-center text-5xl hidden sm:flex"
      style={{ fontFamily: "var(--font-anton)" }}
    >
      {initials}
    </div>
  );
}

export function FeaturedCoachCard({ coach }: { coach: CoachCardData }) {
  const spotsLeft = coach.athlete_capacity - coach.athlete_count;

  return (
    <div className="border-2 border-[#007B6F] mb-8 overflow-hidden">
      {/* Label bar */}
      <div className="flex items-center justify-between px-5 py-2 bg-[#007B6F]">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span
            className="text-xs text-white tracking-widest uppercase"
            style={{ fontFamily: "var(--font-anton)" }}
          >
            Featured Coach
          </span>
        </div>
        <Link
          href="/coach-signup"
          className="text-xs text-white/70 hover:text-white transition-colors underline underline-offset-2"
        >
          Want this spot? →
        </Link>
      </div>

      {/* Body */}
      <div className="flex min-h-[200px]">
        {/* Photo */}
        <PhotoBlock name={coach.full_name} src={coach.avatar_url} />

        {/* Info — flows top to bottom naturally */}
        <Link
          href={`/coaches/${coach.id}`}
          className="flex-1 p-6 flex flex-col gap-3 hover:bg-black/[0.02] transition-colors group min-w-0"
        >
          {/* Name + org */}
          <div>
            <h2 className="text-xl font-bold leading-tight group-hover:text-[#007B6F] transition-colors">
              {coach.full_name}
            </h2>
            {coach.organization && (
              <p className="text-sm text-black/60 mt-0.5">{coach.organization}</p>
            )}
            <p className="text-xs text-black/40 mt-0.5">
              {coach.remote ? "Remote" : coach.location}
              {coach.remote && coach.location ? ` · ${coach.location}` : ""}
              {" · "}{coach.years_coaching} yrs coaching
            </p>
          </div>

          {/* Headline */}
          <p className="text-sm text-black/80 leading-relaxed flex-1">
            {coach.headline}
          </p>

          {/* Event tags */}
          <div className="flex flex-wrap gap-1.5">
            {coach.events.map((e) => (
              <Badge key={e} variant="event">{EVENT_LABELS[e] ?? e}</Badge>
            ))}
            {coach.has_elite_athletes && <Badge variant="accent">Elite athletes</Badge>}
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-black/10 text-sm">
            <div>
              <span className="font-bold text-lg">${coach.starting_price}</span>
              <span className="text-black/50 text-xs ml-1">
                {coach.billing_cadence === "monthly" ? "/mo" : coach.billing_cadence === "weekly" ? "/wk" : "one-time"}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-black/50">
              <span>{coach.response_time} response</span>
            </div>
            {spotsLeft > 0 && (
              <div className="text-xs font-semibold text-amber-700">
                {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left
              </div>
            )}
            <div className="ml-auto text-xs font-semibold border border-black px-2 py-0.5">
              {coach.intake_mode === "instant_join" ? "Instant join" : "Application required"}
            </div>
          </div>
        </Link>

      </div>
    </div>
  );
}
