import { Award } from "lucide-react";

const badges = [
  { key: "FIRST_BOOK", name: "First Chapter", desc: "Finish your first book", earned: false },
  { key: "STREAK_7", name: "Week Warrior", desc: "Read 7 days in a row", earned: false },
  { key: "STREAK_30", name: "Month Master", desc: "Read 30 days in a row", earned: false },
  { key: "GENRE_EXPLORER", name: "Genre Explorer", desc: "Read books in 3 different genres", earned: false },
  { key: "NIGHT_OWL", name: "Night Owl", desc: "Log 5 late-night reading sessions", earned: false },
  { key: "PAGE_TURNER", name: "Page Turner", desc: "Read 500 pages total", earned: false },
];

export default function AchievementsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Achievements</h1>

      {/* XP strip */}
      <div className="glass rounded-xl p-4 flex items-center gap-4">
        <Award className="h-6 w-6 text-primary shrink-0" />
        <div className="flex-1">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-foreground font-medium">Level 1</span>
            <span className="text-muted-foreground">0 / 100 XP</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-primary" style={{ width: "0%" }} />
          </div>
        </div>
      </div>

      {/* Badge grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.key}
            className={`glass rounded-2xl p-5 flex flex-col items-center text-center gap-3 ${
              !badge.earned ? "opacity-40" : ""
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              badge.earned ? "bg-primary/30" : "bg-muted/40"
            }`}>
              <Award className={`h-6 w-6 ${badge.earned ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{badge.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{badge.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
