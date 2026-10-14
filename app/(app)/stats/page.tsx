"use client";

import { useEffect, useState, useCallback } from "react";
import { TrendingUp, Flame, Zap, BookOpen, Clock, BarChart2 } from "lucide-react";
import { getHeatmapDataAction, getReadingStatsAction } from "@/app/actions/reading";
import type { HeatmapPeriod, HeatmapCell, ReadingStats } from "@/app/actions/reading";

// ── colour helpers ────────────────────────────────────────────────────────────

const LEVEL_CLASSES: Record<number, string> = {
  0: "bg-[#1e0e05]/60 border-white/5",
  1: "bg-[#c9a87a]/25 border-[#c9a87a]/20",
  2: "bg-[#c9a87a]/50 border-[#c9a87a]/40",
  3: "bg-[#c9a87a]/80 border-[#c9a87a]/60",
  4: "bg-[#e0b364] border-[#e0b364]/80",
};

// ── date helpers ──────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  // e.g. "2024-10-14" → "Mon, 14 Oct 2024"
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

// ── Tooltip component ─────────────────────────────────────────────────────────

interface TooltipProps {
  cell: HeatmapCell;
}

function CellTooltip({ cell }: TooltipProps) {
  return (
    <div className="absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 pointer-events-none
                    bg-[#0f0705]/95 border border-[#2a1508] rounded-lg px-3 py-2 shadow-xl
                    text-xs whitespace-nowrap opacity-0 group-hover:opacity-100
                    transition-opacity duration-150">
      <p className="font-semibold text-[#f0dfc0] mb-0.5">{formatDate(cell.date)}</p>
      {cell.pages > 0 ? (
        <>
          <p className="text-[#c9a87a]">{cell.pages} pages read</p>
          <p className="text-[#a6907c]">{cell.minutes} min</p>
        </>
      ) : (
        <p className="text-[#a6907c]/70">No reading logged</p>
      )}
      {/* Tooltip arrow */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2a1508]" />
    </div>
  );
}

// ── Heatmap grid ──────────────────────────────────────────────────────────────

interface HeatmapGridProps {
  cells: HeatmapCell[];
  period: HeatmapPeriod;
}

function HeatmapGrid({ cells, period }: HeatmapGridProps) {
  const cols = period === "week" ? 7 : period === "month" ? 6 : 13;

  // For "week" — show day labels; for month — week numbers; for year — month labels
  const colLabels: string[] =
    period === "week"
      ? cells.map((c) =>
          new Date(c.date + "T00:00:00Z").toLocaleDateString("en-GB", {
            weekday: "short",
            timeZone: "UTC",
          })
        )
      : period === "month"
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].slice(0, cols)
      : [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "→",
        ].slice(0, cols);

  return (
    <div>
      {/* Column headers */}
      <div
        className="grid gap-1 mb-1 text-center text-[10px] font-semibold text-[#8a6040]"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {colLabels.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>

      {/* Cells */}
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {cells.map((cell) => (
          <div
            key={cell.date}
            className={`relative group aspect-square rounded-md border transition-transform hover:scale-125 hover:z-10 cursor-default
                        ${LEVEL_CLASSES[cell.level]}`}
          >
            <CellTooltip cell={cell} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="bg-[#160a05]/80 backdrop-blur-md border border-[#2a1508] rounded-xl p-4 text-center flex flex-col items-center gap-1.5 shadow-lg">
      <Icon className="h-5 w-5 text-[#c9a87a]/60" />
      <p className="text-2xl font-bold text-[#f0dfc0]">{value}</p>
      <p className="text-xs text-[#a6907c] font-medium">{label}</p>
      {sub && <p className="text-[10px] text-[#6a5040]">{sub}</p>}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function StatsPage() {
  const [period, setPeriod] = useState<HeatmapPeriod>("month");
  const [cells, setCells] = useState<HeatmapCell[]>([]);
  const [stats, setStats] = useState<ReadingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (p: HeatmapPeriod) => {
    setLoading(true);
    setError(null);
    try {
      const [heatRes, statsRes] = await Promise.all([
        getHeatmapDataAction(p),
        getReadingStatsAction(p),
      ]);

      if (!heatRes.success || !heatRes.data) throw new Error(heatRes.error);
      if (!statsRes.success || !statsRes.data) throw new Error(statsRes.error);

      setCells(heatRes.data);
      setStats(statsRes.data);
    } catch (e: any) {
      setError(e.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(period);
  }, [period, fetchData]);

  const activeDays = cells.filter((c) => c.pages > 0).length;
  const totalPages = cells.reduce((s, c) => s + c.pages, 0);

  const periodLabel =
    period === "week" ? "this week" : period === "month" ? "this month" : "this year";

  return (
    <div className="max-w-4xl mx-auto px-4 pt-20 md:pt-24 pb-16 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-serif text-[#f0dfc0]">Reading Analytics</h1>
        <p className="text-sm text-[#a6907c] mt-1">Your reading habits at a glance</p>
      </div>

      {/* Period toggle */}
      <div className="flex gap-2">
        {(["week", "month", "year"] as HeatmapPeriod[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all capitalize
              ${
                period === p
                  ? "bg-[#c9a87a] text-[#0f0705] shadow-md"
                  : "bg-[#160a05]/60 border border-[#2a1508] text-[#a6907c] hover:text-[#f0dfc0] hover:border-[#c9a87a]/40"
              }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Heatmap card */}
      <div className="bg-[#160a05]/80 backdrop-blur-md border border-[#2a1508] rounded-2xl p-6 shadow-xl">
        {/* Card header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <p className="text-base font-serif font-bold text-[#f0dfc0]">
              Reading Activity Heatmap
            </p>
            <p className="text-xs text-[#a6907c]">
              {loading
                ? "Loading…"
                : `${activeDays} active day${activeDays !== 1 ? "s" : ""} · ${totalPages.toLocaleString()} pages ${periodLabel}`}
            </p>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-1.5 text-xs text-[#a6907c]">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((l) => (
              <div
                key={l}
                className={`w-3.5 h-3.5 rounded-sm border ${LEVEL_CLASSES[l]}`}
              />
            ))}
            <span>More</span>
          </div>
        </div>

        {/* Grid or states */}
        {loading ? (
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-md bg-[#1e0e05]/60 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : error ? (
          <p className="text-sm text-red-400 text-center py-8">{error}</p>
        ) : cells.length === 0 ? (
          <p className="text-sm text-[#a6907c] text-center py-8">No data yet.</p>
        ) : (
          <HeatmapGrid cells={cells} period={period} />
        )}

        {/* Empty state CTA */}
        {!loading && !error && activeDays === 0 && (
          <p className="mt-4 text-xs text-[#8a6040] text-center">
            Log a reading session to start filling in your heatmap ✨
          </p>
        )}
      </div>

      {/* Stat cards grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={BookOpen}
          label="Pages Read"
          value={stats ? stats.totalPages.toLocaleString() : "—"}
          sub={periodLabel}
        />
        <StatCard
          icon={BarChart2}
          label="Sessions"
          value={stats ? String(stats.totalSessions) : "—"}
          sub={periodLabel}
        />
        <StatCard
          icon={Clock}
          label="Avg Session"
          value={stats ? `${stats.avgDurationMinutes} min` : "—"}
          sub="per session"
        />
        <StatCard
          icon={TrendingUp}
          label="Longest"
          value={stats ? `${stats.longestSessionMinutes} min` : "—"}
          sub={periodLabel}
        />
      </div>

      {/* Streak row */}
      {stats && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#160a05]/80 backdrop-blur-md border border-[#2a1508] rounded-2xl p-5 flex items-center gap-4 shadow-lg">
            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-[#c9a87a]/15 flex items-center justify-center">
              <Flame className="h-6 w-6 text-[#c9a87a]" />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#f0dfc0]">
                {stats.currentStreak}
                <span className="text-base font-normal text-[#a6907c] ml-1">day{stats.currentStreak !== 1 ? "s" : ""}</span>
              </p>
              <p className="text-xs text-[#a6907c]">Current streak</p>
            </div>
          </div>
          <div className="bg-[#160a05]/80 backdrop-blur-md border border-[#2a1508] rounded-2xl p-5 flex items-center gap-4 shadow-lg">
            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-[#c9a87a]/10 flex items-center justify-center">
              <Zap className="h-6 w-6 text-[#e0b364]/80" />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#f0dfc0]">
                {stats.longestStreak}
                <span className="text-base font-normal text-[#a6907c] ml-1">day{stats.longestStreak !== 1 ? "s" : ""}</span>
              </p>
              <p className="text-xs text-[#a6907c]">Personal best streak</p>
            </div>
          </div>
        </div>
      )}

      {/* Trends placeholder */}
      {stats && stats.totalSessions === 0 && (
        <div className="bg-[#160a05]/60 border border-[#2a1508] rounded-2xl p-8 flex flex-col items-center gap-3 text-center">
          <TrendingUp className="h-8 w-8 text-[#c9a87a]/30" />
          <p className="text-sm text-[#a6907c]">
            Log reading sessions to see your trends build over time.
          </p>
        </div>
      )}
    </div>
  );
}
