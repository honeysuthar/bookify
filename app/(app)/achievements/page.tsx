"use client";

import { useEffect, useState } from "react";
import {
  Award,
  Flame,
  BookOpen,
  Library,
  Trophy,
  Layers,
  Bookmark,
  Sparkles,
  Moon,
  Sunrise,
  Clock,
  Zap,
  Compass,
  Globe,
  Heart,
  Crown,
  CheckCircle2,
  Lock,
  Coins,
  RefreshCw,
} from "lucide-react";
import { getAchievementsAction } from "@/app/actions/achievements";
import type { AchievementsData, AchievementItem } from "@/lib/db/achievements";

// Icon selector helper
function getAchievementIcon(iconName: string, earned: boolean) {
  const className = `h-6 w-6 ${earned ? "text-[#e0b364]" : "text-[#a6907c]/60"}`;
  switch (iconName) {
    case "Flame":
      return <Flame className={className} />;
    case "Crown":
      return <Crown className={className} />;
    case "BookOpen":
      return <BookOpen className={className} />;
    case "Library":
      return <Library className={className} />;
    case "Trophy":
      return <Trophy className={className} />;
    case "Layers":
      return <Layers className={className} />;
    case "Bookmark":
      return <Bookmark className={className} />;
    case "Sparkles":
      return <Sparkles className={className} />;
    case "Moon":
      return <Moon className={className} />;
    case "Sunrise":
      return <Sunrise className={className} />;
    case "Clock":
      return <Clock className={className} />;
    case "Zap":
      return <Zap className={className} />;
    case "Compass":
      return <Compass className={className} />;
    case "Globe":
      return <Globe className={className} />;
    case "Heart":
      return <Heart className={className} />;
    default:
      return <Award className={className} />;
  }
}

