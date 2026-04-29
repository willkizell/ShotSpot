"use client";

import { useState } from "react";
import { CoachCard } from "@/components/ui/CoachCard";
import { FeaturedCoachCard } from "@/components/ui/FeaturedCoachCard";
import { FilterPill } from "@/components/ui/FilterPill";
import { EmptyState } from "@/components/ui/EmptyState";
import type { CoachCardData } from "@/components/ui/CoachCard";

const EVENT_FILTERS = [
  { key: "shot_put", label: "Shot Put" },
  { key: "discus", label: "Discus" },
  { key: "hammer", label: "Hammer" },
  { key: "javelin", label: "Javelin" },
];

const OFFER_FILTERS = [
  { key: "remote", label: "Remote" },
  { key: "in_person", label: "In-Person" },
];

const INTAKE_FILTERS = [
  { key: "instant_join", label: "Instant Join" },
  { key: "application_required", label: "Apply" },
];

const AVAILABILITY_FILTERS = [
  { key: "open", label: "Open Now" },
  { key: "limited", label: "Limited" },
];

type ActiveFilters = {
  events: string[];
  offer: string[];
  intake: string[];
  availability: string[];
};

function filterCoaches(coaches: CoachCardData[], filters: ActiveFilters): CoachCardData[] {
  return coaches.filter((coach) => {
    if (filters.events.length > 0 && !filters.events.some((e) => coach.events.includes(e)))
      return false;
    if (filters.offer.includes("remote") && !coach.remote) return false;
    if (filters.offer.includes("in_person") && coach.remote) return false;
    if (filters.intake.length > 0 && !filters.intake.includes(coach.intake_mode)) return false;
    if (
      filters.availability.length > 0 &&
      !filters.availability.includes(coach.availability)
    )
      return false;
    return true;
  });
}

function toggle(arr: string[], key: string): string[] {
  return arr.includes(key) ? arr.filter((k) => k !== key) : [...arr, key];
}

interface MarketplaceContentProps {
  coaches: CoachCardData[];
  featuredCoach: CoachCardData;
}

export function MarketplaceContent({ coaches, featuredCoach }: MarketplaceContentProps) {
  const [filters, setFilters] = useState<ActiveFilters>({
    events: [],
    offer: [],
    intake: [],
    availability: [],
  });

  const filtered = filterCoaches(coaches, filters);
  const hasFilters = Object.values(filters).some((arr) => arr.length > 0);

  return (
    <>
      {/* Filters */}
      <div className="border-b-2 border-black bg-[#D7D7D7] sticky top-14 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-wrap gap-2 items-center">
            <span
              className="text-xs uppercase tracking-widest text-black/40 mr-1 hidden sm:block"
              style={{ fontFamily: "var(--font-anton)" }}
            >
              Event
            </span>
            {EVENT_FILTERS.map((f) => (
              <FilterPill
                key={f.key}
                label={f.label}
                active={filters.events.includes(f.key)}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, events: toggle(prev.events, f.key) }))
                }
              />
            ))}
            <div className="w-px h-4 bg-black/20 mx-1 hidden sm:block" />
            {OFFER_FILTERS.map((f) => (
              <FilterPill
                key={f.key}
                label={f.label}
                active={filters.offer.includes(f.key)}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, offer: toggle(prev.offer, f.key) }))
                }
              />
            ))}
            <div className="w-px h-4 bg-black/20 mx-1 hidden sm:block" />
            {INTAKE_FILTERS.map((f) => (
              <FilterPill
                key={f.key}
                label={f.label}
                active={filters.intake.includes(f.key)}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, intake: toggle(prev.intake, f.key) }))
                }
              />
            ))}
            <div className="w-px h-4 bg-black/20 mx-1 hidden sm:block" />
            {AVAILABILITY_FILTERS.map((f) => (
              <FilterPill
                key={f.key}
                label={f.label}
                active={filters.availability.includes(f.key)}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    availability: toggle(prev.availability, f.key),
                  }))
                }
              />
            ))}
            {hasFilters && (
              <>
                <div className="w-px h-4 bg-black/20 mx-1" />
                <button
                  onClick={() =>
                    setFilters({ events: [], offer: [], intake: [], availability: [] })
                  }
                  className="text-xs text-black/50 hover:text-black underline underline-offset-2 transition-colors"
                >
                  Clear all
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Featured placement — hidden when filters are active */}
        {!hasFilters && <FeaturedCoachCard coach={featuredCoach} />}

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-black/60">
            <span className="font-semibold text-black">{filtered.length} coaches</span> available
            {hasFilters && " matching filters"}
          </p>
          <p className="text-xs text-black/40 uppercase tracking-wider hidden sm:block">
            Sorted by availability
          </p>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((coach) => (
              <CoachCard key={coach.id} coach={coach} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No coaches found"
            description="Try adjusting your filters to find coaches that match what you're looking for."
            ctaLabel="Clear filters"
            onCta={() => setFilters({ events: [], offer: [], intake: [], availability: [] })}
          />
        )}
      </div>
    </>
  );
}
