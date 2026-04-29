"use client";

import { useState } from "react";
import { submitCoachProfile, type OnboardingData } from "@/lib/coach/actions";
import type { CoachingHistoryEntry, CoachPackage, CoachLink } from "@/lib/types/coach";

const EVENTS = [
  { key: "shot_put", label: "Shot Put" },
  { key: "discus",   label: "Discus"   },
  { key: "hammer",   label: "Hammer"   },
  { key: "javelin",  label: "Javelin"  },
];

const TOTAL_STEPS = 5;

function StepLabel({ step, label, current }: { step: number; label: string; current: number }) {
  const done = step < current;
  const active = step === current;
  return (
    <div className="flex items-center gap-2">
      <div className={`w-7 h-7 flex items-center justify-center text-xs font-bold border-2 flex-shrink-0 transition-colors ${done ? "bg-[#007B6F] border-[#007B6F] text-white" : active ? "bg-black border-black text-[#D7D7D7]" : "border-black/20 text-black/30"}`}>
        {done ? "✓" : step}
      </div>
      <span className={`text-xs hidden sm:block ${active ? "font-semibold" : "text-black/40"}`}>{label}</span>
    </div>
  );
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium mb-1.5">
      {children}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full border-2 border-black bg-transparent px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#007B6F] ${props.className ?? ""}`} />;
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`w-full border-2 border-black bg-transparent px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#007B6F] resize-none ${props.className ?? ""}`} />;
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`w-full border-2 border-black bg-[#D7D7D7] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#007B6F] ${props.className ?? ""}`} />;
}

