"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface MoodOption {
  value: string;
  label: string;
}

interface MoodFilterProps {
  selectedMood?: string;
  currentQuery?: string;
}

export function MoodFilter({ selectedMood, currentQuery }: MoodFilterProps) {
  const [moods, setMoods] = useState<MoodOption[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;

    fetch("/api/v1/moods")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setMoods(data.moods ?? []);
      })
      .catch((err) => {
        console.error("Failed to load moods:", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function handleSelect(moodValue: string) {
    const params = new URLSearchParams();
    if (currentQuery) params.set("q", currentQuery);

    // Tapping the already-selected mood clears the filter (toggle behavior)
    if (selectedMood === moodValue) {
      router.push(`${pathname}?${params.toString()}`);
    } else {
      params.set("mood", moodValue);
      router.push(`${pathname}?${params.toString()}`);
    }
  }

  if (loading) {
    return (
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Mood</p>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="shrink-0 w-20 h-9 rounded-full bg-muted/50" />
          ))}
        </div>
      </div>
    );
  }

  if (moods.length === 0) return null;

  return (
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Mood</p>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {moods.map((mood) => {
          const isSelected = selectedMood === mood.value;
          return (
            <button
              key={mood.value}
              onClick={() => handleSelect(mood.value)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                isSelected
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-muted/50 text-foreground/85 hover:bg-muted/70"
              }`}
            >
              {mood.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}