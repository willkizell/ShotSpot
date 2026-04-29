import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Header } from "@/components/layout/Header";
import { MOCK_COACH_PROFILES } from "@/lib/mock/coachProfiles";
import { MOCK_COACHES } from "@/lib/mock/coaches";
import type { CoachProfileData } from "@/lib/types/coach";

const EVENT_LABELS: Record<string, string> = {
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
  open:     { label: "Open",          color: "text-[#007B6F]", bg: "bg-[#007B6F]" },
  limited:  { label: "Limited spots", color: "text-amber-700", bg: "bg-amber-600" },
  waitlist: { label: "Waitlist",      color: "text-black/50",  bg: "bg-black/40"  },
  closed:   { label: "Closed",        color: "text-red-600",   bg: "bg-red-600"   },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center px-5 py-3 border-r border-black/10 last:border-0">
      <span className="text-lg font-bold leading-none">{value}</span>
      <span className="text-xs text-black/50 mt-1 uppercase tracking-wide">{label}</span>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-sm uppercase tracking-widest text-black/40 mb-4"
      style={{ fontFamily: "var(--font-anton)" }}
    >
      {children}
    </h2>
  );
}

function CoachingHistorySection({ coach }: { coach: CoachProfileData }) {
  if (!coach.coaching_history?.length) return null;
  return (
    <section>
      <SectionHeading>Coaching History</SectionHeading>
      <div className="space-y-5">
        {coach.coaching_history.map((entry, i) => (
          <div key={i} className="flex gap-4">
            {/* Timeline dot + line */}
            <div className="flex flex-col items-center pt-1">
              <div className="w-2.5 h-2.5 rounded-full bg-[#007B6F] flex-shrink-0" />
              {i < coach.coaching_history.length - 1 && (
                <div className="w-px flex-1 bg-black/10 mt-1" />
              )}
            </div>
            <div className="pb-5">
              <p className="font-bold text-sm leading-tight">{entry.role}</p>
              <p className="text-sm text-[#007B6F] font-medium mt-0.5">{entry.organization}</p>
              <p className="text-xs text-black/40 mt-0.5">
                {entry.start_year} – {entry.end_year ?? "Present"}
              </p>
              <p className="text-sm text-black/70 mt-2 leading-relaxed">{entry.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ReviewsPlaceholder() {
  return (
    <section>
      <SectionHeading>Reviews</SectionHeading>
      <div className="border-2 border-dashed border-black/20 p-8 text-center">
        <p className="text-sm text-black/40">
          Reviews will appear here once athletes complete their first coaching cycle.
        </p>
      </div>
    </section>
  );
}

// ─── CTA card (sticky sidebar) ────────────────────────────────────────────────

function CTACard({ coach }: { coach: CoachProfileData }) {
  const avail = AVAILABILITY_CONFIG[coach.availability];
  const spotsLeft = coach.athlete_capacity - coach.athlete_count;

  return (
    <div className="border-2 border-black bg-[#D7D7D7] p-6 flex flex-col gap-5">
      {/* Price */}
      <div className="border-b border-black/10 pb-5">
        <p className="text-xs uppercase tracking-widest text-black/40 mb-1"
          style={{ fontFamily: "var(--font-anton)" }}>Starting at</p>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold leading-none">${coach.starting_price}</span>
          <span className="text-black/50 text-sm">{CADENCE_LABELS[coach.billing_cadence ?? "monthly"]}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-3 text-sm border-b border-black/10 pb-5">
        <div className="flex items-center justify-between">
          <span className="text-black/50">Availability</span>
          <span className={`font-semibold ${avail.color}`}>{avail.label}</span>
        </div>
        {spotsLeft > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-black/50">Spots left</span>
            <span className="font-semibold">{spotsLeft}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-black/50">Response time</span>
          <span className="font-semibold">{coach.response_time}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-black/50">Active athletes</span>
          <span className="font-semibold">{coach.athlete_count}</span>
        </div>
      </div>

      {/* Primary CTA */}
      {coach.intake_mode === "application_required" ? (
        <Link
          href={`/coaches/${coach.id}/apply`}
          className="w-full bg-black text-[#D7D7D7] px-6 py-3.5 text-sm font-semibold text-center hover:bg-[#007B6F] transition-colors"
        >
          Apply to Work With {coach.full_name.split(" ")[0]}
        </Link>
      ) : (
        <Link
          href={`/coaches/${coach.id}/join`}
          className="w-full bg-black text-[#D7D7D7] px-6 py-3.5 text-sm font-semibold text-center hover:bg-[#007B6F] transition-colors"
        >
          Join Now — ${coach.starting_price}{CADENCE_LABELS[coach.billing_cadence ?? "monthly"]}
        </Link>
      )}

      {/* Secondary: message */}
      <Link
        href={`/coaches/${coach.id}/message`}
        className="w-full border-2 border-black px-6 py-3 text-sm font-semibold text-center hover:bg-black hover:text-[#D7D7D7] transition-colors"
      >
        Send a Message
      </Link>

      <p className="text-xs text-black/40 text-center leading-relaxed">
        {coach.intake_mode === "application_required"
          ? "Coach reviews all applications. You won't be charged until accepted."
          : "Cancel anytime. You'll get access immediately after payment."}
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CoachProfilePage({ params }: PageProps) {
  const { id } = await params;

  // Try rich profile first, fall back to basic card data
  const profile: CoachProfileData | undefined =
    MOCK_COACH_PROFILES[id] ??
    (MOCK_COACHES.find((c) => c.id === id)
      ? { ...MOCK_COACHES.find((c) => c.id === id)!, full_bio: MOCK_COACHES.find((c) => c.id === id)!.headline, coaching_history: [] }
      : undefined);

  if (!profile) notFound();

  const avail = AVAILABILITY_CONFIG[profile.availability];

  return (
    <div className="min-h-screen bg-[#D7D7D7]">
      <Header />

      {/* ── Banner ── */}
      <div className="relative">
        <div
          className="w-full h-56 sm:h-72"
          style={{
            background: profile.banner_url
              ? `url(${profile.banner_url}) center/cover no-repeat`
              : "linear-gradient(135deg, #007B6F 0%, #004d46 50%, #000000 100%)",
          }}
        />
      </div>

      {/* ── Profile header ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 -mt-12 sm:-mt-16 mb-8">
          {/* Avatar + name */}
          <div className="flex items-end gap-5">
            <div className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-[#D7D7D7] overflow-hidden flex-shrink-0 bg-black">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-[#D7D7D7] text-4xl"
                  style={{ fontFamily: "var(--font-anton)" }}
                >
                  {profile.full_name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
              )}
            </div>
            <div className="pb-1">
              <div className="flex items-center gap-2 mb-1">
                {profile.is_featured && (
                  <span
                    className="text-[10px] uppercase tracking-widest text-[#007B6F]"
                    style={{ fontFamily: "var(--font-anton)" }}
                  >
                    ● Featured
                  </span>
                )}
              </div>
              <h1
                className="text-2xl sm:text-3xl font-bold leading-tight"
                style={{ fontFamily: "var(--font-anton)" }}
              >
                {profile.full_name}
              </h1>
              {profile.organization && (
                <p className="text-sm text-black/60 mt-0.5">{profile.organization}</p>
              )}
              <p className="text-sm text-black/50 mt-0.5">
                {profile.remote ? "Remote" : profile.location}
                {profile.remote && profile.location ? ` · ${profile.location}` : ""}
              </p>
            </div>
          </div>

          {/* Availability pill — top right on desktop */}
          <div className={`hidden lg:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white ${avail.bg}`}>
            <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
            {avail.label}
          </div>
        </div>

        {/* Events + proof tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {profile.events.map((e) => (
            <Badge key={e} variant="event">{EVENT_LABELS[e] ?? e}</Badge>
          ))}
          {profile.has_elite_athletes && <Badge variant="accent">Elite athletes</Badge>}
          {profile.proof_tags.map((tag) => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>

        {/* Stats strip */}
        <div className="border-2 border-black bg-[#D7D7D7] flex flex-wrap mb-10">
          <StatPill label="Years Coaching" value={`${profile.years_coaching}`} />
          <StatPill label="Active Athletes" value={`${profile.athlete_count}/${profile.athlete_capacity}`} />
          <StatPill label="Response Time" value={profile.response_time} />
          <StatPill
            label="Spots Left"
            value={
              profile.athlete_capacity - profile.athlete_count > 0
                ? `${profile.athlete_capacity - profile.athlete_count}`
                : "0"
            }
          />
          <StatPill
            label="Enrollment"
            value={profile.intake_mode === "instant_join" ? "Instant" : "Application"}
          />
        </div>

        {/* ── Two column: content + sidebar ── */}
        <div className="flex flex-col lg:flex-row gap-10 pb-16">
          {/* Left: main content */}
          <div className="flex-1 min-w-0 space-y-10">
            {/* About */}
            <section>
              <SectionHeading>About</SectionHeading>
              <p className="text-base text-black/80 leading-relaxed whitespace-pre-line">
                {profile.full_bio}
              </p>
            </section>

            {/* Coaching history */}
            <CoachingHistorySection coach={profile} />

            {/* Reviews */}
            <ReviewsPlaceholder />
          </div>

          {/* Right: sticky CTA */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-20">
              <CTACard coach={profile} />

              {/* Back to marketplace */}
              <Link
                href="/#coaches"
                className="mt-4 flex items-center gap-2 text-xs text-black/40 hover:text-black transition-colors"
              >
                ← Back to all coaches
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
