"use client";

import { useState } from "react";
import { Check, Plus, ChevronDown } from "lucide-react";
import { useLibrary, ReadingStatus } from "@/lib/library-store";

interface AddToLibraryButtonProps {
  book: {
    id: string;
    title: string;
    author: string;
    coverUrl?: string;
  };
  className?: string;
}

const SHELF_OPTIONS: { value: ReadingStatus; label: string }[] = [
  { value: "WANT_TO_READ", label: "Want to Read" },
  { value: "CURRENTLY_READING", label: "Currently Reading" },
];

export function AddToLibraryButton({ book, className = "" }: AddToLibraryButtonProps) {
  const { isInLibrary, getEntry, addBook, removeBook, updateStatus } = useLibrary();
  const [menuOpen, setMenuOpen] = useState(false);

  const inLibrary = isInLibrary(book.id);
  const entry = getEntry(book.id);

  function handleAdd(status: ReadingStatus) {
    // Optimistic — no network round trip to wait on, matches UX Blueprint §2.4
    addBook({
      bookId: book.id,
      title: book.title,
      author: book.author,
      coverUrl: book.coverUrl,
      status,
    });
    setMenuOpen(false);
  }

  function handleRemove() {
    removeBook(book.id);
    setMenuOpen(false);
  }

  if (!inLibrary) {
    return (
      <div className={`relative inline-block ${className}`}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 px-6 h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-transform active:scale-[0.97]"
        >
          <Plus className="h-4 w-4" />
          Add to Library
        </button>

        {menuOpen && (
          <>
            {/* Click-outside catcher */}
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute left-0 top-full mt-2 w-56 rounded-xl border border-border bg-popover shadow-lg overflow-hidden z-20">
              {SHELF_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleAdd(opt.value)}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-muted/60 transition-colors"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  const currentLabel =
    SHELF_OPTIONS.find((o) => o.value === entry?.status)?.label ??
    entry?.status.replace(/_/g, " ");

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onClick={() => setMenuOpen((v) => !v)}
        className="flex items-center gap-2 px-6 h-12 rounded-xl bg-muted text-foreground font-semibold text-sm border border-border transition-transform active:scale-[0.97]"
      >
        <Check className="h-4 w-4 text-primary" />
        {currentLabel}
        <ChevronDown className="h-4 w-4 opacity-60" />
      </button>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
          <div className="absolute left-0 top-full mt-2 w-56 rounded-xl border border-border bg-popover shadow-lg overflow-hidden z-20">
            {SHELF_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  updateStatus(book.id, opt.value);
                  setMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm hover:bg-muted/60 transition-colors ${
                  entry?.status === opt.value ? "text-primary font-medium" : ""
                }`}
              >
                {opt.label}
              </button>
            ))}
            <div className="h-px bg-border" />
            <button
              onClick={handleRemove}
              className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-muted/60 transition-colors"
            >
              Remove from Library
            </button>
          </div>
        </>
      )}
    </div>
  );
}