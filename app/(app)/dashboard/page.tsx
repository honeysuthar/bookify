"use client";

import { useEffect, useState } from "react";
import {
  Flame,
  BookOpen,
  Star,
  ArrowRight,
  Calendar,
  FileText,
  Target,
  Quote,
  Bookmark,
} from "lucide-react";
import Link from "next/link";
import { fetchBooksByCategory } from "@/lib/google-books";
import { GoogleBookVolume, GoogleBooksResponse } from "@/types/google-books";
import { useLibrary, LibraryEntry } from "@/lib/library-store";

function getFeaturedBook(library: Record<string, LibraryEntry>): LibraryEntry | null {
  const entries = Object.values(library);
  const currentlyReading = entries
    .filter((e) => e.status === "CURRENTLY_READING")
    .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
  if (currentlyReading.length > 0) return currentlyReading[0];
  const wantToRead = entries
    .filter((e) => e.status === "WANT_TO_READ")
    .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
  if (wantToRead.length > 0) return wantToRead[0];
  return null;
}

// July 2026 starts on Wednesday (index 3)
const JULY_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const OFFSET = 3; // Wednesday

export default function DashboardPage() {
  const { library } = useLibrary();
  const [recommendedBooksResponse, setRecommendedBooksResponse] = useState<GoogleBooksResponse>({
    kind: "books#volumes",
    totalItems: 0,
    items: [],
  });
  const [brokenCovers, setBrokenCovers] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchBooksByCategory("fiction", 6, { q: "bestsellers" })
      .then(setRecommendedBooksResponse)
      .catch(() => setRecommendedBooksResponse({ kind: "books#volumes", totalItems: 0, items: [] }));
  }, []);

  const featuredBook = getFeaturedBook(library);

  const getRating = (bookId: string) => {
    const code = bookId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (4.3 + (code % 7) / 10).toFixed(1);
  };

  // Calendar: days 1-17 are "read", today is 17
  const readDays = new Set(Array.from({ length: 17 }, (_, i) => i + 1));
  const todayDay = 17;

  return (
    <div className="min-h-screen bg-[#0f0705] text-[#e8d5c0]">

      {/* ── Hero Banner ── */}
      <section className="relative w-full h-[260px] md:h-[320px] overflow-hidden">
        {/* Warm gradient overlay (simulates candlelit room photo) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 70% 40%, #3d1a08 0%, #1a0905 50%, #0a0403 100%)",
          }}
        />
        {/* Bokeh / warm light dots */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            { top: "20%", left: "62%", size: 80, opacity: 0.18 },
            { top: "10%", left: "78%", size: 50, opacity: 0.12 },
            { top: "55%", left: "85%", size: 40, opacity: 0.10 },
            { top: "35%", left: "55%", size: 120, opacity: 0.08 },
          ].map((b, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                top: b.top,
                left: b.left,
                width: b.size,
                height: b.size,
                background: `radial-gradient(circle, rgba(255,180,60,${b.opacity}) 0%, transparent 70%)`,
                filter: "blur(12px)",
              }}
            />
          ))}
          {/* Candle flame SVG on right */}
          <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-30 hidden md:block">
            <svg width="60" height="120" viewBox="0 0 60 120" fill="none">
              <ellipse cx="30" cy="100" rx="14" ry="8" fill="#5a2a0a" />
              <rect x="22" y="60" width="16" height="45" rx="4" fill="#3d1f0a" />
              <path d="M30 58 C24 40 18 30 30 10 C42 30 36 40 30 58Z" fill="#f5a623" opacity="0.9" />
              <path d="M30 52 C26 38 24 30 30 18 C36 30 34 38 30 52Z" fill="#fff7e0" opacity="0.7" />
            </svg>
          </div>
          {/* Stacked books silhouette */}
          <div className="absolute right-32 bottom-4 opacity-20 hidden md:block">
            <svg width="80" height="70" viewBox="0 0 80 70" fill="#c0956e">
              <rect x="5" y="50" width="70" height="10" rx="2" />
              <rect x="10" y="38" width="55" height="12" rx="2" />
              <rect x="15" y="27" width="45" height="11" rx="2" />
              <rect x="20" y="17" width="35" height="10" rx="2" />
            </svg>
          </div>
        </div>

        {/* Text content */}
        <div className="relative z-10 flex flex-col justify-center h-full px-3 md:px-5 max-w-4xl">
          <p className="text-[#c9a87a] text-sm font-medium tracking-wide mb-1">good evening,</p>
          <h1 className="text-5xl md:text-6xl font-bold font-serif text-[#f0dfc0] flex items-center gap-3 leading-tight">
            Reader
            <span className="text-[#c9a87a] text-3xl">✦</span>
          </h1>
          <p className="text-[#a08060] text-sm mt-3 leading-relaxed max-w-xs">
            Every page you read,<br />shapes who you become.
          </p>
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="max-w-6xl mx-auto px-2 md:px-3 py-6 space-y-6">

        {/* ── Currently Reading Card ── */}
        <section
          className="relative rounded-2xl overflow-hidden border border-[#2a1508]/80"
          style={{ background: "linear-gradient(135deg, #1e0d06 0%, #2d1209 60%, #1a0a05 100%)" }}
        >
          {/* Bookmark icon top-right */}
          <div className="absolute top-4 right-4 text-[#8b3a2a]">
            <Bookmark className="w-6 h-6 fill-[#8b3a2a]" />
          </div>

          {/* Decorative bokeh */}
          <div className="absolute right-0 top-0 w-64 h-64 pointer-events-none">
            <div
              className="w-full h-full rounded-full opacity-10"
              style={{ background: "radial-gradient(circle, #c9a87a 0%, transparent 70%)", filter: "blur(30px)" }}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-6 p-6 items-start">
            {/* Book cover */}
            <div className="w-[110px] h-[160px] rounded-xl overflow-hidden shrink-0 shadow-xl border border-white/10 bg-[#2a1008]">
              {featuredBook?.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={featuredBook.coverUrl} alt={featuredBook.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#3a1a0a] to-[#1e0906] p-3 text-center">
                  <div className="text-[8px] font-bold uppercase tracking-wider text-[#c9a87a] mb-1">The Happy Prince</div>
                  <div className="text-[7px] text-[#8a6040] italic">Oscar Wilde</div>
                  <BookOpen className="w-8 h-8 text-[#c9a87a]/30 mt-3" />
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
              <div>
                <p className="text-[10px] tracking-[0.15em] text-[#8a6040] font-bold uppercase mb-2">
                  Currently Reading
                </p>
                <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#f0dfc0] leading-tight">
                  {featuredBook ? featuredBook.title : "The Happy Prince and Other Stories"}
                </h2>
                <p className="text-sm text-[#8a6040] mt-1 italic">
                  by {featuredBook ? featuredBook.author : "Oscar Wilde"}
                </p>
              </div>

              <div className="mt-5 space-y-3">
                <p className="text-xs text-[#8a6040]">67% completed</p>
                <div className="w-full max-w-sm h-[5px] rounded-full bg-[#2a1508] overflow-hidden">
                  <div className="h-full w-[67%] rounded-full bg-gradient-to-r from-[#c9a87a] to-[#e8b860]" />
                </div>
                <Link
                  href={featuredBook ? `/book/${featuredBook.bookId}` : "/discover"}
                  className="inline-flex items-center gap-2 mt-1 px-5 py-2.5 rounded-xl text-sm font-semibold text-[#f0dfc0] border border-[#3a1a0a] bg-[#2a1008] hover:bg-[#3a1a0a] transition-all"
                >
                  Continue Reading <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Reading Calendar + This Month ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Reading Calendar */}
          <section
            className="rounded-2xl p-5 border border-[#2a1508]/60"
            style={{ background: "linear-gradient(145deg, #1a0d07 0%, #160a05 100%)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-[#8a6040]" />
              <span className="text-sm font-semibold text-[#c9a87a]">Reading Calendar</span>
            </div>

            <div className="flex items-start gap-6">
              {/* Calendar grid */}
              <div className="flex-1 min-w-0">
                <p className="text-xl font-bold font-serif text-[#f0dfc0] mb-3">July 2026</p>

                <div className="grid grid-cols-7 gap-y-1.5 text-center">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <span key={d} className="text-[9px] font-bold text-[#5a3a22] uppercase tracking-wide">{d}</span>
                  ))}
                  {/* Empty cells for offset */}
                  {Array.from({ length: OFFSET }).map((_, i) => (
                    <span key={`e-${i}`} />
                  ))}
                  {JULY_DAYS.map((day) => {
                    const isRead = readDays.has(day);
                    const isToday = day === todayDay;
                    return (
                      <div key={day} className="aspect-square flex items-center justify-center relative">
                        {isToday ? (
                          <>
                            <div className="absolute inset-0.5 rounded-full bg-[#3C1212]" />
                            <span className="relative z-10 text-[10px] font-bold text-white">{day}</span>
                          </>
                        ) : isRead ? (
                          <>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <svg viewBox="0 0 100 100" className="w-6 h-6 stroke-[#c05050]/70 fill-none" strokeWidth="7" strokeLinecap="round">
                                <path d="M50,10 C72,11 88,28 85,52 C82,74 62,84 40,79 C18,74 8,52 12,30 C16,10 38,9 60,15" />
                              </svg>
                            </div>
                            <span className="text-[10px] font-semibold text-[#e8c0a0] relative z-10">{day}</span>
                          </>
                        ) : (
                          <span className="text-[10px] text-[#4a3020]">{day}</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 mt-4 text-[9px] text-[#5a3a22] font-bold">
                  <span className="flex items-center gap-1">
                    <svg viewBox="0 0 100 100" className="w-3.5 h-3.5 stroke-[#c05050]/70 fill-none" strokeWidth="9">
                      <path d="M50,10 C72,11 88,28 85,52 C82,74 62,84 40,79 C18,74 8,52 12,30 C16,10 38,9 60,15" />
                    </svg>
                    Read
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full border border-[#5a3a22]" />
                    Missed
                  </span>
                </div>
              </div>

              {/* Streak callout */}
              <div className="shrink-0 flex flex-col items-center text-center">
                <div className="text-3xl mb-1">🔥</div>
                <p className="text-[#e8b860] font-bold text-lg font-serif leading-tight">12 Day</p>
                <p className="text-[#e8b860] font-bold text-lg font-serif leading-tight">Streak</p>
                <p className="text-[10px] text-[#8a6040] mt-1 italic">Keep the<br />streak alive!</p>
                <svg viewBox="0 0 80 30" fill="none" stroke="#c05050" strokeWidth="1.5" className="w-12 mt-2 opacity-60">
                  <path d="M8,5 C25,22 50,-5 72,15" strokeLinecap="round" />
                  <path d="M63,10 L72,15 L65,21" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </section>

          {/* This Month */}
          <section
            className="rounded-2xl p-5 border border-[#2a1508]/60"
            style={{ background: "linear-gradient(145deg, #1a0d07 0%, #160a05 100%)" }}
          >
            <p className="text-sm font-semibold text-[#c9a87a] mb-5">This Month</p>

            <div className="space-y-5">
              {/* Books Finished */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-[#3a1a0a] bg-[#1e0d06] flex items-center justify-center text-[#c9a87a]">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[#8a6040]">Books Finished</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-bold font-serif text-[#f0dfc0]">3</span>
                    <span className="text-[10px] text-[#5a3a22]">books</span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[#2a1508]" />

              {/* Pages Read */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-[#3a1a0a] bg-[#1e0d06] flex items-center justify-center text-[#c9a87a]">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[#8a6040]">Pages Read</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-bold font-serif text-[#f0dfc0]">642</span>
                    <span className="text-[10px] text-[#5a3a22]">pages</span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[#2a1508]" />

              {/* Monthly Goal */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-[#3a1a0a] bg-[#1e0d06] flex items-center justify-center text-[#c9a87a]">
                  <Target className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[#8a6040]">Monthly Goal</p>
                    <span className="text-2xl font-bold font-serif text-[#f0dfc0]">80%</span>
                  </div>
                  <div className="mt-2 w-full h-[5px] rounded-full bg-[#2a1508] overflow-hidden">
                    <div className="h-full w-[80%] rounded-full bg-gradient-to-r from-[#c9a87a] to-[#e8b860]" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ── Reading Identity ── */}
        <section
          className="rounded-2xl p-5 border border-[#2a1508]/60"
          style={{ background: "linear-gradient(145deg, #1a0d07 0%, #160a05 100%)" }}
        >
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-semibold text-[#c9a87a]">Reading Identity</p>
            <Link href="/profile" className="text-xs text-[#8a6040] hover:text-[#c9a87a] flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 items-start">
            {/* Archetype icon */}
            <div className="w-[110px] h-[110px] rounded-2xl bg-[#0f0705] border border-[#2a1508] flex flex-col items-center justify-center gap-2 shrink-0">
              <svg width="52" height="52" viewBox="0 0 100 100" fill="none" className="text-[#c9a87a] opacity-80">
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" />
                <path d="M50 5 L50 95 M5 50 L95 50 M18 18 L82 82 M18 82 L82 18" stroke="currentColor" strokeWidth="0.3" />
                <polygon points="50,15 55,27 68,27 58,35 62,48 50,40 38,48 42,35 32,27 45,27" fill="currentColor" transform="scale(0.6) translate(33, 33)" />
                <circle cx="50" cy="18" r="3" fill="currentColor" />
                <circle cx="82" cy="50" r="3" fill="currentColor" />
                <circle cx="50" cy="82" r="3" fill="currentColor" />
                <circle cx="18" cy="50" r="3" fill="currentColor" />
              </svg>
              <svg width="28" height="18" viewBox="0 0 32 20" fill="none" className="text-[#c9a87a] opacity-70">
                <path d="M16 18C12 12 2 12 2 12V2C2 2 12 2 16 8C20 2 30 2 30 2V12C30 12 20 12 16 18Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                <path d="M16 8V18" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl font-bold font-serif text-[#f0dfc0] flex items-center gap-2">
                The Explorer <span className="text-[#c9a87a] text-base">✦</span>
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {["Curious", "Literary", "Reflective"].map((tag) => (
                  <span key={tag} className="text-[11px] font-semibold bg-[#1e0d06] border border-[#2a1508] px-3 py-1 rounded-full text-[#c9a87a]">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-4">
                <div className="flex gap-1 h-1.5 rounded-full overflow-hidden mb-3">
                  <div className="bg-[#c9a87a] w-[35%] rounded-l-full" />
                  <div className="bg-[#c05050] w-[25%]" />
                  <div className="bg-[#8a7a6a] w-[20%]" />
                  <div className="bg-[#4a9a7a] w-[20%] rounded-r-full" />
                </div>
                <p className="text-xs text-[#8a6040] leading-relaxed">
                  You love discovering new worlds and ideas.<br />Keep exploring, your next favorite book is waiting.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Made For You ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold font-serif text-[#f0dfc0] flex items-center gap-2">
                Made For You <span className="text-[#c9a87a] text-base">✦</span>
              </h2>
              <p className="text-[11px] text-[#5a3a22] mt-0.5">Real trending bestsellers you might love</p>
            </div>
            <Link href="/discover" className="text-xs text-[#8a6040] hover:text-[#c9a87a] font-semibold flex items-center gap-1 transition-colors">
              See all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
            {recommendedBooksResponse.items && recommendedBooksResponse.items.filter((b) => !brokenCovers.has(b.id)).length > 0 ? (
              <>
                {recommendedBooksResponse.items
                  .filter((book) => !brokenCovers.has(book.id))
                  .map((book: GoogleBookVolume) => (
                    <Link href={`/book/${book.id}`} key={book.id} className="shrink-0 w-[110px] snap-start group">
                      <div className="w-[110px] h-[160px] rounded-xl overflow-hidden mb-2.5 shadow-lg border border-[#2a1508]/50 bg-[#1a0d07] transition-all group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-black/40">
                        {book.volumeInfo.imageLinks?.thumbnail ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={book.volumeInfo.imageLinks.thumbnail.replace("http://", "https://")}
                            alt={book.volumeInfo.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            onError={() => setBrokenCovers((prev) => new Set(prev).add(book.id))}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center">
                            <BookOpen className="h-7 w-7 text-[#c9a87a]/30 mb-1" />
                            <span className="text-[9px] text-[#8a6040] italic line-clamp-3 font-semibold">{book.volumeInfo.title}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-0.5 px-0.5">
                        <p className="text-[11px] font-bold text-[#e8d5c0] truncate" title={book.volumeInfo.title}>
                          {book.volumeInfo.title}
                        </p>
                        <p className="text-[10px] text-[#5a3a22] truncate">
                          {book.volumeInfo.authors?.[0] || "Unknown Author"}
                        </p>
                        <div className="flex items-center gap-0.5 text-[10px] text-[#c9a87a] font-bold">
                          <Star className="w-3 h-3 fill-[#c9a87a] stroke-none" />
                          {getRating(book.id)}
                        </div>
                      </div>
                    </Link>
                  ))}

                {/* More for you card */}
                <Link
                  href="/discover"
                  className="shrink-0 w-[110px] h-[160px] rounded-xl border border-dashed border-[#2a1508] hover:border-[#c9a87a]/40 bg-[#110804] transition-all flex flex-col items-center justify-center text-center p-4 snap-start group"
                >
                  <div className="w-9 h-9 rounded-full bg-[#1e0d06] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform border border-[#2a1508]">
                    <span className="text-lg font-bold text-[#c9a87a]">+</span>
                  </div>
                  <p className="text-[11px] font-bold text-[#8a6040] group-hover:text-[#c9a87a] transition-colors leading-tight">More for you</p>
                </Link>
              </>
            ) : (
              <div className="py-8 text-center w-full">
                <p className="text-sm text-[#5a3a22] font-medium">Loading recommendations...</p>
              </div>
            )}
          </div>
        </section>

        {/* ── Quote Banner ── */}
        <section
          className="relative rounded-2xl overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1a0d07 0%, #0f0705 100%)" }}
        >
          {/* Open book bg texture */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute inset-0 opacity-15"
              style={{
                background: "radial-gradient(ellipse at 50% 80%, #5a3010 0%, transparent 70%)",
              }}
            />
          </div>
          <div className="relative z-10 py-10 px-4 flex flex-col items-center text-center">
            <Quote className="w-8 h-8 text-[#c9a87a] fill-[#c9a87a] mb-4 opacity-70" />
            <p className="text-xl md:text-2xl font-serif italic text-[#f0dfc0] max-w-xl leading-relaxed">
              &ldquo;A reader lives a thousand lives before he dies.&rdquo;
            </p>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#8a6040] mt-4">
              — George R.R. Martin
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}