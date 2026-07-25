import { BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { fetchUniqueBooksByCategory } from "@/lib/google-books";

interface CategoryPageProps {
  params: { query: string };
  searchParams: {
    title?: string;
    category?: string;
    q?: string;
    orderBy?: "relevance" | "newest";
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const rawQuery = decodeURIComponent(params.query);
  const title = searchParams.title ? decodeURIComponent(searchParams.title) : rawQuery;

  // Reconstruct the same search options that the discover row used
  const category = searchParams.category ?? rawQuery;
  const searchOptions: { q?: string; orderBy?: "relevance" | "newest" } = {};
  if (searchParams.q) searchOptions.q = searchParams.q;
  if (searchParams.orderBy) searchOptions.orderBy = searchParams.orderBy;

  const { items } = await fetchUniqueBooksByCategory(category, 30, new Set(), searchOptions);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link
        href="/discover"
        className="text-sm text-[#8a6040] hover:text-[#c9a87a] transition-colors mb-6 inline-flex items-center gap-1.5"
      >
        ← Back to Discover
      </Link>
      <h1 className="text-3xl font-bold text-[#f0dfc0] mb-6 mt-2">{title}</h1>

      {items.length === 0 ? (
        <div className="py-20 text-center">
          <BookOpen className="h-12 w-12 text-[#5a3a22]/50 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#e8d5c0]">No books found</h3>
          <p className="text-sm text-[#5a3a22] mt-1">Try browsing a different category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {items.map((book) => {
            const coverUrl =
              book.volumeInfo.imageLinks?.thumbnail?.replace("http:", "https:") ||
              book.volumeInfo.imageLinks?.smallThumbnail?.replace("http:", "https:");
            const bookTitle = book.volumeInfo.title;
            const author = book.volumeInfo.authors?.[0] || "Unknown Author";

            return (
              <Link key={book.id} href={`/book/${book.id}`} className="group block">
                <div className="relative w-full aspect-[2/3] rounded-xl bg-[#1a0d07] border border-[#2a1508]/60 flex items-center justify-center mb-2 overflow-hidden transition-all group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-black/40">
                  {coverUrl ? (
                    <Image
                      src={coverUrl}
                      alt={bookTitle}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="200px"
                    />
                  ) : (
                    <BookOpen className="h-8 w-8 text-[#5a3a22]" />
                  )}
                </div>
                <p className="text-xs text-[#c9a87a] font-medium truncate px-1" title={bookTitle}>
                  {bookTitle}
                </p>
                <p className="text-[10px] text-[#5a3a22] truncate px-1" title={author}>
                  {author}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
