"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, Store, BookMarked, Notebook, Bell } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Hearth", icon: Home },
  { href: "/discover", label: "Town Bookstore", icon: Store },
  { href: "/library", label: "My Shelf", icon: BookMarked },
  { href: "/profile", label: "Reading Journal", icon: Notebook },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#0f0705] text-[#e8d5c0] flex flex-col font-sans">
      {/* Top nav (desktop) */}
      <header className="hidden md:flex items-center justify-between px-6 py-3.5 sticky top-0 z-40 bg-[#0f0705]/95 backdrop-blur-sm text-[#e8d5c0] border-b border-[#2a1508]/60" style={{ boxShadow: "0 1px 20px rgba(0,0,0,0.4)" }}>
        <div className="flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-[#c9a87a]" />
          <span className="font-serif font-bold text-lg tracking-wide text-[#f0dfc0]">Bookify</span>
        </div>
        
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all rounded-lg relative ${
                  isActive
                    ? "text-[#f0dfc0] after:absolute after:-bottom-3.5 after:left-0 after:right-0 after:h-[2px] after:bg-[#c9a87a] after:rounded-t-full"
                    : "text-[#5a3a22] hover:text-[#c9a87a]"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="flex items-center gap-4">
          <Link href="/notifications" className="p-1.5 rounded-lg text-[#5a3a22] hover:text-[#c9a87a] transition-all relative">
            <Bell className="h-5 w-5" />
          </Link>
          <Link href="/profile" className="w-8 h-8 rounded-full bg-[#c9a87a] text-[#0f0705] flex items-center justify-center font-bold text-sm shadow-sm hover:scale-105 transition-transform">
            U
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>

      {/* Bottom nav (mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0f0705] border-t border-[#2a1508] flex items-center justify-around px-2 py-3 text-[#5a3a22]">
        {navItems.map((item) => {
          const isActive = item.href === "/dashboard";
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-1 rounded-lg transition-all ${
                isActive ? "text-[#c9a87a]" : "text-[#5a3a22] hover:text-[#c9a87a]"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
