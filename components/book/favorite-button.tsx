"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useLibrary } from "@/lib/library-store";

interface FavoriteButtonProps {
  book: {
    id: string;
    title: string;
    author?: string;
    coverUrl?: string;
  };
  showLabel?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function FavoriteButton({
  book,
  showLabel = false,
  className = "",
  size = "md",
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useLibrary();
  const [animating, setAnimating] = useState(false);

  const favorited = isFavorite(book.id);

  async function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);

    await toggleFavorite({
      bookId: book.id,
      title: book.title,
      author: book.author,
      coverUrl: book.coverUrl,
    });
  }

  const iconSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  if (showLabel) {
    return (
      <button
        type="button"
        onClick={handleToggle}
        className={`flex items-center gap-2 px-5 h-12 rounded-xl text-sm font-semibold transition-all border ${
          favorited
            ? "bg-red-950/40 border-red-500/50 text-red-400 shadow-md shadow-red-950/20"
            : "bg-[#160a05]/80 border-[#2a1508] text-[#a6907c] hover:text-[#f0dfc0] hover:border-[#c9a87a]/40"
        } ${className}`}
        title={favorited ? "Remove from Favorites" : "Add to Favorites"}
      >
        <Heart
          className={`${iconSizes[size]} transition-transform duration-300 ${
            animating ? "scale-125" : "scale-100"
          } ${favorited ? "fill-red-500 text-red-500" : ""}`}
        />
        <span>{favorited ? "Favorited" : "Favorite"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`p-2 rounded-xl transition-all flex items-center justify-center border ${
        favorited
          ? "bg-red-950/50 border-red-500/50 text-red-400 shadow-sm"
          : "bg-black/50 border-white/10 text-white/70 hover:text-white hover:bg-black/70"
      } ${className}`}
      title={favorited ? "Remove from Favorites" : "Add to Favorites"}
      aria-label={favorited ? "Remove from Favorites" : "Add to Favorites"}
    >
      <Heart
        className={`${iconSizes[size]} transition-transform duration-300 ${
          animating ? "scale-125" : "scale-100"
        } ${favorited ? "fill-red-500 text-red-500" : ""}`}
      />
    </button>
  );
}