function Step1({ data, onChange }: { data: OnboardingData; onChange: (p: Partial<OnboardingData>) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <FieldLabel required>Full name</FieldLabel>
        <Input value={data.full_name} onChange={(e) => onChange({ full_name: e.target.value })} placeholder="Your full name" />
      </div>
      <div>
        <FieldLabel>Organization / Club (optional)</FieldLabel>
        <Input value={data.organization} onChange={(e) => onChange({ organization: e.target.value })} placeholder="e.g. Webb Throws Academy" />
      </div>
      <div>
        <FieldLabel required>Your location</FieldLabel>
        <Input value={data.location} onChange={(e) => onChange({ location: e.target.value })} placeholder="City, State (e.g. Eugene, OR)" />
      </div>
      <div>
        <FieldLabel>Coaching format</FieldLabel>
        <div className="flex gap-3 mt-1">
          {[{ value: true, label: "Remote" }, { value: false, label: "In-Person" }].map((opt) => (
            <button key={String(opt.value)} type="button" onClick={() => onChange({ remote: opt.value })}
              className={`flex-1 py-2.5 text-sm font-semibold border-2 transition-colors ${data.remote === opt.value ? "bg-black text-[#D7D7D7] border-black" : "border-black/30 hover:border-black"}`}>
              {opt.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-black/40 mt-1.5">Choose Remote if you coach athletes online. You can update this later.</p>
      </div>
    </div>
  );
}

const PREDEFINED_LINKS = [
  { label: "Instagram", placeholder: "https://instagram.com/yourhandle" },
  { label: "LinkedIn", placeholder: "https://linkedin.com/in/yourname" },
  { label: "Coaching profile", placeholder: "USATF page, athletic.net, personal site, etc." },
];
const PREDEFINED_LABELS = PREDEFINED_LINKS.map((p) => p.label);

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
    <div className="border-t border-black/10 pt-5">
      <p className="text-sm font-medium mb-1">Links & online presence</p>
      <p className="text-xs text-black/50 mb-4">All optional. These appear on your profile and help verify your background.</p>
      <div className="space-y-3">
        {PREDEFINED_LINKS.map(({ label, placeholder }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="text-sm w-32 flex-shrink-0 text-black/70">{label}</span>
            <Input type="url" value={getUrl(label)} onChange={(e) => setUrl(label, e.target.value)} placeholder={placeholder} />
          </div>
        ))}
        {customLinks.map((link, i) => (
          <div key={i} className="flex items-center gap-3">
            <Input value={link.label} onChange={(e) => updateCustom(i, { label: e.target.value })} placeholder="Link name" className="w-32 flex-shrink-0" />
            <Input type="url" value={link.url} onChange={(e) => updateCustom(i, { url: e.target.value })} placeholder="https://..." />
            <button type="button" onClick={() => removeCustom(i)} className="text-black/30 hover:text-black flex-shrink-0 text-lg leading-none">✕</button>
          </div>
        ))}
      </div>
      <button type="button" onClick={addCustom} className="mt-3 text-sm text-[#007B6F] hover:underline">+ Add another link</button>
    </div>
  );
}

function Step2({ data, onChange }: { data: OnboardingData; onChange: (p: Partial<OnboardingData>) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <FieldLabel required>Events you coach</FieldLabel>
        <div className="flex flex-wrap gap-2 mt-1">
          {EVENTS.map((e) => (
            <button key={e.key} type="button"
              onClick={() => onChange({ events: data.events.includes(e.key) ? data.events.filter((k) => k !== e.key) : [...data.events, e.key] })}
              className={`px-4 py-2.5 text-sm font-semibold border-2 transition-colors ${data.events.includes(e.key) ? "bg-black text-[#D7D7D7] border-black" : "border-black/30 hover:border-black"}`}>
              {e.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <FieldLabel required>Years coaching</FieldLabel>
        <Input type="number" min={0} max={60} value={data.years_coaching || ""} onChange={(e) => onChange({ years_coaching: Number(e.target.value) })} placeholder="e.g. 10" className="max-w-xs" />
      </div>
      <div>
        <FieldLabel required>Your coaching bio</FieldLabel>
        <Textarea rows={5} maxLength={600} value={data.short_bio} onChange={(e) => onChange({ short_bio: e.target.value })} placeholder="Tell athletes who you are, what you coach, and what makes your approach different." />
        <p className="text-xs text-black/40 mt-1">{data.short_bio.length}/600 characters</p>
      </div>
      <LinksSection links={data.links} onChange={(links) => onChange({ links })} />
    </div>
  );
}

function HistoryEntryForm({ entry, index, onChange, onRemove }: { entry: CoachingHistoryEntry; index: number; onChange: (p: Partial<CoachingHistoryEntry>) => void; onRemove: () => void }) {
  return (
    <div className="border-2 border-black/20 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-black/40">Role {index + 1}</span>
        <button type="button" onClick={onRemove} className="text-xs text-black/40 hover:text-black underline">Remove</button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><FieldLabel required>Role / Title</FieldLabel><Input value={entry.role} onChange={(e) => onChange({ role: e.target.value })} placeholder="e.g. Head Throws Coach" /></div>
        <div><FieldLabel required>Organization</FieldLabel><Input value={entry.organization} onChange={(e) => onChange({ organization: e.target.value })} placeholder="e.g. University of Oregon" /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><FieldLabel required>Start year</FieldLabel><Input type="number" min={1960} max={new Date().getFullYear()} value={entry.start_year || ""} onChange={(e) => onChange({ start_year: Number(e.target.value) })} placeholder="2015" /></div>
        <div><FieldLabel>End year</FieldLabel><Input type="number" min={1960} max={new Date().getFullYear()} value={entry.end_year ?? ""} onChange={(e) => onChange({ end_year: e.target.value ? Number(e.target.value) : null })} placeholder="Present" /></div>
      </div>
      <div>
        <FieldLabel>Description</FieldLabel>
        <Textarea rows={2} maxLength={200} value={entry.description} onChange={(e) => onChange({ description: e.target.value })} placeholder="Brief summary of your role and achievements" />
      </div>
    </div>
  );
}

function Step3({ data, onChange }: { data: OnboardingData; onChange: (p: Partial<OnboardingData>) => void }) {
  const addEntry = () => onChange({ coaching_history: [...data.coaching_history, { role: "", organization: "", start_year: new Date().getFullYear(), end_year: null, description: "" }] });
  const updateEntry = (i: number, patch: Partial<CoachingHistoryEntry>) => onChange({ coaching_history: data.coaching_history.map((e, idx) => idx === i ? { ...e, ...patch } : e) });
  const removeEntry = (i: number) => onChange({ coaching_history: data.coaching_history.filter((_, idx) => idx !== i) });
  return (
    <div className="space-y-4">
      <p className="text-sm text-black/60">Add your coaching roles in reverse chronological order. Athletes pay attention to this.</p>
      {data.coaching_history.length === 0 && <p className="text-sm text-black/40 italic">No history added yet.</p>}
      {data.coaching_history.map((entry, i) => (
        <HistoryEntryForm key={i} entry={entry} index={i} onChange={(p) => updateEntry(i, p)} onRemove={() => removeEntry(i)} />
      ))}
      <button type="button" onClick={addEntry} className="border-2 border-dashed border-black/30 w-full py-3 text-sm text-black/50 hover:border-black hover:text-black transition-colors">
        + Add coaching role
      </button>
    </div>
  );
}

const CADENCE_LABELS: Record<string, string> = { monthly: "/ mo", weekly: "/ wk", one_time: "one-time" };

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

function newPackage(): CoachPackage {
  return { id: Math.random().toString(36).slice(2), name: "", description: "", price: 0, billing_cadence: "monthly", includes: [] };
}

function PackageForm({ pkg, index, onChange, onRemove }: { pkg: CoachPackage; index: number; onChange: (p: Partial<CoachPackage>) => void; onRemove: () => void }) {
  const toggle = (opt: string) => onChange({ includes: pkg.includes.includes(opt) ? pkg.includes.filter((i) => i !== opt) : [...pkg.includes, opt] });
  return (
    <div className="border-2 border-black p-5 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-black/40">Package {index + 1}</span>
        <button type="button" onClick={onRemove} className="text-xs text-black/40 hover:text-black underline">Remove</button>
      </div>
      <div>
        <FieldLabel required>Package name</FieldLabel>
        <Input value={pkg.name} onChange={(e) => onChange({ name: e.target.value })} placeholder='e.g. "Technical Analysis Only"' />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel required>Price (USD)</FieldLabel>
          <Input type="number" min={0} value={pkg.price || ""} onChange={(e) => onChange({ price: Number(e.target.value) })} placeholder="e.g. 150" />
        </div>
        <div>
          <FieldLabel required>Billing</FieldLabel>
          <Select value={pkg.billing_cadence} onChange={(e) => onChange({ billing_cadence: e.target.value as CoachPackage["billing_cadence"] })}>
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="one_time">One-time</option>
          </Select>
        </div>
      </div>
      <div>
        <FieldLabel>What&apos;s included</FieldLabel>
        <div className="flex flex-wrap gap-2 mt-1">
          {INCLUDE_OPTIONS.map((opt) => (
            <button key={opt} type="button" onClick={() => toggle(opt)}
              className={`px-3 py-1.5 text-xs border-2 transition-colors ${pkg.includes.includes(opt) ? "bg-black text-[#D7D7D7] border-black" : "border-black/30 hover:border-black"}`}>
              {opt}
            </button>
          ))}
        </div>
      </div>
      <div>
        <FieldLabel>Short description (optional)</FieldLabel>
        <Input value={pkg.description} onChange={(e) => onChange({ description: e.target.value })} placeholder="e.g. Video breakdown of each throw with written cues" />
      </div>
    </div>
  );
}

function Step4({ data, onChange }: { data: OnboardingData; onChange: (p: Partial<OnboardingData>) => void }) {
  const addPkg = () => onChange({ packages: [...data.packages, newPackage()] });
  const updatePkg = (i: number, patch: Partial<CoachPackage>) => onChange({ packages: data.packages.map((p, idx) => idx === i ? { ...p, ...patch } : p) });
  const removePkg = (i: number) => onChange({ packages: data.packages.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-6">
      <div>
        <FieldLabel required>Enrollment type</FieldLabel>
        <div className="flex gap-3 mt-1">
          {[{ value: "instant_join", label: "Instant Join", sub: "Athletes pay and join immediately" }, { value: "application_required", label: "Application Required", sub: "You review each athlete before accepting" }].map((opt) => (
            <button key={opt.value} type="button" onClick={() => onChange({ intake_mode: opt.value as OnboardingData["intake_mode"] })}
              className={`flex-1 p-3 text-left border-2 transition-colors ${data.intake_mode === opt.value ? "bg-black text-[#D7D7D7] border-black" : "border-black/30 hover:border-black"}`}>
              <p className="text-sm font-semibold">{opt.label}</p>
              <p className={`text-xs mt-0.5 ${data.intake_mode === opt.value ? "text-white/60" : "text-black/40"}`}>{opt.sub}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-baseline justify-between mb-1">
          <FieldLabel required>Coaching packages</FieldLabel>
          <span className="text-xs text-black/40">{data.packages.length} package{data.packages.length !== 1 ? "s" : ""}</span>
        </div>
        <p className="text-xs text-black/50 mb-4">Create one or more tiers athletes can choose from — e.g. video-only, full training, elite. At least one required.</p>
        <div className="space-y-4">
          {data.packages.map((pkg, i) => (
            <PackageForm key={pkg.id} pkg={pkg} index={i} onChange={(p) => updatePkg(i, p)} onRemove={() => removePkg(i)} />
          ))}
        </div>
        <button type="button" onClick={addPkg} className="border-2 border-dashed border-black/30 w-full py-3 text-sm text-black/50 hover:border-black hover:text-black transition-colors mt-4">
          + Add package
        </button>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <FieldLabel required>Max athletes on roster</FieldLabel>
          <Input type="number" min={1} max={200} value={data.athlete_capacity || ""} onChange={(e) => onChange({ athlete_capacity: Number(e.target.value) })} placeholder="e.g. 15" />
        </div>
        <div>
          <FieldLabel required>Typical response time</FieldLabel>
          <Select value={data.response_time} onChange={(e) => onChange({ response_time: e.target.value })}>
            <option value="">Select...</option>
            <option value="24hr">Within 24 hours</option>
            <option value="48hr">Within 48 hours</option>
            <option value="72hr">Within 72 hours</option>
          </Select>
        </div>
      </div>

      <p className="text-xs text-black/40 border-t border-black/10 pt-4">ShotSpot charges a 15% platform fee on completed payments. Your listed price is what athletes see.</p>
    </div>
  );
}

function Step5({ data }: { data: OnboardingData }) {
  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-start justify-between py-3 border-b border-black/10 last:border-0 gap-4">
      <span className="text-sm text-black/50 flex-shrink-0">{label}</span>
      <span className="text-sm font-medium text-right">{value || "—"}</span>
    </div>
  );
  return (
    <div className="space-y-6">
      <p className="text-sm text-black/60">Review your profile. Once submitted, the ShotSpot team will review it within 1–2 business days.</p>
      <div className="border-2 border-black p-5">
        <Row label="Name" value={data.full_name} />
        <Row label="Organization" value={data.organization} />
        <Row label="Location" value={`${data.location}${data.remote ? " (Remote)" : ""}`} />
        <Row label="Events" value={data.events.map((e) => e.replace("_", " ")).join(", ")} />
        <Row label="Years coaching" value={`${data.years_coaching}`} />
        <Row label="Enrollment" value={data.intake_mode === "instant_join" ? "Instant Join" : "Application Required"} />
        <Row label="Roster capacity" value={`${data.athlete_capacity} athletes`} />
        <Row label="Response time" value={data.response_time} />
        <Row label="History entries" value={`${data.coaching_history.length}`} />
      </div>
      {data.packages.length > 0 && (
        <div className="border-2 border-black p-5">
          <p className="text-xs uppercase tracking-widest text-black/40 mb-3" style={{ fontFamily: "var(--font-anton)" }}>Packages ({data.packages.length})</p>
          <div className="space-y-3">
            {data.packages.map((pkg) => (
              <div key={pkg.id} className="flex items-start justify-between gap-4 py-2 border-b border-black/10 last:border-0">
                <div>
                  <p className="text-sm font-semibold">{pkg.name || "Unnamed package"}</p>
                  {pkg.includes.length > 0 && <p className="text-xs text-black/50 mt-0.5">{pkg.includes.slice(0, 3).join(" · ")}{pkg.includes.length > 3 ? ` +${pkg.includes.length - 3} more` : ""}</p>}
                </div>
                <p className="text-sm font-bold flex-shrink-0">${pkg.price} <span className="font-normal text-black/50">{CADENCE_LABELS[pkg.billing_cadence]}</span></p>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="border-2 border-black p-5">
        <p className="text-xs uppercase tracking-widest text-black/40 mb-2" style={{ fontFamily: "var(--font-anton)" }}>Bio</p>
        <p className="text-sm text-black/80 leading-relaxed">{data.short_bio || "—"}</p>
      </div>
      {data.links.filter((l) => l.url.trim()).length > 0 && (
        <div className="border-2 border-black p-5">
          <p className="text-xs uppercase tracking-widest text-black/40 mb-3" style={{ fontFamily: "var(--font-anton)" }}>Links</p>
          <div className="space-y-2">
            {data.links.filter((l) => l.url.trim()).map((link, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-black/50 w-32 flex-shrink-0">{link.label}</span>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-[#007B6F] hover:underline truncate">{link.url}</a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const STEP_LABELS = ["Basic Info", "Your Coaching", "Experience", "Availability", "Review"];
const STEP_SUBTITLES = ["", "Tell athletes where you're based and how you coach.", "What events do you coach and what's your background?", "Add your past coaching roles. Athletes take this seriously.", "Set your pricing, roster size, and how athletes can join.", "Double-check everything before submitting for review."];
const STEP_TITLES = ["", "Basic Info", "Your Coaching", "Experience", "Availability & Pricing", "Review & Submit"];

function validate(step: number, data: OnboardingData): string | null {
  if (step === 1) {
    if (!data.full_name.trim()) return "Full name is required.";
    if (!data.location.trim()) return "Location is required.";
  }
  if (step === 2) {
    if (data.events.length === 0) return "Select at least one event.";
    if (!data.years_coaching || data.years_coaching < 0) return "Enter your years of coaching.";
    if (!data.short_bio.trim()) return "A coaching bio is required.";
  }
  if (step === 4) {
    if (data.packages.length === 0) return "Add at least one coaching package.";
    if (data.packages.some((p) => !p.name.trim())) return "All packages need a name.";
    if (data.packages.some((p) => p.price <= 0)) return "All packages need a price greater than $0.";
    if (!data.athlete_capacity || data.athlete_capacity < 1) return "Enter your roster capacity.";
    if (!data.response_time) return "Select a response time.";
  }
  return null;
}

export function OnboardingWizard({ initialName }: { initialName: string }) {
  const [step, setStep] = useState(1);
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
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (patch: Partial<OnboardingData>) => setData((d) => ({ ...d, ...patch }));
  const next = () => { const err = validate(step, data); if (err) { setError(err); return; } setError(""); setStep((s) => s + 1); };
  const back = () => { setError(""); setStep((s) => s - 1); };
  const submit = async () => {
    const err = validate(step, data);
    if (err) { setError(err); return; }
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
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h1 className="text-3xl sm:text-4xl tracking-tight leading-none mb-4" style={{ fontFamily: "var(--font-anton)" }}>
            APPLICATION RECEIVED
          </h1>
          <p className="text-base text-black/70 mb-2">
            Thanks, {data.full_name.split(" ")[0]}. We&apos;ll review your profile within 1–2 business days.
          </p>
          <p className="text-sm text-black/50 mb-8">
            Check your inbox for a confirmation email. You&apos;ll be notified as soon as you&apos;re approved and your profile goes live on the marketplace.
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
    <div className="min-h-screen bg-[#D7D7D7]">
      <div className="border-b-2 border-black bg-[#D7D7D7] sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <span className="text-lg tracking-tight font-bold" style={{ fontFamily: "var(--font-anton)" }}>
            <span>SHOT</span><span className="text-[#007B6F]">SPOT</span>
          </span>
          <p className="text-xs text-black/40">Step {step} of {TOTAL_STEPS}</p>
        </div>
      </div>
      <div className="border-b border-black/10 bg-[#D7D7D7]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center">
          {STEP_LABELS.map((label, i) => (
            <>
              <div key={i} className="flex items-center gap-1.5 shrink-0">
                <StepLabel step={i + 1} label={label} current={step} />
              </div>
              {i < STEP_LABELS.length - 1 && <div key={`line-${i}`} className="flex-1 h-px bg-black/15 mx-2" />}
            </>
          ))}
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl tracking-tight leading-none mb-2" style={{ fontFamily: "var(--font-anton)" }}>{STEP_TITLES[step]}</h1>
          <p className="text-sm text-black/50">{STEP_SUBTITLES[step]}</p>
        </div>
        {error && <div className="border-2 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">{error}</div>}
        <div className="bg-[#D7D7D7] border-2 border-black p-6 sm:p-8 mb-8">
          {step === 1 && <Step1 data={data} onChange={update} />}
          {step === 2 && <Step2 data={data} onChange={update} />}
          {step === 3 && <Step3 data={data} onChange={update} />}
          {step === 4 && <Step4 data={data} onChange={update} />}
          {step === 5 && <Step5 data={data} />}
        </div>
        <div className="flex items-center justify-between">
          {step > 1 ? (
            <button type="button" onClick={back} className="border-2 border-black px-6 py-2.5 text-sm font-semibold hover:bg-black hover:text-[#D7D7D7] transition-colors">← Back</button>
          ) : <div />}
          {step < TOTAL_STEPS ? (
            <button type="button" onClick={next} className="bg-black text-[#D7D7D7] px-8 py-2.5 text-sm font-semibold hover:bg-[#007B6F] transition-colors">Continue →</button>
          ) : (
            <button type="button" onClick={submit} disabled={submitting} className="bg-[#007B6F] text-white px-8 py-2.5 text-sm font-semibold hover:bg-[#005a51] transition-colors disabled:opacity-50">
              {submitting ? "Submitting..." : "Submit for Review"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
