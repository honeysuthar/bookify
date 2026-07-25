export default function DNAPage() {
  const segments = [
    { label: "Fantasy", pct: 0, color: "bg-violet-500" },
    { label: "Mystery", pct: 0, color: "bg-pink-500" },
    { label: "Sci-Fi", pct: 0, color: "bg-teal-500" },
    { label: "Romance", pct: 0, color: "bg-rose-500" },
    { label: "Non-Fiction", pct: 0, color: "bg-amber-500" },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Reading DNA</h1>
      <p className="text-sm text-muted-foreground">Your genre fingerprint, built from every book you finish.</p>

      {/* Spine visualization */}
      <div className="glass rounded-2xl p-6">
        <div className="flex gap-1 h-10 rounded-full overflow-hidden mb-6">
          {segments.map((s) => (
            <div
              key={s.label}
              className={`${s.color} opacity-30 flex-1 rounded-full`}
            />
          ))}
        </div>

        <div className="space-y-3">
          {segments.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${s.color}`} />
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground font-medium">{s.label}</span>
                  <span className="text-muted-foreground">—</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full ${s.color} opacity-60`} style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Finish a few books to reveal your true reading DNA.
      </p>
    </div>
  );
}
