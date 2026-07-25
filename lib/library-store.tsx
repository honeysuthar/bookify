"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

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
}

// NOTE: this is a temporary client-side store. Once the DB is connected,
// replace the localStorage read/writes below with calls to
// POST/PATCH /api/v1/library — the addBook/removeBook/updateStatus
// function signatures are written to match that future API shape so
// nothing calling useLibrary() needs to change, only this file's internals.
const STORAGE_KEY = "bookify:library";

const LibraryContext = createContext<LibraryContextValue | null>(null);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [library, setLibrary] = useState<Record<string, LibraryEntry>>({});
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount only (avoids SSR/hydration mismatch)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLibrary(JSON.parse(raw));
    } catch (err) {
      console.error("Failed to load library from storage:", err);
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist on every change, once hydrated
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
    } catch (err) {
      console.error("Failed to save library to storage:", err);
    }
  }, [library, hydrated]);

  function addBook(
    book: Omit<LibraryEntry, "status" | "addedAt"> & { status?: ReadingStatus }
  ) {
    setLibrary((prev) => ({
      ...prev,
      [book.bookId]: {
        bookId: book.bookId,
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl,
        status: book.status ?? "WANT_TO_READ",
        addedAt: new Date().toISOString(),
      },
    }));
  }

  function removeBook(bookId: string) {
    setLibrary((prev) => {
      const next = { ...prev };
      delete next[bookId];
      return next;
    });
  }

  function updateStatus(bookId: string, status: ReadingStatus) {
    setLibrary((prev) => {
      const existing = prev[bookId];
      if (!existing) return prev;
      return { ...prev, [bookId]: { ...existing, status } };
    });
  }

  function isInLibrary(bookId: string) {
    return !!library[bookId];
  }

  function getEntry(bookId: string) {
    return library[bookId];
  }

  return (
    <LibraryContext.Provider
      value={{ library, addBook, removeBook, updateStatus, isInLibrary, getEntry }}
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