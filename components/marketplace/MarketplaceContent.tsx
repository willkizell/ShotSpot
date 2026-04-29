"use client";

import { useState } from "react";
import { CoachCard, FeaturedGridCard } from "@/components/ui/CoachCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { CoachCardData } from "@/components/ui/CoachCard";

const EVENTS = [
  { key: "shot_put", label: "Shot Put" },
  { key: "discus", label: "Discus" },
  { key: "hammer", label: "Hammer" },
  { key: "javelin", label: "Javelin" },
];

const MAX_PRICE_CEILING = 1000;

type Filters = {
  search: string;
  maxPrice: number;
  events: string[];
  remote: boolean | null;
  intake: string[];
  availability: string[];
};

const DEFAULT_FILTERS: Filters = {
  search: "",
  maxPrice: MAX_PRICE_CEILING,
  events: [],
  remote: null,
  intake: [],
  availability: [],
};

function filterCoaches(coaches: CoachCardData[], filters: Filters): CoachCardData[] {
  return coaches.filter((c) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matches =
        c.full_name.toLowerCase().includes(q) ||
        c.headline.toLowerCase().includes(q) ||
        (c.organization?.toLowerCase().includes(q) ?? false) ||
        c.events.some((e) => e.replace("_", " ").includes(q));
      if (!matches) return false;
    }
    if (c.starting_price > filters.maxPrice) return false;
    if (filters.events.length > 0 && !filters.events.some((e) => c.events.includes(e))) return false;
    if (filters.remote === true && !c.remote) return false;
    if (filters.remote === false && c.remote) return false;
    if (filters.intake.length > 0 && !filters.intake.includes(c.intake_mode)) return false;
    if (filters.availability.length > 0 && !filters.availability.includes(c.availability)) return false;
    return true;
  });
}

function sortCoaches(coaches: CoachCardData[]): CoachCardData[] {
  return [...coaches].sort((a, b) => {
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;
    const order = { open: 0, limited: 1, waitlist: 2, closed: 3 };
    return order[a.availability] - order[b.availability];
  });
}

function hasActiveFilters(f: Filters): boolean {
  return (
    f.search !== "" ||
    f.maxPrice < MAX_PRICE_CEILING ||
    f.events.length > 0 ||
    f.remote !== null ||
    f.intake.length > 0 ||
    f.availability.length > 0
  );
}

function toggleArr(arr: string[], key: string): string[] {
  return arr.includes(key) ? arr.filter((k) => k !== key) : [...arr, key];
}

