import { BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { fetchUniqueBooksByCategory } from "@/lib/google-books";
import { GoogleBookVolume } from "@/types/google-books";

const rowConfig = [
  { title: "Made For You", query: "fiction", category: "fiction", options: {} },
  { title: "Trending Now", query: "trending-now", category: "", options: { q: "bestsellers" } },
  { title: "New Releases", query: "new-releases", category: "fiction", options: { orderBy: "newest" as const } },
  { title: "Hidden Gems", query: "hidden-gems", category: "poetry", options: {} },
  { title: "Popular This Week", query: "popular-this-week", category: "", options: { q: "popular fiction" } },
];

interface BookRowsProps {
  q?: string;
  mood?: string;
}

export async function BookRows({ q, mood }: BookRowsProps) {
  const isSearchMode = !!q;
  const targetConfig = isSearchMode
    ? [{ title: "Search Results", query: "", category: "", options: {} }]
    : rowConfig;

  // How many books we want per row. 18 for search results grid, 6 for standard rows.
  const rowTargetCount = isSearchMode ? 18 : 6;

  const seenIds = new Set<string>();
  const rowData: Array<{
    title: string;
    query: string;
    items: GoogleBookVolume[];
    error?: boolean;
  }> = [];

  // Sequential fetching to guarantee deduplication
  for (const row of targetConfig) {
    try {
      const randomStart = q ? 0 : Math.floor(Math.random() * 80);
      let { items } = await fetchUniqueBooksByCategory(
        row.category,
        rowTargetCount,
        seenIds,
        { q, mood, ...row.options },
        randomStart
      );

      // Fallback if we didn't get enough books due to high startIndex
      if (items.length < rowTargetCount && randomStart > 0) {
        const fallback = await fetchUniqueBooksByCategory(
          row.category,
          rowTargetCount - items.length,
          seenIds,
          { q, mood, ...row.options },
          0
        );
        items = [...items, ...fallback.items];
      }

      rowData.push({ title: row.title, query: row.query, items });
    } catch (error) {
      console.error(`Failed to fetch ${row.title}:`, error);
      rowData.push({ title: row.title, query: row.query, items: [], error: true });
    }
  }

  const totalBooks = rowData.reduce((acc, row) => acc + row.items.length, 0);

  if (totalBooks === 0) {
    return (
      <div className="py-20 text-center">
        <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground">No books found</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Try adjusting your search or selecting a different mood.
        </p>
      </div>
    );
  }

  return (
    <>
      {rowData.map((row) => {
        if (row.items.length === 0) return null;

        return (
          <div key={row.title} className={isSearchMode ? "pb-8" : ""}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">{row.title}</h2>
              {!isSearchMode && (
                <Link
                  href={(() => {
                    const params = new URLSearchParams();
                    params.set("title", row.title);
                    // Pass the row's category and extra options so the category page
                    // can replicate the exact same query
                    const cfg = rowConfig.find((r) => r.query === row.query);
                    if (cfg?.category) params.set("category", cfg.category);
                    if (cfg?.options && "q" in cfg.options && cfg.options.q) params.set("q", cfg.options.q as string);
                    if (cfg?.options && "orderBy" in cfg.options && cfg.options.orderBy) params.set("orderBy", cfg.options.orderBy as string);
                    return `/discover/category/${encodeURIComponent(row.query)}?${params.toString()}`;
                  })()}
                  className="text-xs text-primary hover:underline"
                >
                  See all
                </Link>
              )}
            </div>
            <div
              className={`flex gap-4 ${
                isSearchMode ? "flex-wrap" : "overflow-x-auto pb-2 scrollbar-hide"
              }`}
            >
              {row.items.map((book) => {
                const coverUrl =
                  book.volumeInfo.imageLinks?.thumbnail?.replace("http:", "https:") ||
                  book.volumeInfo.imageLinks?.smallThumbnail?.replace("http:", "https:");
                const title = book.volumeInfo.title;
                const author = book.volumeInfo.authors?.[0] || "Unknown Author";

                return (
                  <Link
                    key={book.id}
                    href={`/book/${book.id}`}
                    className="shrink-0 w-28 group cursor-pointer mb-4 block"
                  >
                    <div className="relative w-28 h-40 rounded-xl bg-muted/50 flex items-center justify-center mb-2 group-hover:bg-muted/70 transition-colors overflow-hidden">
                      {coverUrl ? (
                        <Image
                          src={coverUrl}
                          alt={title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 112px, 112px"
                        />
                      ) : (
                        <BookOpen className="h-8 w-8 text-muted-foreground/30" />
                      )}
                    </div>
                    <p
                      className="text-xs text-muted-foreground text-center truncate px-1"
                      title={title}
                    >
                      {title}
                    </p>
                    <p
                      className="text-[10px] text-muted-foreground/80 text-center truncate px-1"
                      title={author}
                    >
                      {author}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}

export function BookRowsSkeleton() {
  return (
    <div className="animate-pulse space-y-8 mt-8">
      {rowConfig.map((row) => (
        <div key={row.title}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">{row.title}</h2>
            <div className="w-12 h-4 bg-muted rounded"></div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="shrink-0 w-28">
                <div className="w-28 h-40 rounded-xl bg-muted/50 mb-2"></div>
                <div className="w-3/4 h-3 bg-muted rounded mx-auto mb-1"></div>
                <div className="w-1/2 h-3 bg-muted/50 rounded mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}