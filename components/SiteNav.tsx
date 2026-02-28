"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Globe, Plane, Trophy } from "lucide-react";

const NAV_LINKS = [
  { href: "/",            label: "Countries",   icon: Globe },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/charts",      label: "Charts",      icon: BarChart3 },
  { href: "/visa",        label: "Visa Globe",  icon: Plane },
];

export default function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500 text-[10px] font-black tracking-widest text-black">
            PB
          </div>
          <span className="hidden text-sm font-semibold text-zinc-100 sm:inline-block">
            Passport Index
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {NAV_LINKS.filter((l) => l.href !== pathname).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-medium text-zinc-500 transition hover:bg-zinc-800/60 hover:text-zinc-200 md:inline-flex"
            >
              <link.icon className="h-3.5 w-3.5" />
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