// ─── Sidebar primitives ───────────────────────────────────────────────────────

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-black/10 pb-5 mb-5 last:border-0 last:mb-0 last:pb-0">
      <h3
        className="text-[10px] uppercase tracking-widest text-black/40 mb-3"
        style={{ fontFamily: "var(--font-anton)" }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function CheckItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group mb-2.5 last:mb-0">
      <button
        type="button"
        onClick={onChange}
        className={`w-4 h-4 border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
          checked ? "bg-black border-black" : "border-black/25 group-hover:border-black"
        }`}
      >
        {checked && (
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
            <path
              d="M1 3L3 5L7 1"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
      <span className="text-sm text-black/70 group-hover:text-black transition-colors select-none">
        {label}
      </span>
    </label>
  );
}

function RadioItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group mb-2.5 last:mb-0">
      <button
        type="button"
        onClick={onChange}
        className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
          checked ? "border-black" : "border-black/25 group-hover:border-black"
        }`}
      >
        {checked && <div className="w-2 h-2 rounded-full bg-black" />}
      </button>
      <span className="text-sm text-black/70 group-hover:text-black transition-colors select-none">
        {label}
      </span>
    </label>
  );
}

// ─── Event quick-pills ────────────────────────────────────────────────────────

function EventPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-10 px-4 text-xs font-semibold border-2 border-black transition-colors whitespace-nowrap ${
        active ? "bg-black text-[#D7D7D7]" : "bg-transparent text-black hover:bg-black/5"
      }`}
    >
      {label}
    </button>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function FilterSidebar({
  filters,
  onChange,
  onReset,
}: {
  filters: Filters;
  onChange: (f: Partial<Filters>) => void;
  onReset: () => void;
}) {
  const active = hasActiveFilters(filters);

  return (
    <aside className="w-56 flex-shrink-0">
      <div className="sticky top-[calc(3.5rem+1px)] pt-8">
        <div className="flex items-center justify-between mb-5">
          <span
            className="text-sm font-bold"
            style={{ fontFamily: "var(--font-anton)" }}
          >
            FILTERS
          </span>
          {active && (
            <button
              type="button"
              onClick={onReset}
              className="text-xs text-black/40 hover:text-black underline underline-offset-2 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Price */}
        <SidebarSection title="Max Price">
          <div className="flex items-center justify-between text-xs text-black/50 mb-2">
            <span>$0</span>
            <span className="font-semibold text-black">
              {filters.maxPrice >= MAX_PRICE_CEILING ? "Any" : `$${filters.maxPrice}/mo`}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={MAX_PRICE_CEILING}
            step={25}
            value={filters.maxPrice}
            onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
            className="w-full accent-black h-1 cursor-pointer"
          />
          <div className="flex items-center justify-between text-[10px] text-black/30 mt-1">
            <span>$0</span>
            <span>$1000+</span>
          </div>
        </SidebarSection>

        {/* Events */}
        <SidebarSection title="Event">
          {EVENTS.map((e) => (
            <CheckItem
              key={e.key}
              label={e.label}
              checked={filters.events.includes(e.key)}
              onChange={() => onChange({ events: toggleArr(filters.events, e.key) })}
            />
          ))}
        </SidebarSection>

        {/* Format */}
        <SidebarSection title="Coaching Format">
          <RadioItem
            label="Any"
            checked={filters.remote === null}
            onChange={() => onChange({ remote: null })}
          />
          <RadioItem
            label="Remote"
            checked={filters.remote === true}
            onChange={() => onChange({ remote: true })}
          />
          <RadioItem
            label="In-Person"
            checked={filters.remote === false}
            onChange={() => onChange({ remote: false })}
          />
        </SidebarSection>

        {/* Intake */}
        <SidebarSection title="Enrollment">
          <CheckItem
            label="Instant Join"
            checked={filters.intake.includes("instant_join")}
            onChange={() => onChange({ intake: toggleArr(filters.intake, "instant_join") })}
          />
          <CheckItem
            label="Application Required"
            checked={filters.intake.includes("application_required")}
            onChange={() => onChange({ intake: toggleArr(filters.intake, "application_required") })}
          />
        </SidebarSection>

        {/* Availability */}
        <SidebarSection title="Availability">
          <CheckItem
            label="Open Now"
            checked={filters.availability.includes("open")}
            onChange={() => onChange({ availability: toggleArr(filters.availability, "open") })}
          />
          <CheckItem
            label="Limited Spots"
            checked={filters.availability.includes("limited")}
            onChange={() => onChange({ availability: toggleArr(filters.availability, "limited") })}
          />
          <CheckItem
            label="Waitlist"
            checked={filters.availability.includes("waitlist")}
            onChange={() => onChange({ availability: toggleArr(filters.availability, "waitlist") })}
          />
        </SidebarSection>

        {/* Location stub */}
        <SidebarSection title="Location">
          <p className="text-xs text-black/40 leading-relaxed">
            In-person distance filtering coming soon — coaches will set their training location and
            you&apos;ll be able to filter by drive distance.
          </p>
        </SidebarSection>
      </div>
    </aside>
  );
}

// ─── Mobile filter drawer ─────────────────────────────────────────────────────

function MobileFilterDrawer({
  open,
  filters,
  onChange,
  onReset,
  onClose,
}: {
  open: boolean;
  filters: Filters;
  onChange: (f: Partial<Filters>) => void;
  onReset: () => void;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        onClick={onClose}
      />
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#D7D7D7] border-t-2 border-black max-h-[85vh] overflow-y-auto lg:hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/10 sticky top-0 bg-[#D7D7D7]">
          <span className="font-bold" style={{ fontFamily: "var(--font-anton)" }}>FILTERS</span>
          <div className="flex items-center gap-4">
            {hasActiveFilters(filters) && (
              <button
                type="button"
                onClick={onReset}
                className="text-sm text-black/50 underline underline-offset-2"
              >
                Clear all
              </button>
            )}
            <button type="button" onClick={onClose} className="text-sm font-semibold">
              Done
            </button>
          </div>
        </div>
        <div className="px-5 py-5">
          <FilterSidebar filters={filters} onChange={onChange} onReset={onReset} />
        </div>
      </div>
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface MarketplaceContentProps {
  coaches: CoachCardData[];
}

export function MarketplaceContent({ coaches }: MarketplaceContentProps) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const updateFilters = (patch: Partial<Filters>) =>
    setFilters((prev) => ({ ...prev, ...patch }));
  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const filtered = sortCoaches(filterCoaches(coaches, filters));
  const active = hasActiveFilters(filters);

  return (
    <>
      {/* ── Sticky top bar ── */}
      <div className="border-b-2 border-black bg-[#D7D7D7] sticky top-14 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30 pointer-events-none"
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
            >
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search coaches…"
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="w-full h-10 pl-8 pr-3 text-sm bg-transparent border-2 border-black outline-none placeholder:text-black/30"
            />
          </div>

          {/* Event quick-pills (desktop) */}
          <div className="hidden lg:flex items-center gap-1.5">
            {EVENTS.map((e) => (
              <EventPill
                key={e.key}
                label={e.label}
                active={filters.events.includes(e.key)}
                onClick={() => updateFilters({ events: toggleArr(filters.events, e.key) })}
              />
            ))}
          </div>

          {/* Mobile filters button */}
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className={`lg:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-2 transition-colors ${
              active ? "bg-black text-[#D7D7D7] border-black" : "border-black"
            }`}
          >
            <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
              <path d="M0 1.5H12M2 5H10M4 8.5H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Filters{active ? " •" : ""}
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-10">
        {/* Sidebar (desktop) */}
        <div className="hidden lg:block">
          <FilterSidebar filters={filters} onChange={updateFilters} onReset={resetFilters} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 py-8">
          {/* Result meta */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-black/60">
              <span className="font-semibold text-black">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "coach" : "coaches"}
              {active ? " matching filters" : " available"}
            </p>
            <p className="text-xs text-black/40 uppercase tracking-wider hidden sm:block">
              Featured · Open · Limited
            </p>
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((coach) =>
                coach.is_featured ? (
                  <div key={coach.id} className="sm:col-span-2">
                    <FeaturedGridCard coach={coach} />
                  </div>
                ) : (
                  <CoachCard key={coach.id} coach={coach} />
                )
              )}
            </div>
          ) : (
            <EmptyState
              title="No coaches found"
              description="Try adjusting your filters or search terms."
              ctaLabel="Clear filters"
              onCta={resetFilters}
            />
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <MobileFilterDrawer
        open={mobileFiltersOpen}
        filters={filters}
        onChange={updateFilters}
        onReset={resetFilters}
        onClose={() => setMobileFiltersOpen(false)}
      />
    </>
  );
}
