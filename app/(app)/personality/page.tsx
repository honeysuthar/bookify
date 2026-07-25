import { Sparkles } from "lucide-react";

export default function PersonalityPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Personality Evolution</h1>
      <p className="text-sm text-muted-foreground">Who you&apos;re becoming as a reader, over time.</p>

      {/* Current archetype */}
      <div className="glass rounded-2xl p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="h-8 w-8 text-primary/60" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">The Emerging Reader</h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Your reading identity is just beginning to form. Every book you finish adds a new layer to your story.
        </p>
      </div>

      {/* Timeline placeholder */}
      <div className="glass rounded-2xl p-6">
        <p className="text-sm font-medium text-foreground mb-4">Evolution Timeline</p>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-primary shrink-0" />
          <div className="flex-1 h-0.5 bg-border" />
          <div className="w-3 h-3 rounded-full bg-muted shrink-0" />
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Your timeline will grow as your archetype evolves.
        </p>
      </div>
    </div>
  );
}
