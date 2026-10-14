import { Suspense } from "react";
import { SearchInput } from "@/components/discover/search-input";
import { MoodFilter } from "@/components/discover/mood-filter";
import { BookRows, BookRowsSkeleton } from "@/components/discover/book-rows";

export const dynamic = "force-dynamic";

export default function DiscoverPage({ searchParams }: { searchParams: { mood?: string; q?: string } }) {
  const selectedMood = searchParams.mood;
  const currentQuery = searchParams.q;

  return (
    <div className="max-w-5xl mx-auto px-4 pt-20 md:pt-24 pb-16 space-y-8">
      {/* Header + Search */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#f0dfc0]">Town Bookstore</h1>
          <p className="text-xs text-[#a6907c] mt-1">Browse new arrivals, curated collections, and community favorites</p>
        </div>
        <SearchInput />
      </div>

      {/* Mood strip — MoodFilter fetches its own options from /api/v1/moods,
          per its existing props interface (selectedMood, currentQuery only) */}
      <MoodFilter selectedMood={selectedMood} currentQuery={currentQuery} />

      {/* Book rows */}
      <Suspense key={`${currentQuery || ""}-${selectedMood || ""}`} fallback={<BookRowsSkeleton />}>
        <BookRows q={currentQuery} mood={selectedMood} />
      </Suspense>
    </div>
  );
}