"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import {
  LayoutDashboard,
  Users,
  FileText,
  Video,
  MessageSquare,
  Package,
  User,
  CreditCard,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/coach/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/coach/athletes", label: "Athletes", icon: Users },
  { href: "/coach/applications", label: "Applications", icon: FileText },
  { href: "/coach/plans", label: "Training Plans", icon: Package },
  { href: "/coach/videos", label: "Video Review", icon: Video },
  { href: "/coach/messages", label: "Messages", icon: MessageSquare },
  { href: "/coach/offers", label: "Offers", icon: CreditCard },
  { href: "/coach/profile", label: "My Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function CoachSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 border-r-2 border-black min-h-screen flex-shrink-0 bg-[#D7D7D7]">
      <div className="p-4 border-b-2 border-black">
        <Logo size="sm" />
        <p className="text-xs text-black/50 mt-0.5 uppercase tracking-wider">Coach</p>
      </div>
      <nav className="p-3 space-y-0.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-black text-[#D7D7D7]"
                  : "text-black hover:bg-black/10"
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
