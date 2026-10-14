"use client";

import { useEffect, useState } from "react";
import {
  Dna,
  Sparkles,
  Compass,
  BookOpen,
  Clock,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Flame,
  CheckCircle2,
  RefreshCw,
  Share2,
  BookmarkCheck,
  Zap,
} from "lucide-react";
import { getReadingDNAAction } from "@/app/actions/dna";
import type { ReadingDNAData } from "@/lib/db/dna";

export default function DNAPage() {
  const [dna, setDna] = useState<ReadingDNAData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function loadDNA(isManual = false) {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await getReadingDNAAction();
      if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to load Reading DNA");
      }
      setDna(res.data);
      if (res.data.dnaSpine.length > 0) {
        setSelectedGenre(res.data.dnaSpine[0].name);
      }
    } catch (err: any) {
      setError(err.message || "Failed to sequence Reading DNA");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadDNA();
  }, []);

  function handleShare() {
    if (!dna) return;
    const text = `🧬 My Bookify Reading DNA: ${dna.archetype.title} ("${dna.archetype.subtitle}") · ${dna.chronotype.dominant} · ${dna.metrics.totalPagesRead.toLocaleString()} pages read!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  const activeGenre = dna?.dnaSpine.find((g) => g.name === selectedGenre) || dna?.dnaSpine[0];

  return (
    <div className="max-w-4xl mx-auto px-4 pt-20 md:pt-24 pb-20 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#c9a87a]/15 text-[#c9a87a]">
              <Dna className="h-5 w-5" />
            </span>
            <span className="text-xs uppercase tracking-widest font-semibold text-[#c9a87a]">
              Neural Literary Profile
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#f0dfc0]">
            Reading DNA
          </h1>
          <p className="text-sm text-[#a6907c] mt-1">
            Real-time genetic sequencing of your genre habits, pacing, and literary instincts.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadDNA(true)}
            disabled={refreshing || loading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-[#160a05]/80 border border-[#2a1508] text-[#a6907c] hover:text-[#f0dfc0] hover:border-[#c9a87a]/40 transition-colors disabled:opacity-50"
            title="Recalculate DNA from latest sessions"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-[#c9a87a]" : ""}`} />
            <span>{refreshing ? "Re-sequencing…" : "Recalculate"}</span>
          </button>

          <button
            onClick={handleShare}
            disabled={!dna}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#c9a87a] text-[#0f0705] hover:bg-[#e0b364] transition-colors shadow-md disabled:opacity-50"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>{copied ? "Copied!" : "Share DNA"}</span>
          </button>
        </div>
      </div>

      {loading ? (
        /* Loading Skeleton */
        <div className="space-y-6">
          <div className="h-48 rounded-2xl bg-[#160a05]/60 border border-[#2a1508] animate-pulse" />
          <div className="h-32 rounded-2xl bg-[#160a05]/60 border border-[#2a1508] animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-[#160a05]/60 border border-[#2a1508] animate-pulse" />
            ))}
          </div>
        </div>
      ) : error ? (
        /* Error State */
        <div className="bg-[#160a05]/80 border border-red-900/40 rounded-2xl p-8 text-center space-y-3">
          <p className="text-red-400 text-sm">{error}</p>
          <button
            onClick={() => loadDNA(false)}
            className="px-4 py-2 rounded-lg bg-[#c9a87a] text-[#0f0705] text-xs font-medium"
          >
            Try Again
          </button>
        </div>
      ) : dna ? (
        <>
          {/* Archetype Hero Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c0d07]/90 via-[#140804]/90 to-[#0c0402]/95 border border-[#3d2010] p-6 sm:p-8 shadow-2xl backdrop-blur-md">
            {/* Ambient Background Glow */}
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#c9a87a]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c9a87a]/15 border border-[#c9a87a]/25 text-[#c9a87a] text-xs font-semibold">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Reader Persona Archetype</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#f0dfc0]">
                  {dna.archetype.title}
                </h2>
                <p className="text-sm font-medium text-[#c9a87a]/90 italic">
                  "{dna.archetype.subtitle}"
                </p>
                <p className="text-xs sm:text-sm text-[#a6907c] leading-relaxed pt-1">
                  {dna.archetype.summary}
                </p>
              </div>

              {/* DNA Emblem Badge */}
              <div className="flex-shrink-0 self-center md:self-auto p-5 rounded-2xl bg-[#0f0705]/80 border border-[#3d2010] shadow-inner text-center">
                <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-tr from-[#c9a87a]/20 to-[#e0b364]/40 flex items-center justify-center border border-[#c9a87a]/40 shadow-lg mb-2">
                  <Compass className="h-8 w-8 text-[#e0b364]" />
                </div>
                <span className="text-[11px] font-bold text-[#f0dfc0] tracking-wider uppercase block">
                  Grade A Sequenced
                </span>
                <span className="text-[10px] text-[#8a6040]">
                  {dna.metrics.totalBooksRead} Books Finished
                </span>
              </div>
            </div>
          </div>

          {/* DNA Spine Helix Visualizer */}
          <div className="rounded-2xl bg-[#160a05]/80 border border-[#2a1508] p-6 shadow-xl backdrop-blur-md space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-serif font-bold text-[#f0dfc0]">
                  Genre Chromosome Strand
                </h3>
                <p className="text-xs text-[#a6907c]">
                  Your literary genetic composition based on pages read and finished books.
                </p>
              </div>
              <span className="text-xs text-[#c9a87a] font-medium">
                Click segment to inspect
              </span>
            </div>

            {/* The Continuous Spine Bar */}
            <div className="space-y-2">
              <div className="h-7 w-full rounded-xl overflow-hidden flex gap-1 p-1 bg-[#0f0705]/80 border border-white/5 shadow-inner">
                {dna.dnaSpine.map((seg) => {
                  const isSelected = selectedGenre === seg.name;
                  return (
                    <button
                      key={seg.name}
                      onClick={() => setSelectedGenre(seg.name)}
                      className={`h-full rounded-lg transition-all duration-300 relative group cursor-pointer ${
                        isSelected ? "ring-2 ring-white scale-y-105 z-10 opacity-100" : "opacity-85 hover:opacity-100"
                      }`}
                      style={{
                        width: `${Math.max(seg.percentage, 4)}%`,
                        backgroundColor: seg.hex,
                      }}
                      title={`${seg.name}: ${seg.percentage}%`}
                    />
                  );
                })}
              </div>

              {/* Segment legend buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                {dna.dnaSpine.map((seg) => {
                  const isSelected = selectedGenre === seg.name;
                  return (
                    <button
                      key={seg.name}
                      onClick={() => setSelectedGenre(seg.name)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                        isSelected
                          ? "bg-[#2a1508] border-[#c9a87a] text-[#f0dfc0] shadow-md"
                          : "bg-[#0f0705]/60 border-white/5 text-[#a6907c] hover:text-[#f0dfc0]"
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shadow-sm"
                        style={{ backgroundColor: seg.hex }}
                      />
                      <span>{seg.name}</span>
                      <span className="font-bold text-[#c9a87a]">{seg.percentage}%</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Selected Genre Details Subcard */}
            {activeGenre && (
              <div className="rounded-xl bg-[#0f0705]/60 border border-[#2a1508] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3.5 h-3.5 rounded-full shadow-lg"
                    style={{ backgroundColor: activeGenre.hex }}
                  />
                  <div>
                    <p className="text-sm font-bold text-[#f0dfc0]">{activeGenre.name}</p>
                    <p className="text-xs text-[#a6907c]">
                      Dominance in your reading library
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-center sm:text-right">
                  <div>
                    <p className="text-base font-bold text-[#f0dfc0]">{activeGenre.percentage}%</p>
                    <p className="text-[10px] text-[#8a6040] uppercase">Total Affinity</p>
                  </div>
                  <div>
                    <p className="text-base font-bold text-[#c9a87a]">{activeGenre.pagesRead.toLocaleString()}</p>
                    <p className="text-[10px] text-[#8a6040] uppercase">Pages Absorbed</p>
                  </div>
                  <div>
                    <p className="text-base font-bold text-[#f0dfc0]">{activeGenre.bookCount}</p>
                    <p className="text-[10px] text-[#8a6040] uppercase">Books Linked</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Key Velocity & Pacing Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-[#160a05]/80 border border-[#2a1508] p-4 text-center shadow-lg backdrop-blur-md">
              <BookOpen className="h-5 w-5 text-[#c9a87a] mx-auto mb-1.5 opacity-80" />
              <p className="text-2xl font-bold font-serif text-[#f0dfc0]">
                {dna.metrics.totalPagesRead.toLocaleString()}
              </p>
              <p className="text-xs text-[#a6907c] mt-0.5">Total Pages Read</p>
            </div>

            <div className="rounded-2xl bg-[#160a05]/80 border border-[#2a1508] p-4 text-center shadow-lg backdrop-blur-md">
              <Zap className="h-5 w-5 text-[#e0b364] mx-auto mb-1.5 opacity-80" />
              <p className="text-2xl font-bold font-serif text-[#f0dfc0]">
                {dna.metrics.readingPacePPH} <span className="text-xs font-sans text-[#a6907c]">pages/hr</span>
              </p>
              <p className="text-xs text-[#a6907c] mt-0.5">Reading Velocity</p>
            </div>

            <div className="rounded-2xl bg-[#160a05]/80 border border-[#2a1508] p-4 text-center shadow-lg backdrop-blur-md">
              <Clock className="h-5 w-5 text-[#c9a87a] mx-auto mb-1.5 opacity-80" />
              <p className="text-2xl font-bold font-serif text-[#f0dfc0]">
                {dna.metrics.avgSessionMinutes} <span className="text-xs font-sans text-[#a6907c]">min</span>
              </p>
              <p className="text-xs text-[#a6907c] mt-0.5">Avg Session Length</p>
            </div>

            <div className="rounded-2xl bg-[#160a05]/80 border border-[#2a1508] p-4 text-center shadow-lg backdrop-blur-md">
              <BookmarkCheck className="h-5 w-5 text-[#4ade80] mx-auto mb-1.5 opacity-80" />
              <p className="text-2xl font-bold font-serif text-[#f0dfc0]">
                {dna.metrics.completionRate}%
              </p>
              <p className="text-xs text-[#a6907c] mt-0.5">Book Completion</p>
            </div>
          </div>

          {/* Chronotype & Mood Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chronotype (Time of day) */}
            <div className="rounded-2xl bg-[#160a05]/80 border border-[#2a1508] p-6 shadow-xl backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-serif font-bold text-[#f0dfc0]">
                    Reading Chronotype
                  </h3>
                  <p className="text-xs text-[#a6907c]">Optimal circadian window for focus</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c9a87a]/15 text-[#c9a87a] text-xs font-semibold">
                  <Moon className="h-3.5 w-3.5" />
                  <span>{dna.chronotype.dominant}</span>
                </div>
              </div>

              <p className="text-xs text-[#a6907c] leading-relaxed">
                {dna.chronotype.description}
              </p>

              {/* Chronotype Bars */}
              <div className="grid grid-cols-4 gap-2 pt-2">
                {[
                  { label: "Dawn", icon: Sunrise, pct: dna.chronotype.breakdown.morning },
                  { label: "Day", icon: Sun, pct: dna.chronotype.breakdown.afternoon },
                  { label: "Twilight", icon: Sunset, pct: dna.chronotype.breakdown.evening },
                  { label: "Night", icon: Moon, pct: dna.chronotype.breakdown.night },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl bg-[#0f0705]/60 border border-white/5 p-3 text-center flex flex-col items-center justify-between gap-1.5"
                  >
                    <item.icon className="h-4 w-4 text-[#c9a87a]" />
                    <span className="text-sm font-bold text-[#f0dfc0]">{item.pct}%</span>
                    <span className="text-[10px] text-[#8a6040]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Emotional Signature & Moods */}
            <div className="rounded-2xl bg-[#160a05]/80 border border-[#2a1508] p-6 shadow-xl backdrop-blur-md space-y-4">
              <div>
                <h3 className="text-base font-serif font-bold text-[#f0dfc0]">
                  Atmospheric & Mood Signature
                </h3>
                <p className="text-xs text-[#a6907c]">
                  Emotional resonance captured during your reading sessions
                </p>
              </div>

              {dna.moods.length > 0 ? (
                <div className="space-y-3 pt-1">
                  {dna.moods.map((m) => (
                    <div key={m.mood} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-[#f0dfc0] font-medium">{m.label}</span>
                        <span className="text-[#c9a87a] font-semibold">{m.percentage}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-[#0f0705] overflow-hidden border border-white/5">
                        <div
                          className="h-full bg-gradient-to-r from-[#c9a87a] to-[#e0b364] rounded-full transition-all duration-500"
                          style={{ width: `${m.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-[#8a6040]">
                  Log your reading mood in your next session to sequence this quadrant.
                </div>
              )}
            </div>
          </div>

          {/* Strengths & Instincts */}
          <div className="rounded-2xl bg-[#160a05]/80 border border-[#2a1508] p-6 shadow-xl backdrop-blur-md space-y-4">
            <h3 className="text-base font-serif font-bold text-[#f0dfc0]">
              Literary Instincts & Behavioral Strengths
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dna.strengths.map((str, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-[#0f0705]/60 border border-white/5"
                >
                  <CheckCircle2 className="h-4 w-4 text-[#c9a87a] flex-shrink-0" />
                  <span className="text-xs font-medium text-[#f0dfc0]">{str}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
