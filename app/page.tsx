import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, TrendingUp, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <BookOpen className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold text-gradient font-sans">Bookify</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up Free</Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-muted-foreground mb-8">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Books are the input. Identity is the output.</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 font-sans">
          <span className="text-gradient">Bookify</span>
        </h1>
        <p className="text-2xl md:text-3xl text-foreground mb-4 font-semibold">
          Your reading, <span className="text-primary">reimagined</span>.
        </p>
        <p className="text-lg text-muted-foreground max-w-2xl mb-10">
          Track your reads, build your streak, discover who you&apos;re becoming
          as a reader. Not just a catalogue — a mirror.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="gap-2 text-base px-8 glow-primary" asChild>
            <Link href="/signup">
              Start Reading <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="text-base px-8" asChild>
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="max-w-5xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-6">
        {[
          {
            icon: BookOpen,
            title: "Your Library",
            desc: "Every book you've read, are reading, or want to read — beautifully organized.",
          },
          {
            icon: TrendingUp,
            title: "Reading Streaks",
            desc: "Build a daily habit with streaks, XP, and goals that actually feel achievable.",
          },
          {
            icon: Sparkles,
            title: "Reader Identity",
            desc: "Discover your reading archetype — The Midnight Librarian, The Fantasy Wanderer, and more.",
          },
        ].map((f) => (
          <div key={f.title} className="glass rounded-2xl p-6 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <f.icon className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">{f.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
