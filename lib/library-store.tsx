"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getUserLibraryAction, addBookToLibraryAction, removeBookFromLibraryAction, updateLibraryEntryAction } from "@/app/actions/library";

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

interface LibraryContextValue {
  library: Record<string, LibraryEntry>;
  addBook: (
    book: Omit<LibraryEntry, "status" | "addedAt"> & { status?: ReadingStatus }
  ) => void;
  removeBook: (bookId: string) => void;
  updateStatus: (bookId: string, status: ReadingStatus) => void;
  isInLibrary: (bookId: string) => boolean;
  getEntry: (bookId: string) => LibraryEntry | undefined;
  loading: boolean;
}

const LibraryContext = createContext<LibraryContextValue | null>(null);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [library, setLibrary] = useState<Record<string, LibraryEntry>>({});
  const [loading, setLoading] = useState(true);

  // Fetch library entries from database Server Action
  const fetchLibrary = async () => {
    try {
      const res = await getUserLibraryAction("");
      if (res.success && res.data) {
        const mapped: Record<string, LibraryEntry> = {};
        for (const entry of res.data) {
          const key = entry.book.externalId || entry.book.id;
          mapped[key] = {
            bookId: key,
            title: entry.book.title,
            author: entry.book.authors.map((a: any) => a.author.name).join(", "),
            coverUrl: entry.book.coverUrl || undefined,
            status: entry.status,
            addedAt: new Date(entry.addedAt).toISOString(),
          };
        }
        setLibrary(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch library from database:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  async function addBook(
    book: Omit<LibraryEntry, "status" | "addedAt"> & { status?: ReadingStatus }
  ) {
    const status = book.status ?? "WANT_TO_READ";
    // Optimistic update
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
        fetchLibrary(); // Rollback/Sync
      } else {
        fetchLibrary(); // Pull fresh database state
      }
    } catch (err) {
      console.error("Failed to add book to library:", err);
      fetchLibrary(); // Rollback/Sync
    }
  }

  async function removeBook(bookId: string) {
    // Optimistic update
    setLibrary((prev) => {
      const next = { ...prev };
      delete next[bookId];
      return next;
    });

    try {
      const result = await removeBookFromLibraryAction("", bookId);
      if (!result.success) {
        console.error("Server failed to remove book:", result.error);
        fetchLibrary(); // Rollback/Sync
      } else {
        fetchLibrary(); // Pull fresh database state
      }
    } catch (err) {
      console.error("Failed to remove book:", err);
      fetchLibrary(); // Rollback/Sync
    }
  }

  async function updateStatus(bookId: string, status: ReadingStatus) {
    // Optimistic update
    setLibrary((prev) => {
      const existing = prev[bookId];
      if (!existing) return prev;
      return { ...prev, [bookId]: { ...existing, status } };
    });

    try {
      const result = await updateLibraryEntryAction("", bookId, { status });
      if (!result.success) {
        console.error("Server failed to update status:", result.error);
        fetchLibrary(); // Rollback/Sync
      } else {
        fetchLibrary(); // Pull fresh database state
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      fetchLibrary(); // Rollback/Sync
    }
  }

  function isInLibrary(bookId: string) {
    return !!library[bookId];
  }

  function getEntry(bookId: string) {
    return library[bookId];
  }

  return (
    <LibraryContext.Provider
      value={{ library, addBook, removeBook, updateStatus, isInLibrary, getEntry, loading }}
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