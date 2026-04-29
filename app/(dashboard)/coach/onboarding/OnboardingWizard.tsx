"use client";

import { useState } from "react";
import { submitCoachProfile, type OnboardingData } from "@/lib/coach/actions";
import type { CoachingHistoryEntry } from "@/lib/types/coach";

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

function Step4({ data, onChange }: { data: OnboardingData; onChange: (p: Partial<OnboardingData>) => void }) {
  return (
    <div className="space-y-5">
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
      <div className="grid grid-cols-2 gap-5">
        <div><FieldLabel required>Starting price (USD)</FieldLabel><Input type="number" min={0} value={data.starting_price || ""} onChange={(e) => onChange({ starting_price: Number(e.target.value) })} placeholder="e.g. 250" /></div>
        <div>
          <FieldLabel required>Billing cadence</FieldLabel>
          <Select value={data.billing_cadence} onChange={(e) => onChange({ billing_cadence: e.target.value as OnboardingData["billing_cadence"] })}>
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="one_time">One-time</option>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div><FieldLabel required>Max athletes on roster</FieldLabel><Input type="number" min={1} max={200} value={data.athlete_capacity || ""} onChange={(e) => onChange({ athlete_capacity: Number(e.target.value) })} placeholder="e.g. 15" /></div>
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
        <Row label="Starting price" value={`$${data.starting_price} / ${data.billing_cadence}`} />
        <Row label="Roster capacity" value={`${data.athlete_capacity} athletes`} />
        <Row label="Response time" value={data.response_time} />
        <Row label="History entries" value={`${data.coaching_history.length}`} />
      </div>
      <div className="border-2 border-black p-5">
        <p className="text-xs uppercase tracking-widest text-black/40 mb-2" style={{ fontFamily: "var(--font-anton)" }}>Bio</p>
        <p className="text-sm text-black/80 leading-relaxed">{data.short_bio || "—"}</p>
      </div>
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
    if (!data.starting_price || data.starting_price <= 0) return "Enter a starting price.";
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
    intake_mode: "application_required",
    athlete_capacity: 15,
    starting_price: 0,
    billing_cadence: "monthly",
    response_time: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (patch: Partial<OnboardingData>) => setData((d) => ({ ...d, ...patch }));
  const next = () => { const err = validate(step, data); if (err) { setError(err); return; } setError(""); setStep((s) => s + 1); };
  const back = () => { setError(""); setStep((s) => s - 1); };
  const submit = async () => {
    const err = validate(step, data);
    if (err) { setError(err); return; }
    setSubmitting(true);
    const result = await submitCoachProfile(data);
    if (result?.error) { setError(result.error); setSubmitting(false); }
  };

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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3 sm:gap-5 overflow-x-auto">
          {STEP_LABELS.map((label, i) => (
            <div key={i} className="flex items-center gap-2 flex-shrink-0">
              <StepLabel step={i + 1} label={label} current={step} />
              {i < STEP_LABELS.length - 1 && <div className="w-6 sm:w-10 h-px bg-black/15 flex-shrink-0" />}
            </div>
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
