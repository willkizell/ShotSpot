"use client";

import { useState } from "react";
import { approveCoach, rejectCoach } from "@/lib/admin/actions";

const STATUS_CONFIG = {
  pending:   { label: "Pending",   color: "bg-amber-100 text-amber-800 border-amber-300"  },
  approved:  { label: "Approved",  color: "bg-green-100 text-green-800 border-green-300"  },
  rejected:  { label: "Rejected",  color: "bg-red-100 text-red-700 border-red-300"        },
  suspended: { label: "Suspended", color: "bg-gray-100 text-gray-700 border-gray-300"     },
};

type CoachRow = {
  id: string;
  full_name: string;
  location: string | null;
  organization: string | null;
  events: string[];
  years_coaching: number;
  starting_price: number | null;
  billing_cadence: string | null;
  short_bio: string | null;
  status: "pending" | "approved" | "rejected" | "suspended";
  created_at: string;
  rejection_reason: string | null;
};

function RejectModal({
  coach,
  onConfirm,
  onCancel,
}: {
  coach: CoachRow;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#D7D7D7] border-2 border-black w-full max-w-md p-6">
        <h3 className="font-bold mb-1">Reject {coach.full_name}?</h3>
        <p className="text-sm text-black/60 mb-4">
          They&apos;ll receive a notification. Optionally explain why.
        </p>
        <textarea
          className="w-full border-2 border-black bg-transparent px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black mb-4"
          rows={3}
          placeholder="Reason (optional — shown to coach)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="flex gap-3">
          <button
            onClick={() => onConfirm(reason)}
            className="flex-1 bg-red-600 text-white py-2 text-sm font-semibold hover:bg-red-700 transition-colors"
          >
            Reject
          </button>
          <button
            onClick={onCancel}
            className="flex-1 border-2 border-black py-2 text-sm font-semibold hover:bg-black hover:text-[#D7D7D7] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function CoachRow({ coach }: { coach: CoachRow }) {
  const [status, setStatus] = useState(coach.status);
  const [loading, setLoading] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const config = STATUS_CONFIG[status];

  const handleApprove = async () => {
    setLoading(true);
    const result = await approveCoach(coach.id);
    if (!result?.error) setStatus("approved");
    setLoading(false);
  };

  const handleReject = async (reason: string) => {
    setLoading(true);
    setRejectOpen(false);
    const result = await rejectCoach(coach.id, reason);
    if (!result?.error) setStatus("rejected");
    setLoading(false);
  };

  return (
    <>
      {rejectOpen && (
        <RejectModal
          coach={coach}
          onConfirm={handleReject}
          onCancel={() => setRejectOpen(false)}
        />
      )}
      <div className="border-2 border-black bg-[#D7D7D7] p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          {/* Left: info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-bold text-base">{coach.full_name}</h3>
              <span className={`text-xs px-2 py-0.5 border font-medium ${config.color}`}>
                {config.label}
              </span>
            </div>
            {coach.organization && (
              <p className="text-sm text-black/60">{coach.organization}</p>
            )}
            <p className="text-xs text-black/40 mt-0.5">
              {coach.location} · {coach.years_coaching}yr coaching ·{" "}
              {coach.events?.join(", ") ?? "—"} ·{" "}
              {coach.starting_price ? `$${coach.starting_price}/${coach.billing_cadence}` : "no price"}
            </p>
            {coach.short_bio && (
              <p className="text-sm text-black/70 mt-2 line-clamp-2 leading-relaxed">
                {coach.short_bio}
              </p>
            )}
            {coach.rejection_reason && (
              <p className="text-xs text-red-600 mt-2">
                Rejection reason: {coach.rejection_reason}
              </p>
            )}
            <p className="text-xs text-black/30 mt-2">
              Applied {new Date(coach.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>

          {/* Right: actions */}
          {status === "pending" && (
            <div className="flex gap-2 sm:flex-col flex-shrink-0">
              <button
                onClick={handleApprove}
                disabled={loading}
                className="px-4 py-2 bg-[#007B6F] text-white text-xs font-semibold hover:bg-[#005a51] transition-colors disabled:opacity-50"
              >
                {loading ? "..." : "Approve"}
              </button>
              <button
                onClick={() => setRejectOpen(true)}
                disabled={loading}
                className="px-4 py-2 border-2 border-red-400 text-red-600 text-xs font-semibold hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function TabButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
        active ? "border-black text-black" : "border-transparent text-black/40 hover:text-black"
      }`}
    >
      {label}
      <span className={`ml-1.5 text-xs ${active ? "text-black/50" : "text-black/30"}`}>
        {count}
      </span>
    </button>
  );
}

export function AdminCoachList({ coaches }: { coaches: CoachRow[] }) {
  const [tab, setTab] = useState<"pending" | "approved" | "rejected" | "all">("pending");

  const filtered = tab === "all" ? coaches : coaches.filter((c) => c.status === tab);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-anton)" }}>
          COACH APPLICATIONS
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b-2 border-black/10 mb-6">
        <TabButton label="Pending"  count={coaches.filter((c) => c.status === "pending").length}  active={tab === "pending"}  onClick={() => setTab("pending")}  />
        <TabButton label="Approved" count={coaches.filter((c) => c.status === "approved").length} active={tab === "approved"} onClick={() => setTab("approved")} />
        <TabButton label="Rejected" count={coaches.filter((c) => c.status === "rejected").length} active={tab === "rejected"} onClick={() => setTab("rejected")} />
        <TabButton label="All"      count={coaches.length}                                         active={tab === "all"}      onClick={() => setTab("all")}      />
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-black/40 py-12 text-center">
          No {tab === "all" ? "" : tab} coaches.
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((coach) => (
            <CoachRow key={coach.id} coach={coach} />
          ))}
        </div>
      )}
    </div>
  );
}
