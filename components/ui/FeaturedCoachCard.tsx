import Link from "next/link";
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

function PhotoBlock({ name, src }: { name: string; src?: string | null }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (src) {
    return (
      <div className="w-48 flex-shrink-0 self-stretch hidden sm:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className="w-48 flex-shrink-0 self-stretch bg-black text-[#D7D7D7] items-center justify-center text-5xl hidden sm:flex"
      style={{ fontFamily: "var(--font-anton)" }}
    >
      {initials}
    </div>
  );
}

export function FeaturedCoachCard({ coach }: { coach: CoachCardData }) {
  return (
    <div className="border-2 border-[#007B6F] mb-8 overflow-hidden">
      {/* Label bar */}
      <div className="flex items-center gap-2 px-5 py-2 bg-[#007B6F]">
        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        <span
          className="text-xs text-white tracking-widest uppercase"
          style={{ fontFamily: "var(--font-anton)" }}
        >
          Featured Coach
        </span>
      </div>

      {/* Body — three panels */}
      <div className="flex min-h-[220px]">
        {/* Panel 1: Large square photo */}
        <PhotoBlock name={coach.full_name} src={coach.avatar_url} />

        {/* Panel 2: Coach info */}
        <Link
          href={`/coaches/${coach.id}`}
          className="flex-1 p-6 flex flex-col justify-between hover:bg-black/[0.02] transition-colors group"
        >
          <div>
            <div className="flex items-start justify-between gap-4 mb-1">
              <h2 className="text-2xl font-bold leading-tight group-hover:text-[#007B6F] transition-colors">
                {coach.full_name}
              </h2>
              <div className="text-right flex-shrink-0">
                <span className="text-2xl font-bold">From ${coach.starting_price}</span>
                <span className="text-sm text-black/50 ml-1">
                  {CADENCE_LABELS[coach.billing_cadence]}
                </span>
              </div>
            </div>
            {coach.organization && (
              <p className="text-sm font-medium text-black/70 mb-0.5">{coach.organization}</p>
            )}
            <p className="text-sm text-black/50 mb-4">
              {coach.remote ? "Remote" : coach.location}
              {coach.remote && coach.location ? ` · ${coach.location}` : ""}
              {" · "}{coach.years_coaching} years coaching
            </p>
            <p className="text-sm text-black/80 leading-relaxed mb-4 max-w-lg">
              {coach.headline}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {coach.events.map((e) => (
                <Badge key={e} variant="event">{EVENT_LABELS[e] ?? e}</Badge>
              ))}
              {coach.has_elite_athletes && <Badge variant="accent">Elite athletes</Badge>}
              {coach.proof_tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
            <div className="flex items-center gap-4 text-xs text-black/40">
              <span>{coach.response_time} response</span>
              <span>{coach.athlete_capacity - coach.athlete_count} spots left</span>
            </div>
          </div>
        </Link>

        {/* Panel 3: Paywall CTA */}
        <div className="w-52 flex-shrink-0 border-l-2 border-[#007B6F] flex flex-col items-center justify-center gap-4 p-6 bg-[#007B6F]/5 hidden lg:flex">
          <div className="text-center">
            <p
              className="text-xs uppercase tracking-widest text-[#007B6F] mb-2"
              style={{ fontFamily: "var(--font-anton)" }}
            >
              Want this spot?
            </p>
            <p className="text-sm font-bold leading-tight mb-1">
              Become a Featured Coach
            </p>
            <p className="text-xs text-black/50 leading-snug">
              Get premium placement above every search result on ShotSpot.
            </p>
          </div>
          <Link
            href="/coach-signup"
            className="w-full border-2 border-[#007B6F] text-[#007B6F] px-4 py-2 text-xs font-bold text-center hover:bg-[#007B6F] hover:text-white transition-colors tracking-wide"
          >
            Learn more →
          </Link>
        </div>
      </div>
    </div>
  );
}
