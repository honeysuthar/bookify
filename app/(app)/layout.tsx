"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, Home, Store, BookMarked, Notebook, Bell, LogOut, ChevronDown, BarChart2, User, Award, Dna, Settings } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

const navItems = [
  { href: "/dashboard", label: "Hearth", icon: Home },
  { href: "/discover", label: "Town Bookstore", icon: Store },
  { href: "/library", label: "My Shelf", icon: BookMarked },
  { href: "/journal", label: "Reading Journal", icon: Notebook },
];

function UserMenu() {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initial = session?.user?.name?.[0]?.toUpperCase() ?? "?";
  const avatarUrl = session?.user?.image;

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 group"
        aria-label="User menu"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={session?.user?.name ?? "User"}
            className="w-8 h-8 rounded-full object-cover border border-[#c9a87a]/40 hover:border-[#c9a87a] transition-colors"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#c9a87a] text-[#0f0705] flex items-center justify-center font-bold text-sm hover:bg-[#f0dfc0] transition-colors">
            {initial}
          </div>
        )}
        <ChevronDown className={`h-3.5 w-3.5 text-[#5a3a22] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-[#2a1508] bg-[#160a05] shadow-xl shadow-black/60 py-1 z-50">
          <div className="px-4 py-2.5 border-b border-[#2a1508]">
            <p className="text-sm font-semibold text-[#f0dfc0] truncate">{session?.user?.name}</p>
            <p className="text-xs text-[#5a3a22] truncate">{session?.user?.email}</p>
          </div>
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#c9a87a] hover:bg-[#2a1508]/60 transition-colors"
          >
            <User className="h-4 w-4" />
            Your Profile
          </Link>
          <Link
            href="/stats"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#c9a87a] hover:bg-[#2a1508]/60 transition-colors"
          >
            <BarChart2 className="h-4 w-4" />
            Analytics & Heatmap
          </Link>
          <Link
            href="/dna"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#c9a87a] hover:bg-[#2a1508]/60 transition-colors"
          >
            <Dna className="h-4 w-4" />
            Reading DNA
          </Link>
          <Link
            href="/achievements"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#c9a87a] hover:bg-[#2a1508]/60 transition-colors"
          >
            <Award className="h-4 w-4" />
            Achievements
          </Link>
          <Link
            href="/journal"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#c9a87a] hover:bg-[#2a1508]/60 transition-colors"
          >
            <Notebook className="h-4 w-4" />
            Reading Journal
          </Link>
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#c9a87a] hover:bg-[#2a1508]/60 transition-colors"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <div className="border-t border-[#2a1508] mt-1 pt-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-950/30 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-[#0f0705] text-[#e8d5c0] flex flex-col font-sans">
      {/* Top nav (desktop) */}
      <header
        className="hidden md:flex items-center justify-between px-6 py-3.5 fixed top-0 left-0 right-0 z-[100] bg-[#0f0705]/50 backdrop-blur-md border-b border-white/10 shadow-sm shadow-black/20 transition-all"
      >
        <div className="flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]" />
          <span className="font-serif font-bold text-lg tracking-wide text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">Bookify</span>
        </div>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all rounded-lg relative ${
                  isActive
                    ? "text-white after:absolute after:-bottom-3.5 after:left-0 after:right-0 after:h-[2px] after:bg-white after:rounded-t-full"
                    : "text-white/75 hover:text-white"
                }`}
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/stats"
            className="p-1.5 rounded-lg text-white/75 hover:text-white transition-all relative"
            title="Reading Analytics & Heatmap"
            aria-label="Reading Analytics & Heatmap"
          >
            <BarChart2 className="h-5 w-5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]" />
          </Link>
          <Link
            href="/notifications"
            className="p-1.5 rounded-lg text-white/75 hover:text-white transition-all relative"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]" />
          </Link>
          <UserMenu />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pb-20 md:pb-0">{children}</main>

      {/* Bottom nav (mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0f0705]/50 backdrop-blur-md border-t border-white/10 flex items-center justify-around px-2 py-3 text-[#c9a87a]">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-all ${
                isActive ? "text-[#c9a87a] font-semibold" : "text-white/60 hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
        {/* Mobile Stats / Analytics */}
        <Link
          href="/stats"
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-all ${
            pathname === "/stats" ? "text-[#c9a87a] font-semibold" : "text-white/60 hover:text-white"
          }`}
        >
          <BarChart2 className="h-5 w-5" />
          <span className="text-[10px] font-medium">Stats</span>
        </Link>
        {/* Mobile Profile */}
        <Link
          href="/profile"
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-all ${
            pathname === "/profile" ? "text-[#c9a87a] font-semibold" : "text-white/60 hover:text-white"
          }`}
        >
          <User className="h-5 w-5" />
          <span className="text-[10px] font-medium">You</span>
        </Link>
      </nav>
    </div>
  );
}
