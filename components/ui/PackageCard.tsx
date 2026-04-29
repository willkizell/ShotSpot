import { Button } from "./Button";

export interface PackageCardData {
  id: string;
  name: string;
  description: string;
  price: number;
  billing_cadence: "monthly" | "weekly" | "one_time";
  includes_training_plans: boolean;
  video_reviews_per_month: number | null;
  messaging_access: "none" | "limited" | "unlimited";
  call_access: "none" | "monthly" | "biweekly" | "weekly";
  athlete_cap: number | null;
  intake_mode: "instant_join" | "application_required";
}

const CADENCE_LABELS: Record<string, string> = {
  monthly: "/month",
  weekly: "/week",
  one_time: "one-time",
};

export function PackageCard({
  pkg,
  onSelect,
  isAuthenticated,
}: {
  pkg: PackageCardData;
  onSelect?: () => void;
  isAuthenticated?: boolean;
}) {
  const includedItems = [
    pkg.includes_training_plans && "Training plans",
    pkg.video_reviews_per_month
      ? `${pkg.video_reviews_per_month} video reviews/mo`
      : null,
    pkg.messaging_access !== "none" &&
      `${pkg.messaging_access === "unlimited" ? "Unlimited" : "Limited"} messaging`,
    pkg.call_access !== "none" &&
      `${pkg.call_access.charAt(0).toUpperCase() + pkg.call_access.slice(1)} calls`,
  ].filter(Boolean) as string[];

  return (
    <div className="border-2 border-black p-5">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-base">{pkg.name}</h3>
        <div className="text-right">
          <span className="text-2xl font-bold">${pkg.price}</span>
          <span className="text-sm text-black/50 ml-1">{CADENCE_LABELS[pkg.billing_cadence]}</span>
        </div>
      </div>
      <p className="text-sm text-black/70 mb-4">{pkg.description}</p>

      {includedItems.length > 0 && (
        <ul className="space-y-1.5 mb-5">
          {includedItems.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm">
              <div className="w-1.5 h-1.5 bg-[#007B6F] flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      )}

      {pkg.athlete_cap && (
        <p className="text-xs text-black/40 mb-4">Limited to {pkg.athlete_cap} athletes</p>
      )}

      <Button
        variant={pkg.intake_mode === "instant_join" ? "accent" : "secondary"}
        className="w-full"
        onClick={onSelect}
      >
        {pkg.intake_mode === "instant_join" ? "Join now" : "Apply"}
      </Button>
    </div>
  );
}
