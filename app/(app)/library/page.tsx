"use client";

import { useState, useEffect } from "react";
import { BookOpen, Plus, ChevronDown, Check, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLibrary, ReadingStatus } from "@/lib/library-store";
import { FavoriteButton } from "@/components/book/favorite-button";

type ShelfTab = ReadingStatus | "FAVORITES";

const shelves: { label: string; status: ReadingStatus }[] = [
  { label: "Currently Reading", status: "CURRENTLY_READING" },
  { label: "Want to Read", status: "WANT_TO_READ" },
  { label: "Finished", status: "FINISHED" },
  { label: "Paused", status: "PAUSED" },
  { label: "Did Not Finish", status: "DID_NOT_FINISH" },
];

export default function LibraryPage() {
  const { library, favorites, updateStatus, removeBook, loading } = useLibrary();
  const [activeTab, setActiveTab] = useState<ShelfTab>("CURRENTLY_READING");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [userPickedTab, setUserPickedTab] = useState(false);
  const [brokenCovers, setBrokenCovers] = useState<Set<string>>(new Set());

  const allEntries = Object.values(library);
  const favoriteEntries = Object.values(favorites);

  const shelfCounts = shelves.reduce<Record<string, number>>((acc, shelf) => {
    acc[shelf.label] = allEntries.filter((e) => e.status === shelf.status).length;
    return acc;
  }, {});

  const favoriteCount = favoriteEntries.length;

  useEffect(() => {
    if (userPickedTab) return;
    const firstNonEmpty = shelves.find((s) => shelfCounts[s.label] > 0);
    if (firstNonEmpty && firstNonEmpty.status !== activeTab) {
      setActiveTab(firstNonEmpty.status);
    }
  }, [allEntries.length]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 pt-20 md:pt-24 pb-16 flex items-center justify-center h-[50vh]">
        <p className="text-sm text-muted-foreground animate-pulse">Loading your shelf...</p>
      </div>
    );
  }

  // Display books depending on whether "FAVORITES" or standard shelf tab is active
  const isFavoritesTab = activeTab === "FAVORITES";
  const displayItems = isFavoritesTab
    ? favoriteEntries.map((f) => ({
        bookId: f.bookId,
        title: f.title,
        author: f.author,
        coverUrl: f.coverUrl,
        status: library[f.bookId]?.status,
      }))
    : allEntries
        .filter((e) => e.status === activeTab)
        .map((e) => ({
          bookId: e.bookId,
          title: e.title,
          author: e.author,
          coverUrl: e.coverUrl,
          status: e.status,
        }));

  return (
    <div className="max-w-5xl mx-auto px-4 pt-20 md:pt-24 pb-16 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#f0dfc0]">My Shelf</h1>
          <p className="text-xs text-[#a6907c] mt-1">
            Your personal collection, reading progress, and beloved favorites
          </p>
        </div>
        <Button size="sm" className="gap-2 bg-[#c9a87a] text-[#0f0705] hover:bg-[#d8b88a]" asChild>
          <Link href="/discover">
            <Plus className="h-4 w-4" /> Add Book
          </Link>
        </Button>
      </div>

      {/* Shelf tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {shelves.map((shelf) => (
          <button
            key={shelf.status}
            onClick={() => {
              setActiveTab(shelf.status);
              setUserPickedTab(true);
            }}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === shelf.status
                ? "bg-[#c9a87a] text-[#0f0705] font-semibold shadow-md"
                : "bg-black/40 text-foreground/80 hover:bg-black/60 border border-white/10"
            }`}
          >
            {shelf.label}
            {shelfCounts[shelf.label] > 0 && (
              <span className="ml-2 text-xs opacity-75">{shelfCounts[shelf.label]}</span>
            )}
          </button>
        ))}

        {/* Favorites tab */}
        <button
          onClick={() => {
            setActiveTab("FAVORITES");
            setUserPickedTab(true);
          }}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
            isFavoritesTab
              ? "bg-red-500 text-white font-semibold shadow-md shadow-red-950/30"
              : "bg-black/40 text-foreground/80 hover:bg-black/60 border border-white/10"
          }`}
        >
          <Heart className={`h-3.5 w-3.5 ${isFavoritesTab ? "fill-white text-white" : "fill-red-500 text-red-500"}`} />
          <span>Favorites</span>
          {favoriteCount > 0 && (
            <span className="ml-1 text-xs opacity-85">({favoriteCount})</span>
          )}
        </button>
      </div>

      {/* Empty state */}
      {displayItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 border border-[#c9a87a]/20">
            {isFavoritesTab ? (
              <Heart className="h-8 w-8 text-red-400" />
            ) : (
              <BookOpen className="h-8 w-8 text-[#c9a87a]" />
            )}
          </div>
          <h2 className="text-lg font-serif font-semibold text-[#f0dfc0] mb-2">
            {isFavoritesTab ? "No favorites yet" : "Nothing here yet"}
          </h2>
          <p className="text-sm text-[#a6907c] max-w-xs mb-6">
            {isFavoritesTab
              ? "Tap the heart icon on any book across Bookify to collect your all-time favorites."
              : allEntries.length === 0
              ? "Start by discovering books and saving them to your shelf."
              : `No books on your "${shelves.find((s) => s.status === activeTab)?.label}" shelf yet.`}
          </p>
          <Button asChild className="bg-[#c9a87a] text-[#0f0705] hover:bg-[#d8b88a]">
            <Link href="/discover">Browse Bookstore</Link>
          </Button>
        </div>
      ) : (
        /* Books Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {displayItems.map((entry) => (
            <div key={entry.bookId} className="group relative">
              <Link href={`/book/${entry.bookId}`} className="block">
                <div className="relative w-full aspect-[2/3] rounded-xl bg-[#160a05]/80 border border-[#2a1508] shadow-lg flex items-center justify-center mb-2 overflow-hidden transition-transform group-hover:-translate-y-1 group-hover:shadow-2xl">
                  {entry.coverUrl && !brokenCovers.has(entry.bookId) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={entry.coverUrl}
                      alt={entry.title}
                      className="w-full h-full object-cover"
                      onError={() => setBrokenCovers((prev) => new Set(prev).add(entry.bookId))}
                    />
                  ) : (
                    <BookOpen className="h-8 w-8 text-muted-foreground/30" />
                  )}
                </div>
                <p className="text-xs font-medium text-foreground truncate px-1" title={entry.title}>
                  {entry.title}
                </p>
                <p className="text-[10px] text-muted-foreground truncate px-1" title={entry.author}>
                  {entry.author}
                </p>
              </Link>

              {/* Heart Favorite Button (Top-Left) */}
              <div className="absolute top-2 left-2 z-10">
                <FavoriteButton
                  book={{
                    id: entry.bookId,
                    title: entry.title,
                    author: entry.author,
                    coverUrl: entry.coverUrl,
                  }}
                  size="sm"
                />
              </div>

              {/* Shelf Status / Dropdown Menu (Top-Right) */}
              <div className="absolute top-2 right-2 z-10">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === entry.bookId ? null : entry.bookId);
                  }}
                  className="w-7 h-7 rounded-full bg-background/80 backdrop-blur flex items-center justify-center border border-border"
                  aria-label="Change shelf"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>

                {openMenuId === entry.bookId && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                    <div className="absolute right-0 top-full mt-1 w-44 rounded-xl border border-border bg-popover shadow-lg overflow-hidden z-20">
                      {shelves.map((s) => (
                        <button
                          key={s.status}
                          onClick={() => {
                            updateStatus(entry.bookId, s.status);
                            setOpenMenuId(null);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs hover:bg-muted/60 transition-colors flex items-center gap-1.5 ${
                            entry.status === s.status ? "text-primary font-medium" : ""
                          }`}
                        >
                          {entry.status === s.status && <Check className="h-3 w-3" />}
                          {s.label}
                        </button>
                      ))}
                      {entry.status && (
                        <>
                          <div className="h-px bg-border" />
                          <button
                            onClick={() => {
                              removeBook(entry.bookId);
                              setOpenMenuId(null);
                            }}
                            className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-muted/60 transition-colors"
                          >
                            Remove from Library
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}