"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, Plus, Pencil, Trash2, X } from "lucide-react";
import { createJournalEntry, updateJournalEntry, deleteJournalEntry } from "@/app/actions/journal";

type Book = { id: string; title: string; authors?: any; coverUrl?: string | null };
type JournalEntry = {
  id: string;
  title: string | null;
  content: string;
  rating: number | null;
  createdAt: Date;
  book: Book;
};

export default function JournalClient({
  initialEntries,
  libraryBooks,
}: {
  initialEntries: JournalEntry[];
  libraryBooks: Book[];
}) {
  const [entries, setEntries] = useState<JournalEntry[]>(initialEntries);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedBookId, setSelectedBookId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState<number>(0);

  const openNewModal = () => {
    setEditingId(null);
    setSelectedBookId(libraryBooks[0]?.id || "");
    setTitle("");
    setContent("");
    setRating(0);
    setIsModalOpen(true);
  };

  const openEditModal = (entry: JournalEntry) => {
    setEditingId(entry.id);
    setSelectedBookId(entry.book.id);
    setTitle(entry.title || "");
    setContent(entry.content);
    setRating(entry.rating || 0);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookId || !content) return;
    
    setIsLoading(true);
    try {
      if (editingId) {
        await updateJournalEntry(editingId, content, title, rating || undefined);
      } else {
        await createJournalEntry(selectedBookId, content, title, rating || undefined);
      }
      
      // Update local state temporarily (it will refresh on reload, but good for immediate feedback)
      window.location.reload(); // Simple way to refresh data
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      closeModal();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    
    try {
      await deleteJournalEntry(id);
      setEntries(entries.filter(e => e.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pt-20 md:pt-24 pb-16 space-y-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#f0dfc0]">Reading Journal</h1>
          <p className="text-xs text-[#a6907c] mt-1">Record your thoughts, favorite quotes, and reflections</p>
        </div>
        <Button onClick={openNewModal} className="flex items-center gap-2 bg-[#c9a87a] text-[#0f0705] hover:bg-[#d8b88a]">
          <Plus className="h-4 w-4" />
          New Entry
        </Button>
      </div>

      {entries.length === 0 ? (
        <div className="bg-[#160a05]/85 backdrop-blur-md border border-[#2a1508] rounded-2xl p-12 text-center flex flex-col items-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-[#c9a87a]/15 flex items-center justify-center mb-4 border border-[#c9a87a]/25">
            <Pencil className="h-8 w-8 text-[#c9a87a]" />
          </div>
          <h2 className="text-xl font-serif font-bold text-[#f0dfc0] mb-2">Your journal is empty</h2>
          <p className="text-[#a6907c] mb-6 max-w-sm text-sm">
            Record your thoughts, favorite quotes, and reflections on the books you read.
          </p>
          <Button onClick={openNewModal} className="bg-[#c9a87a] text-[#0f0705] hover:bg-[#d8b88a] font-semibold">
            Start Writing
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-[#160a05]/85 backdrop-blur-md border border-[#2a1508] rounded-xl p-6 flex flex-col space-y-4 relative group shadow-lg">
              <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEditModal(entry)} className="p-2 hover:bg-accent/30 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(entry.id)} className="p-2 hover:bg-red-950/30 rounded-lg text-muted-foreground hover:text-red-400 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="flex justify-between items-start pr-20">
                <div className="flex items-start gap-4">
                  {entry.book.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={entry.book.coverUrl} alt={entry.book.title} className="w-12 h-16 object-cover rounded-md shadow-sm border border-border" />
                  ) : (
                    <div className="w-12 h-16 bg-accent/30 rounded-md border border-border flex items-center justify-center">
                      <span className="text-[10px] text-muted-foreground text-center leading-tight">No Cover</span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-foreground text-lg">{entry.title || entry.book.title}</h3>
                    <p className="text-sm text-muted-foreground">About: {entry.book.title}</p>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(entry.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed border-l-2 border-primary/50 pl-4 py-1">
                {entry.content}
              </div>
              
              {entry.rating ? (
                <div className="flex items-center gap-1 pt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${star <= entry.rating! ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg glass bg-[#160a05] rounded-2xl border border-border shadow-2xl p-6 relative">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-accent/30 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-bold mb-6 text-foreground">
              {editingId ? "Edit Journal Entry" : "New Journal Entry"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!editingId && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Select Book</label>
                  <select 
                    value={selectedBookId}
                    onChange={(e) => setSelectedBookId(e.target.value)}
                    required
                    className="w-full bg-[#0f0705] border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="" disabled>-- Choose a book from your library --</option>
                    {libraryBooks.map(b => (
                      <option key={b.id} value={b.id}>{b.title}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Entry Title (Optional)</label>
                <input 
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="E.g., My thoughts on chapter 5..."
                  className="w-full bg-[#0f0705] border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Thoughts</label>
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={6}
                  placeholder="What are you thinking? Any favorite quotes?"
                  className="w-full bg-[#0f0705] border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50 resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-6 w-6 transition-colors ${
                          star <= rating ? 'fill-primary text-primary' : 'text-muted-foreground/30 hover:text-primary/50'
                        }`}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <button 
                      type="button" 
                      onClick={() => setRating(0)}
                      className="text-xs text-muted-foreground ml-2 hover:text-foreground"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                <Button type="button" variant="ghost" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Entry"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
