import { Header } from "@/components/layout/Header";
import { CoachCard } from "@/components/ui/CoachCard";
import { FilterPill } from "@/components/ui/FilterPill";
import { EmptyState } from "@/components/ui/EmptyState";
import { MOCK_COACHES } from "@/lib/mock/coaches";

const EVENT_FILTERS = [
  { key: "shot_put", label: "Shot Put" },
  { key: "discus", label: "Discus" },
  { key: "hammer", label: "Hammer" },
  { key: "javelin", label: "Javelin" },
];

const OFFER_FILTERS = [
  { key: "remote", label: "Remote" },
  { key: "in_person", label: "In-Person" },
  { key: "video_only", label: "Video Review" },
];

const INTAKE_FILTERS = [
  { key: "instant_join", label: "Instant Join" },
  { key: "application_required", label: "Apply" },
];

const AVAILABILITY_FILTERS = [
  { key: "open", label: "Open Now" },
  { key: "limited", label: "Limited" },
];

export default function MarketplacePage() {
  const coaches = MOCK_COACHES;

  return (
    <div className="min-h-screen bg-[#D7D7D7]">
      <Header />

      {/* Hero */}
      <div className="border-b-2 border-black bg-[#D7D7D7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="max-w-2xl">
            <h1
              className="text-6xl sm:text-7xl tracking-tight leading-none mb-4"
              style={{ fontFamily: "var(--font-anton)" }}
            >
              FIND YOUR
              <br />
              <span className="text-[#007B6F]">THROWS</span>
              <br />
              COACH
            </h1>
            <p className="text-base text-black/70 max-w-md">
              Browse qualified coaches for shot put, discus, hammer, and javelin.
              Real coaching. Real delivery.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b-2 border-black bg-[#D7D7D7] sticky top-14 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-wrap gap-2 items-center">
            <span
              className="text-xs uppercase tracking-widest text-black/40 mr-1"
              style={{ fontFamily: "var(--font-anton)" }}
            >
              Event
            </span>
            {EVENT_FILTERS.map((f) => (
              <FilterPill key={f.key} label={f.label} />
            ))}
            <div className="w-px h-4 bg-black/20 mx-1 hidden sm:block" />
            {OFFER_FILTERS.map((f) => (
              <FilterPill key={f.key} label={f.label} />
            ))}
            <div className="w-px h-4 bg-black/20 mx-1 hidden sm:block" />
            {INTAKE_FILTERS.map((f) => (
              <FilterPill key={f.key} label={f.label} />
            ))}
            <div className="w-px h-4 bg-black/20 mx-1 hidden sm:block" />
            {AVAILABILITY_FILTERS.map((f) => (
              <FilterPill key={f.key} label={f.label} />
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-black/60">
            <span className="font-semibold text-black">{coaches.length} coaches</span> available
          </p>
          <p className="text-xs text-black/40 uppercase tracking-wider">
            Sorted by availability
          </p>
        </div>

        {coaches.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coaches.map((coach) => (
              <CoachCard key={coach.id} coach={coach} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No coaches found"
            description="Try adjusting your filters to find coaches that match what you're looking for."
            ctaLabel="Clear filters"
          />
        )}
      </div>

      {/* Footer */}
      <footer className="border-t-2 border-black mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span
            className="text-xl tracking-tight"
            style={{ fontFamily: "var(--font-anton)" }}
          >
            SHOTSPOT
          </span>
          <p className="text-xs text-black/40">
            The throws coaching marketplace. Shot put, discus, hammer, javelin.
          </p>
        </div>
      </footer>
    </div>
  );
}
