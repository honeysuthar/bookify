import { BookOpen, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getBookDetails, fetchUniqueBooksByCategory } from "@/lib/google-books";
import { AddToLibraryButton } from "@/components/book/add-to-library-button";
import { FavoriteButton } from "@/components/book/favorite-button";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function BookDetailPage({ params }: { params: { id: string } }) {
  let book: any;
  try {
    // Try fetching from Google Books first
    book = await getBookDetails(params.id);
  } catch (error) {
    // Fallback: check the local database for custom/seeded books
    const localBook = await prisma.book.findFirst({
      where: {
        OR: [{ id: params.id }, { externalId: params.id }]
      },
      include: {
        authors: { include: { author: true } },
        genres: { include: { genre: true } }
      }
    });

    if (!localBook) {
      notFound();
    }

    // Map local book to the expected GoogleBookVolume format
    book = {
      id: localBook.id,
      volumeInfo: {
        title: localBook.title,
        authors: localBook.authors.map((a: any) => a.author.name),
        description: localBook.description || "No description available.",
        imageLinks: localBook.coverUrl ? { thumbnail: localBook.coverUrl } : null,
        pageCount: localBook.pageCount,
        categories: localBook.genres.map((g: any) => g.genre.name),
        averageRating: 0,
      }
    };
  }

  const { volumeInfo } = book;
  const title = volumeInfo.title || "Unknown Title";
  const author = volumeInfo.authors?.[0] || "Unknown Author";
  const coverUrl = volumeInfo.imageLinks?.thumbnail?.replace("http:", "https:") ||
                   volumeInfo.imageLinks?.smallThumbnail?.replace("http:", "https:");
  const description = volumeInfo.description || "No description available.";
  const categories = volumeInfo.categories || [];
  const rating = volumeInfo.averageRating || 0;

  const stats = [
    { label: "Pages", value: volumeInfo.pageCount?.toString() || "—" },
    { label: "Published", value: volumeInfo.publishedDate?.split("-")[0] || "—" },
    { label: "Language", value: volumeInfo.language?.toUpperCase() || "—" },
  ];

  // Fetch similar books based on the primary category
  const primaryCategory = categories[0] || "fiction";
  const { items: similarBooks } = await fetchUniqueBooksByCategory(
    primaryCategory,
    5,
    new Set([book.id])
  );

  return (
    <div className="max-w-4xl mx-auto px-4 pt-20 md:pt-24 pb-16">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Cover */}
        <div className="shrink-0 mx-auto md:mx-0">
          <div className="relative w-40 h-56 rounded-2xl bg-muted/50 flex items-center justify-center overflow-hidden">
            {coverUrl ? (
              <Image src={coverUrl} alt={title} fill className="object-cover" sizes="160px" />
            ) : (
              <BookOpen className="h-12 w-12 text-muted-foreground/30" />
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            <p className="text-muted-foreground mt-1">by {author}</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`h-4 w-4 ${s <= Math.round(rating) ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {rating > 0 ? `${rating} / 5` : "No ratings yet"}
            </span>
          </div>

          {categories.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {categories.slice(0, 3).map((g: string) => (
                <span key={g} className="px-3 py-1 rounded-full glass text-xs text-muted-foreground">{g}</span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <AddToLibraryButton
              book={{ id: book.id, title, author, coverUrl }}
              className="w-full sm:w-auto"
            />
            <FavoriteButton
              book={{ id: book.id, title, author, coverUrl }}
              showLabel
              className="w-full sm:w-auto"
            />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-foreground mb-2">About</h2>
            <div
              className="text-sm text-muted-foreground leading-relaxed prose prose-sm prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2">
            {stats.map((m) => (
              <div key={m.label} className="glass rounded-xl p-3 text-center">
                <p className="text-sm font-bold text-foreground">{m.value}</p>
                <p className="text-xs text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Similar books */}
      {similarBooks.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">Similar Books</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {similarBooks.map((simBook) => {
              const simCover = simBook.volumeInfo.imageLinks?.thumbnail?.replace("http:", "https:") ||
                               simBook.volumeInfo.imageLinks?.smallThumbnail?.replace("http:", "https:");
              const simTitle = simBook.volumeInfo.title;

              return (
                <Link key={simBook.id} href={`/book/${simBook.id}`} className="shrink-0 w-24 group">
                  <div className="relative w-24 h-36 rounded-xl bg-muted/40 flex items-center justify-center mb-2 overflow-hidden group-hover:bg-muted/60 transition-colors">
                    {simCover ? (
                      <Image src={simCover} alt={simTitle} fill className="object-cover" sizes="96px" />
                    ) : (
                      <BookOpen className="h-6 w-6 text-muted-foreground/30" />
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground text-center truncate px-1 group-hover:text-foreground transition-colors">
                    {simTitle}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}