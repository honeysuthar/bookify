"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flame, Target, BookOpen } from "lucide-react";

// Palette for the book spines — cycles through warm/sage/terra
const SPINE_PALETTE = [
  { bg: "#7ba892", text: "text-white/80" },
  { bg: "#c9695a", text: "text-white/80" },
  { bg: "#e0b364", text: "text-[#241407]" },
  { bg: "#a0785a", text: "text-white/80" },
  { bg: "#8a6a9a", text: "text-white/80" },
];

interface CinematicHeroProps {
  activeEntry?: any;
  libraryEntries?: any[];
  streakLogs?: any[];
  readDays?: Set<number>;
  todayDay?: number;
  year?: number;
  month?: number;
  monthDays?: number[];
  firstDayOffset?: number;
  finishedThisMonth?: number;
  pagesReadThisMonth?: number;
  goalProgress?: number;
  recommendedBooksResponse?: any;
  onOpenLogModal?: () => void;
}

export default function CinematicHero({
  activeEntry,
  libraryEntries = [],
  streakLogs,
  readDays,
  todayDay,
  year,
  month,
  monthDays,
  firstDayOffset,
  finishedThisMonth = 0,
  pagesReadThisMonth = 0,
  goalProgress = 0,
  onOpenLogModal,
}: CinematicHeroProps) {
  const triggerRef = useRef<HTMLElement>(null);
  const interiorRef = useRef<HTMLDivElement>(null);
  const shelfZoneRef = useRef<HTMLDivElement>(null);
  const deskZoneRef = useRef<HTMLDivElement>(null);
  const badgeZoneRef = useRef<HTMLDivElement>(null);
  const [plaqueOpen, setPlaqueOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any = null;

    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const trigger = triggerRef.current;
        if (!trigger) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2,
            invalidateOnRefresh: true,
            onUpdate: () => {
              // Reliably toggle pointer-events based on live opacity
              const shelf = shelfZoneRef.current;
              const desk  = deskZoneRef.current;
              const badge = badgeZoneRef.current;
              if (shelf) {
                const op = shelf.style.opacity !== "" ? parseFloat(shelf.style.opacity) : 1;
                shelf.style.pointerEvents = op > 0.1 ? "auto" : "none";
              }
              if (desk) {
                const op = desk.style.opacity !== "" ? parseFloat(desk.style.opacity) : 0;
                desk.style.pointerEvents = op > 0.1 ? "auto" : "none";
              }
              if (badge) {
                const op = badge.style.opacity !== "" ? parseFloat(badge.style.opacity) : 0;
                badge.style.pointerEvents = op > 0.1 ? "auto" : "none";
              }
            },
          },
        });

        /* ── CAMERA DRIFT INSIDE THE INTERIOR (0-100) ── */
        tl.to(interiorRef.current, { scale: 1.15, ease: "none", duration: 100 }, 0);

        /* ── ZONE 1: Currently Reading Shelf (Starts fully active at scroll 0) ── */
        tl.to(shelfZoneRef.current, { scale: 1.04, y: "-2vh", ease: "none", duration: 18 }, 0);
        tl.to(shelfZoneRef.current, { opacity: 0, scale: 1.18, y: "-14vh", ease: "power2.in", duration: 12 }, 18);

        /* ── ZONE 2: Calendar & Stats (Desk Zone) ── */
        tl.fromTo(deskZoneRef.current,
          { opacity: 0, scale: 0.88, y: "10vh" },
          { opacity: 1, scale: 1.0, y: "0vh", ease: "power2.out", duration: 10 },
          28
        );
        tl.to(deskZoneRef.current, { scale: 1.03, y: "-2vh", ease: "none", duration: 22 }, 38);
        tl.to(deskZoneRef.current, { opacity: 0, scale: 1.18, y: "-14vh", ease: "power2.in", duration: 10 }, 60);

        /* ── ZONE 3: Reader Badge & Stats ── */
        tl.fromTo(badgeZoneRef.current,
          { opacity: 0, scale: 0.88, y: "10vh" },
          { opacity: 1, scale: 1.0, y: "0vh", ease: "power2.out", duration: 10 },
          68
        );
        tl.to(badgeZoneRef.current, { scale: 1.02, y: "-1vh", ease: "none", duration: 22 }, 78);
      });
    };

    init();
    return () => ctx?.revert();
  }, []);

  const progressPercent = activeEntry?.book.pageCount
    ? Math.round((activeEntry.currentPage / activeEntry.book.pageCount) * 100)
    : 0;

  return (
    <section ref={triggerRef} style={{ position: "relative", height: "450vh", width: "100%" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          overflow: "hidden",
          backgroundImage: "url('/interior.png')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      >
        {/* LAYER 10 — INTERIOR (HEARTH BACKGROUND) */}
        <div
          ref={interiorRef}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/interior.png')",
            zIndex: 10,
            pointerEvents: "none",
            willChange: "transform",
            opacity: 1,
            transform: "scale(1)",
            transformOrigin: "center center",
          }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        </div>

        {/* LAYER 50 — ZONES (UI OVERLAYS IN THE SCENE) */}
        <div style={{ position: "absolute", inset: 0, zIndex: 50, overflow: "hidden" }}>
          
          {/* ZONE 1: PHYSICAL BOOKSHELF (CURRENTLY READING) */}
          <div
            ref={shelfZoneRef}
            className="absolute inset-0 flex flex-col items-center justify-center px-4"
            style={{
              pointerEvents: "auto",
              opacity: 1,
              transform: "translateY(0vh) scale(1)",
              willChange: "transform, opacity",
            }}
          >
            <div className="w-full max-w-2xl mt-32">

              {/* Shelf — real books from library alongside the active read */}
              {(() => {
                // Other books in the library (not the active one), up to 4
                const sideBooks = libraryEntries
                  .filter((e) => e.id !== activeEntry?.id)
                  .slice(0, 4);
                const leftBooks  = sideBooks.slice(0, 2);
                const rightBooks = sideBooks.slice(2, 4);
                return (
                  <div className="relative flex items-end justify-center px-8 pb-4 h-64 border-b-[16px] border-[#4a2e18] shadow-[0_20px_40px_rgba(0,0,0,0.8)] rounded-sm bg-gradient-to-t from-black/60 to-transparent">

                    {/* Left side books */}
                    {leftBooks.map((entry, i) => {
                      const heights = ["h-40", "h-44"];
                      const widths  = ["w-28", "w-32"];
                      return (
                        <Link key={entry.id} href={`/book/${entry.book.externalId || entry.book.id}`}
                          className={`relative ${widths[i]} ${heights[i]} rounded shadow-[0_4px_12px_rgba(0,0,0,0.5)] ${i === 0 ? "mr-2" : "mr-6"} mb-1 flex-shrink-0 cursor-pointer hover:-translate-y-2 hover:scale-105 transition-all duration-300 pointer-events-auto block overflow-hidden bg-[#1c0d06]`}
                        >
                          {entry.book.coverUrl ? (
                            <Image src={entry.book.coverUrl} alt="Cover" fill className="object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full"><BookOpen className="text-white/20 w-6 h-6" /></div>
                          )}
                        </Link>
                      );
                    })}

                    {/* Currently Reading Cover — click to toggle info plaque */}
                    <button
                      onClick={() => setPlaqueOpen(v => !v)}
                      className="relative z-10 w-44 h-64 bg-[#1c0d06] rounded shadow-[0_0_30px_rgba(0,0,0,0.9),_inset_0_0_0_1px_rgba(255,255,255,0.2)] hover:-translate-y-3 hover:scale-105 transition-all duration-300 overflow-hidden flex-shrink-0 pointer-events-auto block cursor-pointer"
                    >
                      {activeEntry?.book?.coverUrl ? (
                        <Image src={activeEntry.book.coverUrl} alt="Cover" fill className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full"><BookOpen className="text-white/20 w-8 h-8" /></div>
                      )}
                      {/* Reading progress badge */}
                      {activeEntry && (
                        <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/70">
                          <div className="h-full bg-gradient-to-r from-[#c9695a] to-[#e0b364]" style={{ width: `${progressPercent}%` }} />
                        </div>
                      )}
                      {/* Tap hint */}
                      {!plaqueOpen && (
                        <div className="absolute inset-0 flex items-end justify-center pb-8 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <span className="text-white text-[11px] font-bold tracking-wider uppercase">Tap to open</span>
                        </div>
                      )}
                    </button>

                    {/* Right side books */}
                    {rightBooks.map((entry, i) => {
                      const heights = ["h-44", "h-36"];
                      const widths  = ["w-32", "w-24"];
                      return (
                        <Link key={entry.id} href={`/book/${entry.book.externalId || entry.book.id}`}
                          className={`relative ${widths[i]} ${heights[i]} rounded shadow-[0_4px_12px_rgba(0,0,0,0.5)] ${i === 0 ? "ml-6" : "ml-2"} mb-1 flex-shrink-0 cursor-pointer hover:-translate-y-2 hover:scale-105 transition-all duration-300 pointer-events-auto block overflow-hidden bg-[#1c0d06]`}
                        >
                          {entry.book.coverUrl ? (
                            <Image src={entry.book.coverUrl} alt="Cover" fill className="object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full"><BookOpen className="text-white/20 w-6 h-6" /></div>
                          )}
                        </Link>
                      );
                    })}

                  </div>
                );
              })()}

              {/* Plaque — only visible after clicking the book cover */}
              <div
                className="mx-auto mt-6 w-11/12 bg-gradient-to-b from-[#2e1b0f]/95 to-[#1c110a]/95 backdrop-blur-md rounded-xl border border-[#c9a87a]/30 p-6 shadow-[0_20px_40px_rgba(0,0,0,0.6)] text-center text-[#f6ecdd] relative overflow-hidden transition-all duration-500 ease-out"
                style={{
                  maxHeight: plaqueOpen ? "280px" : "0px",
                  opacity: plaqueOpen ? 1 : 0,
                  paddingTop: plaqueOpen ? undefined : "0",
                  paddingBottom: plaqueOpen ? undefined : "0",
                  borderWidth: plaqueOpen ? undefined : "0",
                  pointerEvents: plaqueOpen ? "auto" : "none",
                }}
              >
                {/* Close button */}
                <button
                  onClick={() => setPlaqueOpen(false)}
                  className="absolute top-3 right-3 text-[#a6907c] hover:text-[#f6ecdd] transition-colors text-lg leading-none"
                >
                  ✕
                </button>

                <p className="text-[10px] tracking-widest text-[#a6907c] uppercase font-bold mb-1">Currently Reading</p>
                <h3 className="text-3xl font-serif font-bold leading-tight">{activeEntry ? activeEntry.book.title : "Your shelf is empty"}</h3>
                <p className="italic font-serif text-[#c9b8a6] text-sm mt-1 mb-5">by {activeEntry?.book?.authors?.map((a: any) => a.author.name).join(", ") || "Unknown"}</p>

                {activeEntry && (
                  <div className="max-w-xs mx-auto">
                    <div className="flex justify-between text-xs text-[#a6907c] font-medium mb-1">
                      <span>{progressPercent}% completed</span>
                      <span>{activeEntry.currentPage} / {activeEntry.book.pageCount} p</span>
                    </div>
                    <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden shadow-inner mb-5">
                      <div className="h-full bg-gradient-to-r from-[#c9695a] to-[#e0b364]" style={{ width: `${progressPercent}%` }} />
                    </div>
                    <button onClick={onOpenLogModal} className="mx-auto flex items-center justify-center gap-2 bg-[#e0b364] hover:bg-[#ebd095] text-[#241509] font-bold px-5 py-2.5 rounded-lg text-sm transition-transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg">
                      Continue Reading <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>


          {/* ZONE 2: DESK ALCOVE (CALENDAR & STATS) */}
          <div ref={deskZoneRef} className="absolute inset-0 flex flex-col md:flex-row items-center justify-center gap-6 opacity-0 px-4 md:px-10" style={{ pointerEvents: "none" }}>

            {/* ── CALENDAR CARD ── dark wood with ivy vines */}
            <div className="w-full md:w-[360px] bg-[#1e1108] rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.7)] border border-[#3a2212] relative overflow-hidden flex-shrink-0">

              {/* Left ivy vine decoration */}
              <div className="absolute left-0 top-0 bottom-0 w-14 pointer-events-none select-none opacity-80 overflow-hidden">
                <svg viewBox="0 0 50 400" className="w-full h-full" fill="none" preserveAspectRatio="xMinYMid slice">
                  {/* Stems */}
                  <path d="M15,-10 C35,60 -5,140 20,220 C45,300 -10,360 15,420" stroke="#3d4f2d" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M30,-10 C5,80 40,160 15,250 C-10,340 35,380 20,420" stroke="#2c3a20" strokeWidth="1.5" strokeLinecap="round" />
                  
                  {/* Detailed Leaves using Q (quadratic) curves for realistic leaf shapes */}
                  {/* Top cluster */}
                  <path d="M18,15 Q35,5 40,20 Q30,30 18,15" fill="#52703f" />
                  <path d="M18,15 Q5,5 0,20 Q10,30 18,15" fill="#415932" />
                  <path d="M22,35 Q40,25 45,40 Q35,50 22,35" fill="#63854c" />
                  
                  {/* Mid-top */}
                  <path d="M10,70 Q-5,60 0,75 Q5,90 10,70" fill="#3a522c" />
                  <path d="M25,85 Q45,75 50,90 Q40,105 25,85" fill="#52703f" />
                  <path d="M12,110 Q25,95 30,115 Q20,125 12,110" fill="#415932" />
                  
                  {/* Middle */}
                  <path d="M18,150 Q0,135 5,155 Q10,170 18,150" fill="#63854c" />
                  <path d="M25,175 Q45,160 48,180 Q35,195 25,175" fill="#3a522c" />
                  
                  {/* Lower-mid */}
                  <path d="M10,210 Q-5,195 0,215 Q5,230 10,210" fill="#52703f" />
                  <path d="M28,230 Q48,215 50,235 Q40,250 28,230" fill="#415932" />
                  <path d="M15,260 Q30,245 35,265 Q25,280 15,260" fill="#63854c" />
                  
                  {/* Bottom cluster */}
                  <path d="M20,310 Q0,295 5,315 Q15,330 20,310" fill="#3a522c" />
                  <path d="M25,340 Q45,325 48,345 Q35,360 25,340" fill="#52703f" />
                  <path d="M12,370 Q-5,355 0,375 Q10,390 12,370" fill="#415932" />
                  <path d="M22,390 Q40,375 45,395 Q30,410 22,390" fill="#63854c" />
                </svg>
              </div>

              <div className="pl-12 pr-5 pt-5 pb-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-serif text-3xl text-[#f6ecdd] font-bold tracking-tight">Calendar</h4>
                  {/* Small botanical sprig top-right */}
                  <svg viewBox="0 0 32 32" className="w-6 h-6 opacity-50" fill="none">
                    <path d="M16 28 C16 20 10 14 16 6" stroke="#6a9a64" strokeWidth="1.5" strokeLinecap="round"/>
                    <ellipse cx="10" cy="14" rx="5" ry="7" fill="#5a8a54" transform="rotate(-30 10 14)"/>
                    <ellipse cx="22" cy="18" rx="5" ry="7" fill="#6a9a64" transform="rotate(25 22 18)"/>
                  </svg>
                </div>

                {/* Divider with diamond */}
                <div className="flex items-center gap-2 my-3">
                  <div className="flex-1 h-px bg-[#e6be8c]/20" />
                  <div className="w-1.5 h-1.5 bg-[#e6be8c]/40 rotate-45 flex-shrink-0" />
                  <div className="flex-1 h-px bg-[#e6be8c]/20" />
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 text-center mb-2">
                  {["S","M","T","W","T","F","S"].map((d, i) => (
                    <div key={i} className="text-[11px] font-bold text-[#a6907c] py-1">{d}</div>
                  ))}
                </div>

                {/* Day grid */}
                <div className="grid grid-cols-7 gap-y-1 text-center">
                  {Array.from({ length: firstDayOffset || 0 }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {monthDays?.map((d) => {
                    const isRead  = readDays?.has(d);
                    const isToday = d === todayDay;
                    return (
                      <div key={d} className="flex items-center justify-center py-0.5">
                        <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors
                          ${isToday
                            ? "bg-[#e0b364] text-[#1c0d06] font-bold shadow-[0_0_12px_rgba(224,179,100,0.5)]"
                            : isRead
                            ? "border-2 border-[#c9695a] text-[#f1c9bc]"
                            : "text-[#c9b8a6] hover:text-[#f6ecdd]"}`
                        }>
                          {d}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Direct Link to Heatmap & Analytics */}
                <div className="mt-4 pt-3 border-t border-[#e6be8c]/15 text-center">
                  <Link
                    href="/stats"
                    className="inline-flex items-center gap-1.5 text-xs text-[#c9a87a] hover:text-[#f6ecdd] font-medium transition-colors"
                  >
                    View Reading Analytics & Heatmap <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* ── THIS MONTH STATS CARD ── parchment style */}
            <div className="w-full md:w-[300px] rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.6)] border border-[#c9a87a]/30 relative overflow-hidden flex-shrink-0"
              style={{ background: "linear-gradient(160deg, #e8dcc8 0%, #d4c4a8 60%, #c8b898 100%)" }}>

              {/* Quill top-right */}
              <div className="absolute top-3 right-4 opacity-40 pointer-events-none">
                <svg viewBox="0 0 24 48" className="w-5 h-10" fill="none">
                  <path d="M12 48 C12 30 20 20 18 4 C16 0 10 2 8 8 C6 14 10 22 12 48Z" fill="#8a6a40"/>
                  <path d="M12 48 C12 30 4 20 6 4" stroke="#a08050" strokeWidth="0.8"/>
                </svg>
              </div>
              {/* Vine bottom-right corner */}
              <div className="absolute bottom-3 right-4 opacity-30 pointer-events-none">
                <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
                  <path d="M40 40 C30 30 20 35 10 20 C5 12 15 5 25 10" stroke="#5a7a44" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                  <ellipse cx="12" cy="22" rx="5" ry="7" fill="#5a7a44" transform="rotate(20 12 22)"/>
                  <ellipse cx="28" cy="10" rx="5" ry="7" fill="#6a8a54" transform="rotate(-15 28 10)"/>
                </svg>
              </div>

              <div className="p-6">
                <h4 className="font-serif text-2xl text-[#3a2010] font-bold mb-1">This Month</h4>
                {/* Divider */}
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex-1 h-px bg-[#8a6040]/25"/>
                  <div className="w-1 h-1 bg-[#8a6040]/40 rotate-45 flex-shrink-0"/>
                  <div className="flex-1 h-px bg-[#8a6040]/25"/>
                </div>

                {/* Books finished */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-11 h-11 rounded-full bg-[#4a7a54] flex items-center justify-center flex-shrink-0 shadow-[0_4px_8px_rgba(0,0,0,0.2)]">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 text-sm text-[#4a2e18] font-medium">Books finished</div>
                  <div className="text-2xl font-serif font-bold text-[#2a1408]">{finishedThisMonth}</div>
                </div>

                {/* Pages read */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-11 h-11 rounded-full bg-[#c9695a] flex items-center justify-center flex-shrink-0 shadow-[0_4px_8px_rgba(0,0,0,0.2)]">
                    <Flame className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 text-sm text-[#4a2e18] font-medium">Pages read</div>
                  <div className="text-2xl font-serif font-bold text-[#2a1408]">{pagesReadThisMonth}</div>
                </div>

                {/* Monthly Goal */}
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#4a7a54] flex items-center justify-center flex-shrink-0 shadow-[0_4px_8px_rgba(0,0,0,0.2)]">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm text-[#4a2e18] font-medium">Monthly Goal</span>
                      <span className="text-sm font-bold text-[#2a1408]">{goalProgress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(90,50,20,0.15)" }}>
                      <div className="h-full bg-[#c9695a] rounded-full" style={{ width: `${goalProgress}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ZONE 3: READER BADGE & READING STATS */}
          <div ref={badgeZoneRef} className="absolute inset-0 flex flex-col md:flex-row items-center justify-center gap-6 opacity-0 px-4 md:px-12" style={{ pointerEvents: "none" }}>

            {/* Reader Archetype Badge */}
            {(() => {
              const finished    = libraryEntries?.filter((e: any) => e.status === "FINISHED").length || 0;
              const genreSet    = new Set((libraryEntries || []).flatMap((e: any) => e.book?.genres?.map((g: any) => g.genre?.name) || []));
              const hasStreak   = (streakLogs?.length || 0) >= 3;
              const isVoracious = finished >= 10;
              const isExplorer  = genreSet.size >= 3;
              const archetype = isVoracious
                ? { name: "The Voracious Reader", icon: "🔥", tags: ["Dedicated", "Consistent", "Prolific"], desc: "You devour books at a relentless pace. Your shelf is a monument to curiosity and commitment." }
                : isExplorer
                ? { name: "The Genre Explorer", icon: "🧭", tags: ["Curious", "Adventurous", "Open-minded"], desc: "You roam freely across genres, collecting worlds. Every book opens a new door for you." }
                : hasStreak
                ? { name: "The Streak Keeper", icon: "⚡", tags: ["Disciplined", "Steady", "Consistent"], desc: "You show up every day, page by page. The quiet dedication of a true reader." }
                : { name: "The Emerging Reader", icon: "🌱", tags: ["Curious", "Beginning", "Hopeful"], desc: "Your story is just beginning. Every book you finish adds a new layer to who you are." };
              return (
                <div className="w-full md:w-[360px] bg-[#2a1a10]/95 backdrop-blur-md rounded-2xl border border-[#e6be8c]/20 p-7 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-amber-400/10 blur-[50px] rounded-full pointer-events-none" />
                  <p className="text-[10px] tracking-widest text-[#a6907c] uppercase font-bold mb-4">Your Reader Identity</p>
                  <div className="flex items-start gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-[#1c0d06] border border-[#e6be8c]/20 flex items-center justify-center text-3xl flex-shrink-0 shadow-inner">
                      {archetype.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-xl font-bold text-[#f6ecdd] leading-tight">{archetype.name}</h3>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {archetype.tags.map((tag: string) => (
                          <span key={tag} className="text-[10px] font-bold bg-[#1c0d06] border border-[#3a2212] px-2.5 py-0.5 rounded-full text-[#c9a87a]">{tag}</span>
                        ))}
                      </div>
                      <p className="text-xs text-[#a6907c] mt-3 leading-relaxed">{archetype.desc}</p>
                    </div>
                  </div>
                  {/* Genre bar */}
                  <div className="mt-6 pt-5 border-t border-[#e6be8c]/10">
                    <div className="flex gap-1 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#c9a87a] rounded-l-full" style={{ width: `${Math.min(100, (finished / 20) * 100)}%` }} />
                      <div className="bg-[#c9695a]" style={{ width: `${Math.min(100, (genreSet.size / 8) * 100)}%` }} />
                      <div className="bg-[#7ba892] flex-1 rounded-r-full opacity-30" />
                    </div>
                    <div className="flex justify-between text-[10px] text-[#8a6040] mt-1.5">
                      <span>{finished} books finished</span>
                      <span>{genreSet.size} genres explored</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#e6be8c]/10 flex items-center justify-between">
                    <Link
                      href="/dna"
                      className="inline-flex items-center gap-1 text-[11px] text-[#c9a87a] hover:text-[#f6ecdd] transition-colors font-medium"
                    >
                      Reading DNA <ArrowRight className="w-3 h-3" />
                    </Link>
                    <Link
                      href="/achievements"
                      className="inline-flex items-center gap-1 text-[11px] text-[#c9a87a] hover:text-[#f6ecdd] transition-colors font-medium"
                    >
                      Achievements <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })()}

            {/* Reading Stats */}
            <div className="w-full md:w-[320px] bg-[#2a1a10]/95 backdrop-blur-md rounded-2xl border border-[#e6be8c]/20 p-7 shadow-2xl space-y-5">
              <p className="text-[10px] tracking-widest text-[#a6907c] uppercase font-bold">Reading Stats</p>

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#e0b364]/10 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-[#e0b364]" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-[#a6907c]">Books in Library</div>
                  <div className="text-2xl font-serif font-bold text-[#f6ecdd]">{libraryEntries?.length || 0}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#c9695a]/10 flex items-center justify-center flex-shrink-0">
                  <Flame className="w-5 h-5 text-[#c9695a]" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-[#a6907c]">Pages this month</div>
                  <div className="text-2xl font-serif font-bold text-[#f6ecdd]">{pagesReadThisMonth}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#7ba892]/10 flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-[#7ba892]" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-[#a6907c] mb-1.5">Monthly goal — {goalProgress}%</div>
                  <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#7ba892] to-[#e0b364]" style={{ width: `${goalProgress}%` }} />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#e0b364]/10 flex items-center justify-center flex-shrink-0 text-lg">
                  🏆
                </div>
                <div className="flex-1">
                  <div className="text-xs text-[#a6907c]">Finished this month</div>
                  <div className="text-2xl font-serif font-bold text-[#f6ecdd]">{finishedThisMonth}</div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/stats"
                  className="w-full py-2.5 px-3 rounded-lg bg-[#e0b364]/15 hover:bg-[#e0b364]/25 text-[#e0b364] flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors shadow-sm"
                >
                  Full Heatmap & Trends <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
