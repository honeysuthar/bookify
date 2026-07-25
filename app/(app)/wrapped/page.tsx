import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WrappedPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center mx-auto mb-6">
          <Sparkles className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-3">Bookify Wrapped</h1>
        <p className="text-muted-foreground mb-8">
          Your reading year, beautifully summarized. Keep reading to unlock your first Wrapped.
        </p>
        <div className="glass rounded-2xl p-6 mb-6 text-sm text-muted-foreground">
          Wrapped unlocks after you&apos;ve read at least 3 books or 30 days of activity.
        </div>
        <Button asChild>
          <Link href="/discover">Find Your Next Book</Link>
        </Button>
      </div>
    </div>
  );
}
