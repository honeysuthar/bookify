import { Search, BookOpen } from "lucide-react";

const moods = [
  "Cozy", "Adventure", "Romantic", "Mysterious", "Motivated", "Hopeful",
];

const rows = [
  "Made For You",
  "Trending Now",
  "New Releases",
  "Hidden Gems",
  "Popular This Week",
];

export default function DiscoverLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 pt-20 md:pt-24 pb-16 space-y-8 animate-pulse">
      {/* Header + Search */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#f0dfc0]">Town Bookstore</h1>
          <p className="text-xs text-[#a6907c] mt-1">Browse new arrivals, curated collections, and community favorites</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <div className="w-full h-[42px] rounded-xl bg-muted/50 border border-border" />
        </div>
      </div>

      {/* Mood strip */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Mood</p>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {moods.map((mood) => (
            <div
              key={mood}
              className="shrink-0 px-4 py-2 rounded-full bg-muted/50 text-sm text-transparent border border-transparent"
            >
              {mood}
            </div>
          ))}
        </div>
      </div>

      {/* Book rows skeleton */}
      {rows.map((row) => (
        <div key={row}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">{row}</h2>
            <div className="w-12 h-4 bg-muted rounded"></div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="shrink-0 w-28">
                <div className="w-28 h-40 rounded-xl bg-muted/50 mb-2"></div>
                <div className="w-3/4 h-3 bg-muted rounded mx-auto mb-1"></div>
                <div className="w-1/2 h-3 bg-muted/50 rounded mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
