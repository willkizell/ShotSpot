"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { submitCoachProfile, type OnboardingData } from "@/lib/coach/actions";
import type { CoachingHistoryEntry, CoachPackage, CoachLink } from "@/lib/types/coach";

// ─── Constants ────────────────────────────────────────────────────────────────

const EVENTS = [
  { key: "shot_put", label: "Shot Put" },
  { key: "discus",   label: "Discus" },
  { key: "hammer",   label: "Hammer" },
  { key: "javelin",  label: "Javelin" },
];

const PREDEFINED_LINKS = [
  { label: "Instagram",        placeholder: "https://instagram.com/yourhandle" },
  { label: "LinkedIn",         placeholder: "https://linkedin.com/in/yourname" },
  { label: "Coaching profile", placeholder: "USATF page, athletic.net, personal site…" },
];
const PREDEFINED_LABELS = PREDEFINED_LINKS.map((p) => p.label);

const INCLUDE_OPTIONS = [
  "Video analysis & feedback",
  "Training plan",
  "Lifting / strength plan",
  "Weekly check-in call",
  "Unlimited messaging",
  "Competition prep",
  "Technique drills",
  "Nutrition guidance",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function newPackage(): CoachPackage {
  return {
    id: Math.random().toString(36).slice(2),
    name: "",
    description: "",
    price: 0,
    billing_cadence: "monthly",
    includes: [],
  };
}

async function uploadImage(bucket: string, file: File, userId: string): Promise<string | null> {
  const supabase = createClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const slug = bucket === "coach-avatars" ? "avatar" : "banner";
  const path = `${userId}/${slug}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
  if (error) { console.error("Upload error:", error); return null; }
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

// ─── UI Primitives ────────────────────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1.5" style={{ fontFamily: "var(--font-anton)" }}>
      {children}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full border-2 border-black bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#007B6F] ${props.className ?? ""}`}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full border-2 border-black bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#007B6F] resize-none ${props.className ?? ""}`}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full border-2 border-black bg-[#D7D7D7] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#007B6F] ${props.className ?? ""}`}
    />
  );
}

// ─── Sidebar Section ──────────────────────────────────────────────────────────

function SidebarSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b-2 border-black">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-black/[0.03] transition-colors"
      >
        <span className="text-sm font-bold tracking-widest uppercase" style={{ fontFamily: "var(--font-anton)" }}>
          {title}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={`transition-transform duration-200 text-black/30 ${open ? "rotate-180" : ""}`}
        >
          <path d="M1 3l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && <div className="px-6 pb-6 space-y-4">{children}</div>}
    </div>
  );
}

// ─── Image Upload Button ──────────────────────────────────────────────────────