export default function AchievementsPage() {
  const [data, setData] = useState<AchievementsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  async function loadAchievements(isManual = false) {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await getAchievementsAction();
      if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to load achievements");
      }
      setData(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to load achievements");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadAchievements();
  }, []);

  const filteredAchievements =
    selectedCategory === "ALL"
      ? data?.achievements || []
      : (data?.achievements || []).filter((a) => a.category === selectedCategory);

  return (
    <div className="max-w-4xl mx-auto px-4 pt-20 md:pt-24 pb-20 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#c9a87a]/15 text-[#c9a87a]">
              <Award className="h-5 w-5" />
            </span>
            <span className="text-xs uppercase tracking-widest font-semibold text-[#c9a87a]">
              Literary Milestones
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#f0dfc0]">
            Achievements
          </h1>
          <p className="text-sm text-[#a6907c] mt-1">
            Track reading milestones, level progression, and earn literary rewards.
          </p>
        </div>

        {/* Sync/Refresh Button */}
        <button
          onClick={() => loadAchievements(true)}
          disabled={refreshing || loading}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-[#160a05]/80 border border-[#2a1508] text-[#a6907c] hover:text-[#f0dfc0] hover:border-[#c9a87a]/40 transition-colors disabled:opacity-50 self-start sm:self-auto"
          title="Re-check criteria from latest reading sessions"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-[#c9a87a]" : ""}`} />
          <span>{refreshing ? "Checking…" : "Sync Milestones"}</span>
        </button>
      </div>

      {loading ? (
        /* Loading Skeleton */
        <div className="space-y-6">
          <div className="h-40 rounded-3xl bg-[#160a05]/60 border border-[#2a1508] animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 rounded-2xl bg-[#160a05]/60 border border-[#2a1508] animate-pulse" />
            ))}
          </div>
        </div>
      ) : error ? (
        /* Error State */
        <div className="bg-[#160a05]/80 border border-red-900/40 rounded-2xl p-8 text-center space-y-3">
          <p className="text-red-400 text-sm">{error}</p>
          <button
            onClick={() => loadAchievements(false)}
            className="px-4 py-2 rounded-lg bg-[#c9a87a] text-[#0f0705] text-xs font-medium"
          >
            Try Again
          </button>
        </div>
      ) : data ? (
        <>
          {/* Level Progression Hero Strip */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c0d07]/90 via-[#140804]/90 to-[#0c0402]/95 border border-[#3d2010] p-6 sm:p-7 shadow-2xl backdrop-blur-md">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#c9a87a]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              {/* Level & Rank Badge */}
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-[#c9a87a]/20 to-[#e0b364]/30 border border-[#c9a87a]/50 flex flex-col items-center justify-center shadow-lg text-center flex-shrink-0">
                  <span className="text-[10px] uppercase font-bold text-[#c9a87a] tracking-wider leading-none">
                    Level
                  </span>
                  <span className="text-2xl font-bold font-serif text-[#f0dfc0] leading-tight">
                    {data.userLevel.level}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#f0dfc0]">
                      {data.userLevel.title}
                    </h2>
                  </div>
                  <p className="text-xs text-[#a6907c] mt-0.5">
                    {data.stats.totalEarned} of {data.stats.totalAchievements} badges unlocked ({data.stats.completionPercent}%)
                  </p>
                </div>
              </div>

              {/* Currency & Total XP Pills */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0f0705]/80 border border-[#2a1508] shadow-inner text-xs font-semibold text-[#f0dfc0]">
                  <Sparkles className="h-3.5 w-3.5 text-[#c9a87a]" />
                  <span>{data.userLevel.totalXp.toLocaleString()} XP</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0f0705]/80 border border-[#2a1508] shadow-inner text-xs font-semibold text-[#e0b364]">
                  <Coins className="h-3.5 w-3.5 text-[#e0b364]" />
                  <span>{data.userLevel.coins.toLocaleString()} Coins</span>
                </div>
              </div>
            </div>

            {/* XP Level Progress Bar */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#a6907c]">Tier Progress</span>
                <span className="text-[#c9a87a] font-medium">
                  {data.userLevel.currentTierXp.toLocaleString()} / {data.userLevel.nextTierXp.toLocaleString()} XP
                  <span className="text-[#8a6040] ml-1.5">({data.userLevel.progressPercent}%)</span>
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-[#0f0705]/90 border border-white/5 overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#c9a87a] via-[#e0b364] to-[#c9a87a] transition-all duration-700 shadow-sm"
                  style={{ width: `${data.userLevel.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory("ALL")}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                selectedCategory === "ALL"
                  ? "bg-[#c9a87a] text-[#0f0705] border-[#c9a87a] font-semibold shadow-md"
                  : "bg-[#160a05]/60 border-[#2a1508] text-[#a6907c] hover:text-[#f0dfc0]"
              }`}
            >
              All Badges ({data.stats.totalEarned}/{data.stats.totalAchievements})
            </button>
            {data.categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                  selectedCategory === cat.key
                    ? "bg-[#c9a87a] text-[#0f0705] border-[#c9a87a] font-semibold shadow-md"
                    : "bg-[#160a05]/60 border-[#2a1508] text-[#a6907c] hover:text-[#f0dfc0]"
                }`}
              >
                {cat.label} ({cat.earnedCount}/{cat.count})
              </button>
            ))}
          </div>

          {/* Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredAchievements.map((badge) => (
              <div
                key={badge.id}
                className={`rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between gap-4 backdrop-blur-md relative ${
                  badge.earned
                    ? "bg-gradient-to-b from-[#1f0f08]/90 to-[#140804]/90 border-[#c9a87a]/40 shadow-lg shadow-black/40"
                    : "bg-[#140804]/50 border-white/5 opacity-70 hover:opacity-90"
                }`}
              >
                {/* Top Badge Header */}
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border transition-transform duration-300 group-hover:scale-105 ${
                      badge.earned
                        ? "bg-gradient-to-tr from-[#c9a87a]/25 to-[#e0b364]/20 border-[#c9a87a]/50 shadow-md shadow-[#c9a87a]/10"
                        : "bg-[#0f0705]/80 border-white/5"
                    }`}
                  >
                    {getAchievementIcon(badge.icon, badge.earned)}
                  </div>

                  {/* Rewards Pill */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0f0705]/70 border border-white/5 text-[11px] font-semibold">
                    <span className="text-[#c9a87a]">+{badge.xpReward} XP</span>
                    <span className="text-[#8a6040]">·</span>
                    <span className="text-[#e0b364]">+{badge.coinReward} 🪙</span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <p className={`text-base font-serif font-bold ${badge.earned ? "text-[#f0dfc0]" : "text-[#d0c0b0]"}`}>
                      {badge.name}
                    </p>
                    {badge.earned ? (
                      <CheckCircle2 className="h-4 w-4 text-[#e0b364] flex-shrink-0" />
                    ) : (
                      <Lock className="h-3.5 w-3.5 text-[#8a6040] flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-[#a6907c] leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                {/* Progress / Status Footer */}
                <div className="pt-2 border-t border-white/5 space-y-1.5">
                  {badge.earned ? (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#e0b364] font-medium flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        Unlocked
                      </span>
                      {badge.earnedAt && (
                        <span className="text-[#8a6040]">
                          {new Date(badge.earnedAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-[#8a6040]">Progress</span>
                        <span className="text-[#a6907c] font-medium">
                          {badge.currentProgress.toLocaleString()} / {badge.targetProgress.toLocaleString()} ({badge.progressPercent}%)
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[#0f0705] overflow-hidden border border-white/5">
                        <div
                          className="h-full bg-[#c9a87a]/60 rounded-full transition-all duration-500"
                          style={{ width: `${badge.progressPercent}%` }}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
