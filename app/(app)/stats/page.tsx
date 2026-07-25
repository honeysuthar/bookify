import { TrendingUp } from "lucide-react";

export default function StatsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Reading Analytics</h1>

      {/* Period selector */}
      <div className="flex gap-2">
        {["Week", "Month", "Year"].map((p, i) => (
          <button
            key={p}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              i === 0 ? "bg-primary text-primary-foreground" : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Heatmap placeholder */}
      <div className="glass rounded-2xl p-6">
        <p className="text-sm font-medium text-foreground mb-4">Reading Heatmap</p>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-sm bg-muted/30" />
          ))}
        </div>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Pages Read", value: "0" },
          { label: "Sessions", value: "0" },
          { label: "Avg Session", value: "0 min" },
          { label: "Longest", value: "0 min" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3 text-center">
        <TrendingUp className="h-8 w-8 text-primary/40" />
        <p className="text-sm text-muted-foreground">Log reading sessions to see your trends here.</p>
      </div>
    </div>
  );
}
