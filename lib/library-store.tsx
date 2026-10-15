"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useSession } from "next-auth/react";
import {
  getUserLibraryAction,
  addBookToLibraryAction,
  removeBookFromLibraryAction,
  updateLibraryEntryAction,
  getUserFavoritesAction,
  toggleFavoriteAction,
} from "@/app/actions/library";

// Mirrors ReadingStatus in schema.prisma
export type ReadingStatus =
  | "WANT_TO_READ"
  | "CURRENTLY_READING"
  | "FINISHED"
  | "PAUSED"
  | "DID_NOT_FINISH";

export interface LibraryEntry {
  bookId: string;
  title: string;
  author: string;
  coverUrl?: string;
  status: ReadingStatus;
  addedAt: string;
}

export interface FavoriteEntry {
  bookId: string;
  title: string;
  author: string;
  coverUrl?: string;
  addedAt: string;
}

interface LibraryContextValue {
  library: Record<string, LibraryEntry>;
  favorites: Record<string, FavoriteEntry>;
  addBook: (
    book: Omit<LibraryEntry, "status" | "addedAt"> & { status?: ReadingStatus }
  ) => void;
  removeBook: (bookId: string) => void;
  updateStatus: (bookId: string, status: ReadingStatus) => void;
  isInLibrary: (bookId: string) => boolean;
  getEntry: (bookId: string) => LibraryEntry | undefined;
  isFavorite: (bookId: string) => boolean;
  toggleFavorite: (book: {
    bookId: string;
    title: string;
    author?: string;
    coverUrl?: string;
  }) => Promise<boolean>;
  loading: boolean;
}

const LibraryContext = createContext<LibraryContextValue | null>(null);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [library, setLibrary] = useState<Record<string, LibraryEntry>>({});
  const [favorites, setFavorites] = useState<Record<string, FavoriteEntry>>({});
  const [loading, setLoading] = useState(true);

  // Fetch library entries and favorites from database Server Action
  const fetchAll = async () => {
    try {
      const [libRes, favRes] = await Promise.all([
        getUserLibraryAction(""),
        getUserFavoritesAction(""),
      ]);

      if (libRes.success && libRes.data) {
        const mappedLib: Record<string, LibraryEntry> = {};
        for (const entry of libRes.data) {
          const key = entry.book.externalId || entry.book.id;
          mappedLib[key] = {
            bookId: key,
            title: entry.book.title,
            author: entry.book.authors?.map((a: any) => a.author.name).join(", ") || "",
            coverUrl: entry.book.coverUrl || undefined,
            status: entry.status,
            addedAt: new Date(entry.addedAt).toISOString(),
          };
        }
        setLibrary(mappedLib);
      }

      if (favRes.success && favRes.data) {
        const mappedFav: Record<string, FavoriteEntry> = {};
        for (const fav of favRes.data) {
          const key = fav.book.externalId || fav.book.id;
          mappedFav[key] = {
            bookId: key,
            title: fav.book.title,
            author: fav.book.authors?.map((a: any) => a.author.name).join(", ") || "",
            coverUrl: fav.book.coverUrl || undefined,
            addedAt: new Date(fav.createdAt).toISOString(),
          };
        }
        setFavorites(mappedFav);
      }
    } catch (err) {
      console.error("Failed to fetch library/favorites:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchAll();
    } else if (status === "unauthenticated") {
      setLibrary({});
      setFavorites({});
      setLoading(false);
    }
  }, [status, session?.user?.id]);

  async function addBook(
    book: Omit<LibraryEntry, "status" | "addedAt"> & { status?: ReadingStatus }
  ) {
    const status = book.status ?? "WANT_TO_READ";
    const newEntry: LibraryEntry = {
      bookId: book.bookId,
      title: book.title,
      author: book.author,
      coverUrl: book.coverUrl,
      status,
      addedAt: new Date().toISOString(),
    };
    setLibrary((prev) => ({
      ...prev,
      [book.bookId]: newEntry,
    }));

    try {
      const result = await addBookToLibraryAction("", book.bookId, status, {
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl,
      });
      if (!result.success) {
        console.error("Server failed to add book to library:", result.error);
        fetchAll();
      } else {
        fetchAll();
      }
    } catch (err) {
      console.error("Failed to add book to library:", err);
      fetchAll();
    }
  }

  async function removeBook(bookId: string) {
    setLibrary((prev) => {
      const next = { ...prev };
      delete next[bookId];
      return next;
    });

    try {
      const result = await removeBookFromLibraryAction("", bookId);
      if (!result.success) {
        console.error("Server failed to remove book:", result.error);
        fetchAll();
      } else {
        fetchAll();
      }
    } catch (err) {
      console.error("Failed to remove book:", err);
      fetchAll();
    }
  }

  async function updateStatus(bookId: string, status: ReadingStatus) {
    setLibrary((prev) => {
      const existing = prev[bookId];
      if (!existing) return prev;
      return { ...prev, [bookId]: { ...existing, status } };
    });

    try {
      const result = await updateLibraryEntryAction("", bookId, { status });
      if (!result.success) {
        console.error("Server failed to update status:", result.error);
        fetchAll();
      } else {
        fetchAll();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      fetchAll();
    }
  }

  function isInLibrary(bookId: string) {
    return !!library[bookId];
  }

  function getEntry(bookId: string) {
    return library[bookId];
  }

  function isFavorite(bookId: string) {
    return !!favorites[bookId];
  }

  async function toggleFavorite(book: {
    bookId: string;
    title: string;
    author?: string;
    coverUrl?: string;
  }): Promise<boolean> {
    const currentlyFav = !!favorites[book.bookId];

    // Optimistic UI update
    setFavorites((prev) => {
      const next = { ...prev };
      if (currentlyFav) {
        delete next[book.bookId];
      } else {
        next[book.bookId] = {
          bookId: book.bookId,
          title: book.title,
          author: book.author || "",
          coverUrl: book.coverUrl,
          addedAt: new Date().toISOString(),
        };
      }
      return next;
    });

    try {
      const res = await toggleFavoriteAction("", book.bookId, {
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl,
      });

      if (res.success && res.data) {
        return res.data.favorited;
      }
      fetchAll();
      return currentlyFav;
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      fetchAll();
      return currentlyFav;
    }
  }

  return (
    <LibraryContext.Provider
      value={{
        library,
        favorites,
        addBook,
        removeBook,
        updateStatus,
        isInLibrary,
        getEntry,
        isFavorite,
        toggleFavorite,
        loading,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used within a LibraryProvider");
  return ctx;
}