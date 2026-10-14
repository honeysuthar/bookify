import { Flame, BookOpen, Star, Zap, Settings, TrendingUp, Award, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function ProfilePage() {
  const sessionUser = await getCurrentUser();


  let dbUser = null;
  if (sessionUser?.email) {
    dbUser = await prisma.user.findUnique({
      where: { email: sessionUser.email }
    });
  }

  const booksRead = dbUser?.totalBooksRead || 0;
  const streak = dbUser?.currentStreak || 0;
  const xp = dbUser?.xp || 0;
  const level = dbUser?.readingLevel || 1;

  return (
    <div className="max-w-2xl mx-auto px-4 pt-20 md:pt-24 pb-16 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">You</h1>
        <Button variant="ghost" size="icon" asChild>
          <Link href="/settings"><Settings className="h-5 w-5" /></Link>
        </Button>
      </div>

      {/* Identity card */}
      <div className="glass rounded-2xl p-6 flex items-start gap-5">
        <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-bold text-2xl shrink-0">
          {(dbUser?.name || sessionUser?.name || "Reader").charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-foreground">{dbUser?.name || sessionUser?.name || "Reader"}</h2>
          <p className="text-sm text-muted-foreground">{dbUser?.email || sessionUser?.email || "@username"}</p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
            <Star className="h-3 w-3" /> The Emerging Reader
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: BookOpen, label: "Books Read", value: booksRead.toString() },
          { icon: Flame, label: "Streak", value: `${streak}d` },
          { icon: Zap, label: "XP", value: xp.toString() },
          { icon: TrendingUp, label: "Level", value: level.toString() },
        ].map((s) => (
          <div key={s.label} className="glass rounded-xl p-3 flex flex-col items-center gap-1 text-center">
            <s.icon className="h-4 w-4 text-primary" />
            <p className="text-lg font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Navigation links */}
      <h2 className="text-xl font-bold text-foreground mt-8 mb-4">Explore More</h2>
      <div className="space-y-3">
        {[
        { href: "/discover", label: "Town Bookstore", desc: "Browse & discover new books", icon: Store },
        { href: "/stats", label: "Reading Analytics", desc: "Heatmap, pace, trends", icon: Award },
        { href: "/dna", label: "Reading DNA", desc: "Your genre fingerprint", icon: Award },
        { href: "/personality", label: "Personality Evolution", desc: "Who you're becoming", icon: Award },
        { href: "/achievements", label: "Achievements", desc: "Badges & milestones", icon: Award },
        { href: "/wrapped", label: "Bookify Wrapped", desc: "Your reading story", icon: Award },
      ].map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex items-center justify-between glass rounded-xl p-4 hover:bg-accent/30 transition-colors group"
        >
          <div>
            <p className="text-sm font-semibold text-foreground">{item.label}</p>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </div>
          <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>
      ))}
      </div>
    </div>
  );
}
