"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flame, Target, BookOpen, ChevronDown, Sparkles } from "lucide-react";

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
  year = new Date().getFullYear(),
  month = new Date().getMonth(),
  monthDays = [],
  firstDayOffset = 0,
  finishedThisMonth = 0,
  pagesReadThisMonth = 0,
  goalProgress = 0,
  recommendedBooksResponse,
  onOpenLogModal,
}: CinematicHeroProps) {
  const [plaqueOpen, setPlaqueOpen] = useState(true);

  const progressPercent = activeEntry?.book?.pageCount
    ? Math.round(((activeEntry.currentPage || 0) / activeEntry.book.pageCount) * 100)
    : 0;

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="w-full flex flex-col space-y-16 pb-24">
      {/* ── ZONE 1: HERO BOOKSHELF (CURRENTLY READING) ── */}
      <section className="min-h-[calc(100vh-4.5rem)] flex flex-col justify-between items-center pt-24 pb-8 px-4 relative">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
          
          {/* Subtle Hearth Ambient Tag */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-[#c9a87a]/30 text-[#f0dfc0] text-xs font-serif tracking-wide shadow-md backdrop-blur-sm mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#e0b364]" />
            <span>The Hearth Shelf</span>
          </div>

          {/* Physical Bookshelf */}
          {(() => {
            const sideBooks = libraryEntries
              .filter((e) => e.id !== activeEntry?.id)
              .slice(0, 4);
            const leftBooks = sideBooks.slice(0, 2);
            const rightBooks = sideBooks.slice(2, 4);

            return (
              <div className="w-full max-w-2xl relative flex items-end justify-center px-4 sm:px-8 pb-3 min-h-[260px] border-b-[16px] border-[#4a2e18] shadow-[0_20px_40px_rgba(0,0,0,0.8)] rounded-sm bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                
                {/* Left Books */}
                <div className="hidden sm:flex items-end mr-4 mb-0.5">
                  {leftBooks.map((entry, i) => {
                    const heights = ["h-36 sm:h-40", "h-40 sm:h-44"];
                    const widths = ["w-24 sm:w-28", "w-28 sm:w-32"];
                    return (
                      <Link
                        key={entry.id}
                        href={`/book/${entry.book.externalId || entry.book.id}`}
                        className={`relative ${widths[i]} ${heights[i]} rounded shadow-[0_4px_12px_rgba(0,0,0,0.6)] ${
                          i === 0 ? "mr-2" : "mr-4"
                        } flex-shrink-0 cursor-pointer hover:-translate-y-2 hover:scale-105 transition-all duration-300 block overflow-hidden bg-[#1c0d06] border border-white/10`}
                      >
                        {entry.book.coverUrl ? (
                          <Image src={entry.book.coverUrl} alt="Cover" fill className="object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <BookOpen className="text-white/20 w-6 h-6" />
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>

                {/* Center: Currently Reading Cover (Click to toggle plaque) */}
                <button
                  type="button"
                  onClick={() => setPlaqueOpen((v) => !v)}
                  className="relative z-10 w-36 sm:w-44 h-52 sm:h-64 bg-[#1c0d06] rounded shadow-[0_0_35px_rgba(0,0,0,0.95),_inset_0_0_0_1px_rgba(255,255,255,0.25)] hover:-translate-y-2 hover:scale-105 transition-all duration-300 overflow-hidden flex-shrink-0 cursor-pointer"
                  title="Click to toggle book details"
                >
                  {activeEntry?.book?.coverUrl ? (
                    <Image src={activeEntry.book.coverUrl} alt="Cover" fill className="object-cover" priority />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <BookOpen className="text-white/20 w-8 h-8" />
                    </div>
                  )}
                  {/* Progress Strip on cover */}
                  {activeEntry && (
                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/80">
                      <div
                        className="h-full bg-gradient-to-r from-[#c9695a] to-[#e0b364]"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  )}
                </button>

                {/* Right Books */}
                <div className="hidden sm:flex items-end ml-4 mb-0.5">
                  {rightBooks.map((entry, i) => {
                    const heights = ["h-40 sm:h-44", "h-32 sm:h-36"];
                    const widths = ["w-28 sm:w-32", "w-20 sm:w-24"];
                    return (
                      <Link
                        key={entry.id}
                        href={`/book/${entry.book.externalId || entry.book.id}`}
                        className={`relative ${widths[i]} ${heights[i]} rounded shadow-[0_4px_12px_rgba(0,0,0,0.6)] ${
                          i === 0 ? "ml-4" : "ml-2"
                        } flex-shrink-0 cursor-pointer hover:-translate-y-2 hover:scale-105 transition-all duration-300 block overflow-hidden bg-[#1c0d06] border border-white/10`}
                      >
                        {entry.book.coverUrl ? (
                          <Image src={entry.book.coverUrl} alt="Cover" fill className="object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <BookOpen className="text-white/20 w-6 h-6" />
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Interactive Info Plaque */}
          {activeEntry && (
            <div
              className={`w-full max-w-md mx-auto mt-6 bg-gradient-to-b from-[#2e1b0f]/95 to-[#1c110a]/95 backdrop-blur-md rounded-2xl border border-[#c9a87a]/40 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.7)] text-center text-[#f6ecdd] transition-all duration-300 ${
                plaqueOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none hidden"
              }`}
            >
              <p className="text-[10px] tracking-widest text-[#a6907c] uppercase font-bold mb-1">
                Currently Reading
              </p>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#f0dfc0] truncate px-2">
                {activeEntry.book.title}
              </h3>
              <p className="text-xs text-[#c9a87a] italic mt-0.5 mb-4">
                by {activeEntry.book.authors?.[0]?.author?.name || "Unknown Author"}
              </p>

              {/* Progress bar */}
              <div className="flex justify-between items-center text-xs text-[#a6907c] mb-1.5 px-1">
                <span>{progressPercent}% completed</span>
                <span>
                  {activeEntry.currentPage || 0} / {activeEntry.book.pageCount || "—"} p.
                </span>
              </div>
              <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden shadow-inner mb-5">
                <div
                  className="h-full bg-gradient-to-r from-[#c9695a] via-[#c9a87a] to-[#e0b364] transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Log Session Action */}
              <button
                type="button"
                onClick={onOpenLogModal}
                className="w-full sm:w-auto mx-auto flex items-center justify-center gap-2 bg-[#e0b364] hover:bg-[#ebd095] text-[#241509] font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg"
              >
                Continue Reading <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Scroll cue */}
        <div className="pt-8 flex flex-col items-center gap-1.5 text-white/50 animate-bounce">
          <span className="text-[11px] font-medium tracking-wider uppercase">Desk & Calendar</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </section>

      {/* ── ZONE 2: DESK ALCOVE (CALENDAR & MONTH STATS) ── */}
      <section className="w-full max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-stretch justify-center gap-6">
        {/* Botanical Ivy Calendar Card */}
        <div className="flex-1 bg-[#1e1108]/95 backdrop-blur-md rounded-3xl shadow-[0_24px_60px_rgba(0,0,0,0.7)] border border-[#3a2212] relative overflow-hidden flex flex-col justify-between">
          {/* Ivy vine decoration on left edge */}
          <div className="absolute left-0 top-0 bottom-0 w-12 pointer-events-none select-none opacity-80 overflow-hidden">
            <svg viewBox="0 0 50 400" className="w-full h-full" fill="none" preserveAspectRatio="xMinYMid slice">
              <path d="M15,-10 C35,60 -5,140 20,220 C45,300 -10,360 15,420" stroke="#3d4f2d" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M30,-10 C5,80 40,160 15,250 C-10,340 35,380 20,420" stroke="#2c3a20" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M18,15 Q35,5 40,20 Q30,30 18,15" fill="#52703f" />
              <path d="M22,35 Q40,25 45,40 Q35,50 22,35" fill="#63854c" />
              <path d="M10,70 Q-5,60 0,75 Q5,90 10,70" fill="#3a522c" />
              <path d="M25,85 Q45,75 50,90 Q40,105 25,85" fill="#52703f" />
              <path d="M18,150 Q0,135 5,155 Q10,170 18,150" fill="#63854c" />
              <path d="M10,210 Q-5,195 0,215 Q5,230 10,210" fill="#52703f" />
              <path d="M28,230 Q48,215 50,235 Q40,250 28,230" fill="#415932" />
              <path d="M20,310 Q0,295 5,315 Q15,330 20,310" fill="#3a522c" />
              <path d="M25,340 Q45,325 48,345 Q35,360 25,340" fill="#52703f" />
            </svg>
          </div>

          <div className="pl-12 pr-6 pt-6 pb-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-serif text-2xl font-bold text-[#f0dfc0]">Reading Calendar</h4>
                <p className="text-xs text-[#a6907c]">{monthNames[month]} {year}</p>
              </div>
              <span className="p-2 rounded-xl bg-[#c9a87a]/15 text-[#c9a87a]">
                <Flame className="w-5 h-5" />
              </span>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-2 my-4">
              <div className="flex-1 h-px bg-[#e6be8c]/20" />
              <div className="w-1.5 h-1.5 bg-[#e6be8c]/40 rotate-45 flex-shrink-0" />
              <div className="flex-1 h-px bg-[#e6be8c]/20" />
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 text-center mb-2">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <div key={i} className="text-[11px] font-bold text-[#8a6040] py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-y-1 text-center">
              {Array.from({ length: firstDayOffset || 0 }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {monthDays?.map((d) => {
                const isRead = readDays?.has(d);
                const isToday = d === todayDay;
                return (
                  <div key={d} className="flex items-center justify-center py-0.5">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-xs sm:text-sm font-medium transition-colors ${
                        isToday
                          ? "bg-[#e0b364] text-[#1c0d06] font-bold shadow-[0_0_12px_rgba(224,179,100,0.5)]"
                          : isRead
                          ? "border-2 border-[#c9695a] text-[#f1c9bc] bg-[#c9695a]/20 font-bold"
                          : "text-[#c9b8a6]/70 hover:text-[#f6ecdd]"
                      }`}
                    >
                      {d}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Link to Analytics */}
            <div className="mt-6 pt-3 border-t border-[#e6be8c]/15 text-center">
              <Link
                href="/stats"
                className="inline-flex items-center gap-1.5 text-xs text-[#c9a87a] hover:text-[#f6ecdd] font-medium transition-colors"
              >
                View Reading Analytics & Heatmap <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* This Month Stats Card */}
        <div
          className="w-full md:w-[320px] rounded-3xl shadow-[0_24px_60px_rgba(0,0,0,0.6)] border border-[#c9a87a]/40 p-6 flex flex-col justify-between"
          style={{
            background: "linear-gradient(160deg, #e8dcc8 0%, #d4c4a8 60%, #c8b898 100%)",
          }}
        >
          <div>
            <h4 className="font-serif text-2xl text-[#3a2010] font-bold mb-1">This Month</h4>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex-1 h-px bg-[#8a6040]/30" />
              <div className="w-1.5 h-1.5 bg-[#8a6040]/50 rotate-45 flex-shrink-0" />
              <div className="flex-1 h-px bg-[#8a6040]/30" />
            </div>

            {/* Books finished */}
            <div className="flex items-center gap-4 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-[#4a7a54] flex items-center justify-center flex-shrink-0 shadow-md">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-sm text-[#4a2e18] font-medium">Books Finished</div>
              <div className="text-2xl font-serif font-bold text-[#2a1408]">{finishedThisMonth}</div>
            </div>

            {/* Pages read */}
            <div className="flex items-center gap-4 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-[#c9695a] flex items-center justify-center flex-shrink-0 shadow-md">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-sm text-[#4a2e18] font-medium">Pages Read</div>
              <div className="text-2xl font-serif font-bold text-[#2a1408]">{pagesReadThisMonth}</div>
            </div>

            {/* Monthly Goal Progress */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-[#4a7a54] flex items-center justify-center flex-shrink-0 shadow-md">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-[#4a2e18] font-semibold">Monthly Goal</span>
                  <span className="text-xs font-bold text-[#2a1408]">{goalProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden bg-black/15">
                  <div
                    className="h-full bg-[#c9695a] rounded-full transition-all duration-500"
                    style={{ width: `${goalProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#8a6040]/20 text-center">
            <Link
              href="/library"
              className="text-xs font-bold text-[#4a2e18] hover:text-black inline-flex items-center gap-1 transition-colors"
            >
              Browse Library Shelf <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── ZONE 3: READER PERSONA & QUICK DESTINATIONS ── */}
      <section className="w-full max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-stretch justify-center gap-6">
        {/* Reader Archetype */}
        {(() => {
          const finished = libraryEntries?.filter((e: any) => e.status === "FINISHED").length || 0;
          const genreSet = new Set(
            (libraryEntries || []).flatMap((e: any) => e.book?.genres?.map((g: any) => g.genre?.name) || [])
          );
          const hasStreak = (streakLogs?.length || 0) >= 3;
          const isVoracious = finished >= 10;
          const isExplorer = genreSet.size >= 3;
          const archetype = isVoracious
            ? {
                name: "The Voracious Reader",
                icon: "🔥",
                tags: ["Dedicated", "Consistent", "Prolific"],
                desc: "You devour books at a relentless pace. Your shelf is a monument to curiosity and commitment.",
              }
            : isExplorer
            ? {
                name: "The Genre Explorer",
                icon: "🧭",
                tags: ["Curious", "Adventurous", "Open-minded"],
                desc: "You roam freely across genres, collecting worlds. Every book opens a new door for you.",
              }
            : hasStreak
            ? {
                name: "The Streak Keeper",
                icon: "⚡",
                tags: ["Disciplined", "Steady", "Consistent"],
                desc: "You show up every day, page by page. The quiet dedication of a true reader.",
              }
            : {
                name: "The Emerging Reader",
                icon: "🌱",
                tags: ["Curious", "Beginning", "Hopeful"],
                desc: "Your story is just beginning. Every book you finish adds a new layer to who you are.",
              };

          return (
            <div className="flex-1 bg-[#1e1108]/95 backdrop-blur-md rounded-3xl border border-[#c9a87a]/30 p-7 shadow-2xl flex flex-col justify-between">
              <div>
                <p className="text-[10px] tracking-widest text-[#a6907c] uppercase font-bold mb-3">
                  Reader Archetype
                </p>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{archetype.icon}</span>
                  <h4 className="font-serif text-2xl font-bold text-[#f0dfc0]">{archetype.name}</h4>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {archetype.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-0.5 rounded-full bg-[#c9a87a]/15 text-[#c9a87a] text-[10px] font-semibold"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-[#a6907c] leading-relaxed">{archetype.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#e6be8c]/10 flex items-center justify-between">
                <Link
                  href="/dna"
                  className="inline-flex items-center gap-1 text-xs text-[#c9a87a] hover:text-[#f6ecdd] transition-colors font-medium"
                >
                  Reading DNA <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/achievements"
                  className="inline-flex items-center gap-1 text-xs text-[#c9a87a] hover:text-[#f6ecdd] transition-colors font-medium"
                >
                  Achievements <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })()}

        {/* Quick Reading Stats */}
        <div className="w-full md:w-[320px] bg-[#1e1108]/95 backdrop-blur-md rounded-3xl border border-[#c9a87a]/30 p-7 shadow-2xl flex flex-col justify-between space-y-4">
          <div>
            <p className="text-[10px] tracking-widest text-[#a6907c] uppercase font-bold mb-4">
              All-Time Stats
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#c9a87a]/15 flex items-center justify-center flex-shrink-0 text-[#c9a87a]">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[#a6907c]">Total Books in Library</p>
                  <p className="text-xl font-serif font-bold text-[#f0dfc0]">{libraryEntries?.length || 0}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#e0b364]/15 flex items-center justify-center flex-shrink-0 text-[#e0b364]">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[#a6907c]">Pages Read this Month</p>
                  <p className="text-xl font-serif font-bold text-[#f0dfc0]">{pagesReadThisMonth}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/stats"
              className="w-full py-2.5 px-3 rounded-xl bg-[#e0b364] hover:bg-[#ebd095] text-[#1c0d06] flex items-center justify-center gap-1.5 text-xs font-bold transition-colors shadow-md"
            >
              Full Heatmap & Trends <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── ZONE 4: CURATED RECOMMENDATIONS ── */}
      {recommendedBooksResponse?.items && recommendedBooksResponse.items.length > 0 && (
        <section className="w-full max-w-4xl mx-auto px-4 pt-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#f0dfc0]">
                Curated for Your Hearth
              </h3>
              <p className="text-xs text-[#a6907c]">Trending titles from the Town Bookstore</p>
            </div>
            <Link
              href="/discover"
              className="text-xs text-[#c9a87a] hover:text-[#f0dfc0] font-medium flex items-center gap-1"
            >
              Visit Bookstore <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {recommendedBooksResponse.items.slice(0, 6).map((book: any) => {
              const cover = book.volumeInfo?.imageLinks?.thumbnail || book.volumeInfo?.imageLinks?.smallThumbnail;
              return (
                <Link
                  key={book.id}
                  href={`/book/${book.id}`}
                  className="group rounded-xl overflow-hidden bg-[#160a05]/80 border border-[#2a1508] p-2 flex flex-col gap-2 hover:border-[#c9a87a]/50 transition-all hover:-translate-y-1 shadow-lg"
                >
                  <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden bg-[#0f0705]">
                    {cover ? (
                      <Image src={cover} alt={book.volumeInfo?.title || "Book"} fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <BookOpen className="w-6 h-6 text-white/20" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-serif font-bold text-[#f0dfc0] truncate group-hover:text-[#e0b364] transition-colors">
                    {book.volumeInfo?.title}
                  </p>
                  <p className="text-[10px] text-[#a6907c] truncate -mt-1">
                    {book.volumeInfo?.authors?.[0] || "Author"}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