function ImageUploadButton({
  label,
  hint,
  previewUrl,
  aspect,
  onFile,
  uploading,
}: {
  label: string;
  hint: string;
  previewUrl: string | null;
  aspect: "square" | "banner";
  onFile: (file: File) => void;
  uploading: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className={aspect === "square" ? "flex-shrink-0" : "flex-1"}>
      <FieldLabel>{label}</FieldLabel>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed border-black/30 hover:border-black transition-colors overflow-hidden flex items-center justify-center bg-black/[0.02] ${
          aspect === "banner" ? "w-full h-20" : "w-20 h-20"
        }`}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="" className="w-full h-full object-cover absolute inset-0" />
        ) : uploading ? (
          <span className="text-[10px] text-black/40">Uploading…</span>
        ) : (
          <span className="text-[10px] text-black/40 text-center px-2 leading-tight">{hint}</span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

// ─── Links Section ────────────────────────────────────────────────────────────

function LinksSection({ links, onChange }: { links: CoachLink[]; onChange: (links: CoachLink[]) => void }) {
  const getUrl = (label: string) => links.find((l) => l.label === label)?.url ?? "";
  const setUrl = (label: string, url: string) => {
    const exists = links.some((l) => l.label === label);
    onChange(exists ? links.map((l) => (l.label === label ? { ...l, url } : l)) : [...links, { label, url }]);
  };
  const customLinks = links.filter((l) => !PREDEFINED_LABELS.includes(l.label));
  const addCustom = () => onChange([...links, { label: "", url: "" }]);
  const updateCustom = (i: number, patch: Partial<CoachLink>) => {
    const updated = customLinks.map((l, idx) => (idx === i ? { ...l, ...patch } : l));
    onChange([...links.filter((l) => PREDEFINED_LABELS.includes(l.label)), ...updated]);
  };
  const removeCustom = (i: number) => {
    onChange([...links.filter((l) => PREDEFINED_LABELS.includes(l.label)), ...customLinks.filter((_, idx) => idx !== i)]);
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-black/40">All optional — appear on your profile.</p>
      {PREDEFINED_LINKS.map(({ label, placeholder }) => (
        <div key={label}>
          <p className="text-xs text-black/50 mb-1">{label}</p>
          <Input type="url" value={getUrl(label)} onChange={(e) => setUrl(label, e.target.value)} placeholder={placeholder} />
        </div>
      ))}
      {customLinks.map((link, i) => (
        <div key={i} className="flex gap-2">
          <Input value={link.label} onChange={(e) => updateCustom(i, { label: e.target.value })} placeholder="Link name" className="w-28 flex-shrink-0" />
          <Input type="url" value={link.url} onChange={(e) => updateCustom(i, { url: e.target.value })} placeholder="https://…" />
          <button type="button" onClick={() => removeCustom(i)} className="text-black/25 hover:text-black text-xl leading-none flex-shrink-0 px-1">×</button>
        </div>
      ))}
      <button type="button" onClick={addCustom} className="text-sm text-[#007B6F] hover:underline">+ Add another link</button>
    </div>
  );
}

// ─── History Entry ────────────────────────────────────────────────────────────

function HistoryEntryForm({
  entry,
  index,
  onChange,
  onRemove,
}: {
  entry: CoachingHistoryEntry;
  index: number;
  onChange: (p: Partial<CoachingHistoryEntry>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-7 h-7 bg-[#007B6F] flex items-center justify-center text-white text-xs font-bold" style={{ fontFamily: "var(--font-anton)" }}>
          {index + 1}
        </div>
        <div className="w-px flex-1 bg-black/10 mt-2" />
      </div>
      <div className="flex-1 pb-6 space-y-2.5">
        <div className="flex items-start gap-2">
          <Input value={entry.role} onChange={(e) => onChange({ role: e.target.value })} placeholder="Role — e.g. Head Throws Coach" className="flex-1 font-semibold" />
          <button type="button" onClick={onRemove} className="mt-2 text-black/25 hover:text-black text-xl leading-none flex-shrink-0">×</button>
        </div>
        <Input value={entry.organization} onChange={(e) => onChange({ organization: e.target.value })} placeholder="Organization — e.g. University of Oregon" />
        <div className="flex items-center gap-2">
          <Input type="number" min={1960} max={new Date().getFullYear()} value={entry.start_year || ""} onChange={(e) => onChange({ start_year: Number(e.target.value) })} placeholder="Start year" className="max-w-[110px]" />
          <span className="text-black/30 font-medium">—</span>
          <Input type="number" min={1960} max={new Date().getFullYear()} value={entry.end_year ?? ""} onChange={(e) => onChange({ end_year: e.target.value ? Number(e.target.value) : null })} placeholder="End (blank = now)" />
        </div>
        <Textarea rows={2} maxLength={200} value={entry.description} onChange={(e) => onChange({ description: e.target.value })} placeholder="Key achievements or responsibilities (optional)" />
      </div>
    </div>
  );
}

// ─── Package Editor ───────────────────────────────────────────────────────────

function PackageEditorSection({ data, onChange }: { data: OnboardingData; onChange: (p: Partial<OnboardingData>) => void }) {
  const [activeIdx, setActiveIdx] = useState(0);

  const addPkg = () => {
    const updated = [...data.packages, newPackage()];
    onChange({ packages: updated });
    setActiveIdx(updated.length - 1);
  };
  const updatePkg = (i: number, patch: Partial<CoachPackage>) =>
    onChange({ packages: data.packages.map((p, idx) => (idx === i ? { ...p, ...patch } : p)) });
  const removePkg = (i: number) => {
    const updated = data.packages.filter((_, idx) => idx !== i);
    onChange({ packages: updated });
    setActiveIdx(Math.min(activeIdx, Math.max(0, updated.length - 1)));
  };

  const active = data.packages[activeIdx] ?? null;

  return (
    <div className="-mx-6">
      {/* Tab bar */}
      <div className="flex items-center border-t border-b border-black/10 overflow-x-auto">
        {data.packages.map((pkg, i) => (
          <button
            key={pkg.id}
            type="button"
            onClick={() => setActiveIdx(i)}
            className={`px-4 py-2.5 text-xs font-semibold border-r border-black/10 flex-shrink-0 transition-colors ${
              i === activeIdx ? "bg-black text-[#D7D7D7]" : "hover:bg-black/5"
            }`}
          >
            {pkg.name.trim() || `Package ${i + 1}`}
          </button>
        ))}
        <button type="button" onClick={addPkg} className="px-4 py-2.5 text-xs font-semibold text-[#007B6F] hover:bg-[#007B6F]/10 flex-shrink-0 whitespace-nowrap">
          + Add package
        </button>
        {active && data.packages.length > 1 && (
          <button type="button" onClick={() => removePkg(activeIdx)} className="ml-auto px-3 py-2.5 text-xs text-black/25 hover:text-red-500 border-l border-black/10 flex-shrink-0">
            Remove
          </button>
        )}
      </div>

      {data.packages.length === 0 ? (
        <div className="px-6 py-8 text-center">
          <p className="text-xs text-black/30 mb-3">No packages yet</p>
          <button type="button" onClick={addPkg} className="bg-black text-[#D7D7D7] px-5 py-2 text-xs font-semibold hover:bg-[#007B6F] transition-colors">
            + Create first package
          </button>
        </div>
      ) : active ? (
        <div className="px-6 pt-4 space-y-4">
          <Input
            value={active.name}
            onChange={(e) => updatePkg(activeIdx, { name: e.target.value })}
            placeholder='"Basic", "Premium", "Elite"…'
            className="text-sm font-semibold"
          />
          <div>
            <FieldLabel required>Price & billing</FieldLabel>
            <div className="flex gap-2 flex-wrap">
              <div className="flex items-center border-2 border-black focus-within:ring-2 focus-within:ring-[#007B6F]">
                <span className="pl-3 text-sm font-semibold text-black/40">$</span>
                <input
                  type="number"
                  min={0}
                  value={active.price || ""}
                  onChange={(e) => updatePkg(activeIdx, { price: Number(e.target.value) })}
                  placeholder="0"
                  className="w-20 py-2 px-2 text-sm bg-transparent focus:outline-none"
                />
              </div>
              {([{ value: "monthly", label: "Monthly" }, { value: "weekly", label: "Weekly" }, { value: "one_time", label: "One-time" }] as const).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updatePkg(activeIdx, { billing_cadence: opt.value })}
                  className={`px-3 py-2 text-xs font-semibold border-2 transition-colors ${
                    active.billing_cadence === opt.value ? "bg-[#007B6F] border-[#007B6F] text-white" : "border-black/30 hover:border-black"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <FieldLabel>What&apos;s included</FieldLabel>
            <div className="flex flex-wrap gap-1.5">
              {INCLUDE_OPTIONS.map((opt) => {
                const on = active.includes.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => updatePkg(activeIdx, { includes: on ? active.includes.filter((x) => x !== opt) : [...active.includes, opt] })}
                    className={`px-2.5 py-1.5 text-xs font-medium border-2 transition-colors ${
                      on ? "bg-[#007B6F] border-[#007B6F] text-white" : "border-black/20 hover:border-black"
                    }`}
                  >
                    {on ? "✓ " : ""}{opt}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <FieldLabel>Description for athletes</FieldLabel>
            <Textarea
              rows={3}
              value={active.description}
              onChange={(e) => updatePkg(activeIdx, { description: e.target.value })}
              placeholder="What makes this package special?"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ─── Profile Preview ──────────────────────────────────────────────────────────

function MiniPackageCard({ pkg }: { pkg: CoachPackage }) {
  const cadenceLabel: Record<string, string> = { monthly: "/ mo", weekly: "/ wk", one_time: "one-time" };
  return (
    <div className="border-2 border-black p-4 bg-white/50">
      <p className="text-[9px] uppercase tracking-widest text-black/40 mb-1" style={{ fontFamily: "var(--font-anton)" }}>Package</p>
      <p className="text-sm font-bold leading-tight" style={{ fontFamily: "var(--font-anton)" }}>
        {pkg.name || <span className="font-normal italic text-black/25 text-xs">Unnamed</span>}
      </p>
      <p className="text-xl font-bold mt-1.5 tracking-tight">
        {pkg.price > 0 ? `$${pkg.price}` : <span className="text-black/20">$—</span>}
        <span className="text-xs font-normal text-black/40 ml-1">{cadenceLabel[pkg.billing_cadence]}</span>
      </p>
      {pkg.includes.length > 0 && (
        <ul className="mt-2.5 space-y-1.5">
          {pkg.includes.slice(0, 4).map((item) => (
            <li key={item} className="flex items-center gap-1.5 text-xs text-black/70">
              <div className="w-3.5 h-3.5 bg-[#007B6F] flex items-center justify-center flex-shrink-0">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1.5 4l1.5 1.5 3.5-3" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {item}
            </li>
          ))}
          {pkg.includes.length > 4 && <li className="text-xs text-black/30">+{pkg.includes.length - 4} more</li>}
        </ul>
      )}
    </div>
  );
}

function CoachProfilePreview({
  data,
  avatarUrl,
  bannerUrl,
  profileStyle,
}: {
  data: OnboardingData;
  avatarUrl: string | null;
  bannerUrl: string | null;
  profileStyle: "light" | "dark" | "teal";
}) {
  const bannerStyle: React.CSSProperties = bannerUrl
    ? { backgroundImage: `url(${bannerUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
    : {
        backgroundColor:
          profileStyle === "dark" ? "#000000" : profileStyle === "teal" ? "#007B6F" : "#C0C0C0",
      };

  const initials = data.full_name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-[#D7D7D7] border-2 border-black overflow-hidden select-none">
      {/* Banner */}
      <div className="h-36 relative" style={bannerStyle}>
        <div className="absolute -bottom-10 left-6 w-20 h-20 border-4 border-[#D7D7D7] bg-[#B4B4B4] overflow-hidden flex items-center justify-center">
          {avatarUrl ? (
            <img src={avatarUrl} className="w-full h-full object-cover" alt="" />
          ) : (
            <span className="text-xl font-bold text-black/25" style={{ fontFamily: "var(--font-anton)" }}>
              {initials || "?"}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="pt-14 px-6 pb-8 space-y-5">
        {/* Name & meta */}
        <div>
          <h1 className="text-3xl leading-none tracking-tight" style={{ fontFamily: "var(--font-anton)" }}>
            {data.full_name || <span className="text-black/20 text-2xl">YOUR NAME</span>}
          </h1>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5 text-sm text-black/50">
            {data.organization && <span>{data.organization}</span>}
            {data.organization && (data.location || data.remote) && <span>·</span>}
            {data.location && <span>{data.location}</span>}
            {data.remote && (
              <span className="border border-black/20 px-2 py-0.5 text-xs">Remote</span>
            )}
          </div>
          {data.years_coaching > 0 && (
            <p className="text-xs text-black/40 mt-1">{data.years_coaching} years coaching</p>
          )}
        </div>

        {/* Events */}
        {data.events.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.events.map((e) => {
              const ev = EVENTS.find((ev) => ev.key === e);
              return (
                <span key={e} className="border-2 border-black px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                  {ev?.label ?? e}
                </span>
              );
            })}
          </div>
        )}

        {/* Bio */}
        {data.short_bio ? (
          <p className="text-sm text-black/70 leading-relaxed">{data.short_bio}</p>
        ) : (
          <p className="text-sm text-black/20 italic">Your coaching bio will appear here…</p>
        )}

        <div className="h-px bg-black/10" />

        {/* Packages */}
        {data.packages.length > 0 ? (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-3" style={{ fontFamily: "var(--font-anton)" }}>
              Coaching Packages
            </h2>
            <div
              className="grid gap-3"
              style={{ gridTemplateColumns: `repeat(${Math.min(data.packages.length, 2)}, 1fr)` }}
            >
              {data.packages.map((pkg) => (
                <MiniPackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-black/15 p-4 text-center">
            <p className="text-xs text-black/20">Your coaching packages will appear here</p>
          </div>
        )}

        {/* Experience */}
        {data.coaching_history.length > 0 && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-3" style={{ fontFamily: "var(--font-anton)" }}>
              Experience
            </h2>
            <div className="space-y-3">
              {data.coaching_history.map((entry, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-6 h-6 bg-[#007B6F] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5" style={{ fontFamily: "var(--font-anton)" }}>
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{entry.role || "Role"}</p>
                    <p className="text-xs text-black/50">
                      {entry.organization}{entry.organization ? " · " : ""}{entry.start_year}–{entry.end_year ?? "present"}
                    </p>
                    {entry.description && <p className="text-xs text-black/50 mt-0.5">{entry.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        {data.links.filter((l) => l.url.trim()).length > 0 && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2" style={{ fontFamily: "var(--font-anton)" }}>
              Links
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.links.filter((l) => l.url.trim()).map((link, i) => (
                <span key={i} className="border border-black/20 px-3 py-1 text-xs text-black/50">{link.label}</span>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-black/10 pt-3 text-center">
          <p className="text-[10px] text-black/20 uppercase tracking-widest">Preview — not live</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function OnboardingWizard({ initialName, userId }: { initialName: string; userId: string }) {
  const [data, setData] = useState<OnboardingData>({
    full_name: initialName,
    organization: "",
    location: "",
    remote: true,
    events: [],
    years_coaching: 0,
    short_bio: "",
    coaching_history: [],
    links: [],
    intake_mode: "application_required",
    packages: [],
    athlete_capacity: 15,
    response_time: "",
    avatar_url: null,
    banner_url: null,
  });

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [profileStyle, setProfileStyle] = useState<"light" | "dark" | "teal">("light");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  const [sections, setSections] = useState({
    identity: true,
    about: true,
    links: false,
    experience: false,
    packages: true,
    settings: false,
  });
  const toggle = (key: keyof typeof sections) => setSections((s) => ({ ...s, [key]: !s[key] }));

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (patch: Partial<OnboardingData>) => setData((d) => ({ ...d, ...patch }));

  const handleAvatarFile = async (file: File) => {
    setUploadingAvatar(true);
    const url = await uploadImage("coach-avatars", file, userId);
    if (url) { setAvatarUrl(url); update({ avatar_url: url }); }
    setUploadingAvatar(false);
  };

  const handleBannerFile = async (file: File) => {
    setUploadingBanner(true);
    const url = await uploadImage("coach-banners", file, userId);
    if (url) { setBannerUrl(url); update({ banner_url: url }); }
    setUploadingBanner(false);
  };

  const submit = async () => {
    if (!data.full_name.trim()) { setError("Full name is required."); return; }
    if (!data.remote && !data.location.trim()) { setError("Location is required for in-person coaches."); return; }
    if (data.events.length === 0) { setError("Select at least one event you coach."); return; }
    if (!data.years_coaching || data.years_coaching < 0) { setError("Enter your years of coaching."); return; }
    if (!data.short_bio.trim()) { setError("A coaching bio is required."); return; }
    if (data.packages.length === 0) { setError("Add at least one coaching package."); return; }
    if (data.packages.some((p) => !p.name.trim())) { setError("All packages need a name."); return; }
    if (data.packages.some((p) => p.price <= 0)) { setError("All packages need a price greater than $0."); return; }
    if (!data.athlete_capacity || data.athlete_capacity < 1) { setError("Enter your roster capacity."); return; }
    if (!data.response_time) { setError("Select a response time."); return; }

    setError("");
    setSubmitting(true);
    const result = await submitCoachProfile(data);
    if (result?.error) { setError(result.error); setSubmitting(false); return; }
    if (result?.success) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#D7D7D7] flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-[#007B6F] flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl tracking-tight leading-none mb-4" style={{ fontFamily: "var(--font-anton)" }}>
            APPLICATION RECEIVED
          </h1>
          <p className="text-base text-black/70 mb-2">
            Thanks, {data.full_name.split(" ")[0]}. We&apos;ll review your profile within 1–2 business days.
          </p>
          <p className="text-sm text-black/50 mb-8">
            Check your inbox for a confirmation email. You&apos;ll be notified as soon as you&apos;re approved.
          </p>
          <a href="/coach/dashboard" className="inline-block bg-black text-[#D7D7D7] px-8 py-3 text-sm font-semibold hover:bg-[#007B6F] transition-colors">
            Go to your dashboard →
          </a>
          <p className="text-xs text-black/30 mt-6">Questions? Email us at hello@shotspot.app</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden flex bg-[#D7D7D7]">

      {/* ── Left sidebar ── */}
      <div className="w-[440px] flex-shrink-0 border-r-2 border-black flex flex-col overflow-hidden bg-[#D7D7D7]">

        {/* Header */}
        <div className="border-b-2 border-black px-6 py-4 flex-shrink-0">
          <span className="text-lg tracking-tight font-bold" style={{ fontFamily: "var(--font-anton)" }}>
            <span>SHOT</span><span className="text-[#007B6F]">SPOT</span>
          </span>
          <p className="text-xs text-black/40 mt-0.5">Build your coach profile</p>
        </div>

        {/* Scrollable sections */}
        <div className="flex-1 overflow-y-auto">

          {/* Identity */}
          <SidebarSection title="Identity" open={sections.identity} onToggle={() => toggle("identity")}>
            <div>
              <FieldLabel required>Full name</FieldLabel>
              <Input value={data.full_name} onChange={(e) => update({ full_name: e.target.value })} placeholder="Your full name" />
            </div>
            <div>
              <FieldLabel>Organization / Club</FieldLabel>
              <Input value={data.organization} onChange={(e) => update({ organization: e.target.value })} placeholder="e.g. Webb Throws Academy" />
            </div>
            <div>
              <FieldLabel>Coaching format</FieldLabel>
              <div className="flex gap-2">
                {[{ value: true, label: "Remote" }, { value: false, label: "In-Person" }].map((opt) => (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => update({ remote: opt.value })}
                    className={`flex-1 py-2 text-sm font-semibold border-2 transition-colors ${
                      data.remote === opt.value ? "bg-black text-[#D7D7D7] border-black" : "border-black/30 hover:border-black"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <FieldLabel required={!data.remote}>
                Location{data.remote ? " (optional)" : ""}
              </FieldLabel>
              <Input value={data.location} onChange={(e) => update({ location: e.target.value })} placeholder="City, State (e.g. Eugene, OR)" />
              {data.remote && <p className="text-xs text-black/30 mt-1">Helps athletes know your time zone.</p>}
            </div>
            <div className="flex gap-4 items-start">
              <ImageUploadButton
                label="Profile photo"
                hint="Upload photo"
                previewUrl={avatarUrl}
                aspect="square"
                onFile={handleAvatarFile}
                uploading={uploadingAvatar}
              />
              <ImageUploadButton
                label="Banner image"
                hint="Upload a wide banner image"
                previewUrl={bannerUrl}
                aspect="banner"
                onFile={handleBannerFile}
                uploading={uploadingBanner}
              />
            </div>
          </SidebarSection>

          {/* About */}
          <SidebarSection title="About" open={sections.about} onToggle={() => toggle("about")}>
            <div>
              <FieldLabel required>Events you coach</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {EVENTS.map((e) => (
                  <button
                    key={e.key}
                    type="button"
                    onClick={() => update({ events: data.events.includes(e.key) ? data.events.filter((k) => k !== e.key) : [...data.events, e.key] })}
                    className={`px-4 py-2 text-sm font-semibold border-2 transition-colors ${
                      data.events.includes(e.key) ? "bg-black text-[#D7D7D7] border-black" : "border-black/30 hover:border-black"
                    }`}
                  >
                    {e.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <FieldLabel required>Years coaching</FieldLabel>
              <Input type="number" min={0} max={60} value={data.years_coaching || ""} onChange={(e) => update({ years_coaching: Number(e.target.value) })} placeholder="e.g. 10" className="max-w-[140px]" />
            </div>
            <div>
              <FieldLabel required>Coaching bio</FieldLabel>
              <Textarea rows={5} maxLength={600} value={data.short_bio} onChange={(e) => update({ short_bio: e.target.value })} placeholder="Tell athletes who you are, what you coach, and what makes your approach different." />
              <p className="text-xs text-black/30 mt-1">{data.short_bio.length}/600</p>
            </div>
          </SidebarSection>

          {/* Links */}
          <SidebarSection title="Links" open={sections.links} onToggle={() => toggle("links")}>
            <LinksSection links={data.links} onChange={(links) => update({ links })} />
          </SidebarSection>

          {/* Experience */}
          <SidebarSection title="Experience" open={sections.experience} onToggle={() => toggle("experience")}>
            {data.coaching_history.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-xs text-black/30 mb-3">No experience added yet</p>
                <button
                  type="button"
                  onClick={() => update({ coaching_history: [...data.coaching_history, { role: "", organization: "", start_year: new Date().getFullYear(), end_year: null, description: "" }] })}
                  className="bg-black text-[#D7D7D7] px-5 py-2 text-xs font-semibold hover:bg-[#007B6F] transition-colors"
                >
                  + Add your first role
                </button>
              </div>
            ) : (
              <div>
                {data.coaching_history.map((entry, i) => (
                  <HistoryEntryForm
                    key={i}
                    entry={entry}
                    index={i}
                    onChange={(p) => update({ coaching_history: data.coaching_history.map((e, idx) => idx === i ? { ...e, ...p } : e) })}
                    onRemove={() => update({ coaching_history: data.coaching_history.filter((_, idx) => idx !== i) })}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => update({ coaching_history: [...data.coaching_history, { role: "", organization: "", start_year: new Date().getFullYear(), end_year: null, description: "" }] })}
                  className="border-2 border-black px-5 py-2 text-xs font-semibold hover:bg-black hover:text-[#D7D7D7] transition-colors"
                >
                  + Add another role
                </button>
              </div>
            )}
          </SidebarSection>

          {/* Packages */}
          <SidebarSection title="Packages" open={sections.packages} onToggle={() => toggle("packages")}>
            <PackageEditorSection data={data} onChange={update} />
          </SidebarSection>

          {/* Settings */}
          <SidebarSection title="Settings" open={sections.settings} onToggle={() => toggle("settings")}>
            <div>
              <FieldLabel required>Enrollment type</FieldLabel>
              <div className="flex flex-col gap-2">
                {[
                  { value: "instant_join" as const, label: "Instant Join", sub: "Athletes pay and join immediately" },
                  { value: "application_required" as const, label: "Application Required", sub: "You review each athlete before accepting" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => update({ intake_mode: opt.value })}
                    className={`p-3 text-left border-2 transition-colors ${
                      data.intake_mode === opt.value ? "bg-black text-[#D7D7D7] border-black" : "border-black/30 hover:border-black"
                    }`}
                  >
                    <p className="text-sm font-semibold">{opt.label}</p>
                    <p className={`text-xs mt-0.5 ${data.intake_mode === opt.value ? "text-white/60" : "text-black/40"}`}>{opt.sub}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel required>Max athletes</FieldLabel>
                <Input type="number" min={1} max={200} value={data.athlete_capacity || ""} onChange={(e) => update({ athlete_capacity: Number(e.target.value) })} placeholder="e.g. 15" />
              </div>
              <div>
                <FieldLabel required>Response time</FieldLabel>
                <Select value={data.response_time} onChange={(e) => update({ response_time: e.target.value })}>
                  <option value="">Select…</option>
                  <option value="24hr">Within 24 hours</option>
                  <option value="48hr">Within 48 hours</option>
                  <option value="72hr">Within 72 hours</option>
                </Select>
              </div>
            </div>
            <p className="text-xs text-black/40 border-t border-black/10 pt-3">
              ShotSpot charges a 15% platform fee. Your listed price is what athletes see.
            </p>
          </SidebarSection>

          <div className="h-4" />
        </div>

        {/* Footer */}
        <div className="border-t-2 border-black p-4 flex-shrink-0 space-y-3 bg-[#D7D7D7]">
          {error && (
            <div className="border-2 border-red-500 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div>
          )}
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="w-full bg-[#007B6F] text-white py-3 text-sm font-semibold hover:bg-[#005a51] transition-colors disabled:opacity-50"
          >
            {submitting ? "Submitting…" : "Submit for Review →"}
          </button>
          <p className="text-xs text-black/30 text-center">We review profiles within 1–2 business days</p>
        </div>
      </div>

      {/* ── Right preview panel ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Preview header */}
        <div className="border-b-2 border-black px-6 py-3 flex-shrink-0 flex items-center justify-between bg-[#D7D7D7]">
          <p className="text-xs font-bold uppercase tracking-widest text-black/30" style={{ fontFamily: "var(--font-anton)" }}>
            Profile Preview
          </p>
          <p className="text-xs text-black/30">Updates as you type</p>
        </div>

        {/* Scrollable preview */}
        <div className="flex-1 overflow-y-auto p-6 bg-black/[0.04]">
          <CoachProfilePreview data={data} avatarUrl={avatarUrl} bannerUrl={bannerUrl} profileStyle={profileStyle} />
        </div>

        {/* Style picker */}
        <div className="border-t-2 border-black px-6 py-3 flex-shrink-0 flex items-center gap-4 bg-[#D7D7D7]">
          <p className="text-xs font-bold uppercase tracking-widest text-black/40" style={{ fontFamily: "var(--font-anton)" }}>
            Banner color
          </p>
          {([
            { value: "light" as const, bg: "#C0C0C0" },
            { value: "dark" as const,  bg: "#000000" },
            { value: "teal" as const,  bg: "#007B6F" },
          ]).map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setProfileStyle(s.value)}
              title={s.value}
              className={`w-7 h-7 border-2 transition-all ${
                profileStyle === s.value ? "ring-2 ring-offset-2 ring-black scale-110 border-transparent" : "border-black/20 hover:border-black"
              }`}
              style={{ backgroundColor: s.bg }}
            />
          ))}
          {bannerUrl && <span className="text-xs text-black/30 ml-1">(image overrides color)</span>}
        </div>
      </div>
    </div>
  );
}
