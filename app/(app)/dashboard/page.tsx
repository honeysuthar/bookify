"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  X
} from "lucide-react";
import { fetchBooksByCategory } from "@/lib/google-books";
import { GoogleBookVolume, GoogleBooksResponse } from "@/types/google-books";
import { useLibrary } from "@/lib/library-store";
import { getUserByIdAction } from "@/app/actions/users";
import { getUserLibraryAction } from "@/app/actions/library";
import { getStreakLogsAction, createReadingSessionAction } from "@/app/actions/reading";
import { Mood } from "@prisma/client";
import CinematicHero from "@/components/cinematic/CinematicHero";

// Calendar config for the current month
const now            = new Date();
const year           = now.getFullYear();
const month          = now.getMonth();
const daysInMonth    = new Date(year, month + 1, 0).getDate();
const monthDays      = Array.from({ length: daysInMonth }, (_, i) => i + 1);
const firstDayOffset = new Date(year, month, 1).getDay();

export default function DashboardPage() {
  const { library } = useLibrary();

  const [recommendedBooksResponse, setRecommendedBooksResponse] = useState<GoogleBooksResponse>({
    kind: "books#volumes", totalItems: 0, items: [],
  });
  const [userData, setUserData]           = useState<any>(null);
  const [libraryEntries, setLibraryEntries] = useState<any[]>([]);
  const [streakLogs, setStreakLogs]       = useState<any[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  // Session log modal state
  const [isModalOpen, setIsModalOpen]       = useState(false);
  const [submittingSession, setSubmittingSession] = useState(false);
  const [startPage, setStartPage]           = useState(0);
  const [endPage, setEndPage]               = useState(0);
  const [duration, setDuration]             = useState(15);
  const [selectedMood, setSelectedMood]     = useState<Mood>("COZY");

  const loadDashboardData = async () => {
    try {
      const [uRes, libRes, streakRes] = await Promise.all([
        getUserByIdAction(""),
        getUserLibraryAction(""),
        getStreakLogsAction(),
      ]);
      if (uRes.success)    setUserData(uRes.data);
      if (libRes.success)  setLibraryEntries(libRes.data || []);
      if (streakRes.success) setStreakLogs(streakRes.data || []);
    } catch (e) {
      console.error("Failed to load dashboard data:", e);
    } finally {
      setDashboardLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    fetchBooksByCategory("fiction", 6, { q: "bestsellers" })
      .then(setRecommendedBooksResponse)
      .catch(() => setRecommendedBooksResponse({ kind: "books#volumes", totalItems: 0, items: [] }));
  }, []);

  // Derived data
  const currentlyReadingList = libraryEntries.filter((e) => e.status === "CURRENTLY_READING");
  const wantToReadList       = libraryEntries.filter((e) => e.status === "WANT_TO_READ");
  const activeEntry          = currentlyReadingList[0] || wantToReadList[0] || null;

  const readDays = new Set<number>();
  streakLogs.forEach((log) => {
    const d = new Date(log.date);
    if (d.getFullYear() === year && d.getMonth() === month) readDays.add(d.getDate());
  });

  const todayDay          = now.getDate();
  const finishedThisMonth = libraryEntries.filter((e) => {
    if (e.status !== "FINISHED" || !e.finishedAt) return false;
    const d = new Date(e.finishedAt);
    return d.getFullYear() === year && d.getMonth() === month;
  }).length;
  const pagesReadThisMonth = streakLogs.reduce((acc, log) => {
    const d = new Date(log.date);
    return (d.getFullYear() === year && d.getMonth() === month) ? acc + log.pagesRead : acc;
  }, 0);
  const goalProgress = Math.min(100, Math.round((pagesReadThisMonth / 500) * 100));

  // Log modal handlers
  const handleOpenLogModal = () => {
    if (!activeEntry) return;
    setStartPage(activeEntry.currentPage || 0);
    setEndPage(Math.min(
      activeEntry.book.pageCount || (activeEntry.currentPage || 0) + 10,
      (activeEntry.currentPage || 0) + 10,
    ));
    setIsModalOpen(true);
  };

  const handleLogSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEntry) return;
    setSubmittingSession(true);
    try {
      const res = await createReadingSessionAction(activeEntry.book.id, {
        startPage, endPage, durationMinutes: duration, mood: selectedMood,
        startedAt: new Date(Date.now() - duration * 60 * 1000),
        endedAt: new Date(),
      });
      if (res.success) {
        setIsModalOpen(false);
        await loadDashboardData();
      } else {
        alert(res.error || "Failed to log session");
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred");
    } finally {
      setSubmittingSession(false);
    }
  };

  if (dashboardLoading) {
    return (
      <div className="min-h-screen bg-[#0f0705] text-[#e8d5c0] flex items-center justify-center font-serif">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#c9a87a]" />
          <p className="text-sm text-[#8a6040] animate-pulse">Entering the Hearth...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ── Cinematic Hero ── */}
      <CinematicHero
        activeEntry={activeEntry}
        libraryEntries={libraryEntries}
        streakLogs={streakLogs}
        readDays={readDays}
        todayDay={todayDay}
        year={year}
        month={month}
        monthDays={monthDays}
        firstDayOffset={firstDayOffset}
        finishedThisMonth={finishedThisMonth}
        pagesReadThisMonth={pagesReadThisMonth}
        goalProgress={goalProgress}
        recommendedBooksResponse={recommendedBooksResponse}
        onOpenLogModal={handleOpenLogModal}
      />

      {/* ── Reading Session Modal ── */}
      {isModalOpen && activeEntry && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a0f0a] border border-[#3a2212] rounded-2xl w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
            <div className="p-6 border-b border-[#3a2212] flex items-center justify-between bg-gradient-to-r from-[#2a160d] to-[#1a0f0a]">
              <h2 className="text-xl font-serif font-bold text-[#f0dfc0]">Log Reading Session</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-[#8a6040] hover:text-[#c9a87a] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleLogSession} className="p-6 space-y-5">
              <div>
                <p className="text-sm text-[#a6907c] mb-1">Book</p>
                <p className="font-serif font-bold text-[#e8d5c0] truncate">{activeEntry.book.title}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8a6040] mb-2">Start Page</label>
                  <input 
                    type="number" 
                    value={startPage}
                    onChange={(e) => setStartPage(Number(e.target.value))}
                    min={0}
                    className="w-full bg-[#0f0705] border border-[#3a2212] rounded-lg px-4 py-2 text-[#e8d5c0] focus:outline-none focus:border-[#c9a87a] focus:ring-1 focus:ring-[#c9a87a]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8a6040] mb-2">End Page</label>
                  <input 
                    type="number" 
                    value={endPage}
                    onChange={(e) => setEndPage(Number(e.target.value))}
                    min={startPage}
                    className="w-full bg-[#0f0705] border border-[#3a2212] rounded-lg px-4 py-2 text-[#e8d5c0] focus:outline-none focus:border-[#c9a87a] focus:ring-1 focus:ring-[#c9a87a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8a6040] mb-2">Duration (minutes)</label>
                <input 
                  type="number" 
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  min={1}
                  className="w-full bg-[#0f0705] border border-[#3a2212] rounded-lg px-4 py-2 text-[#e8d5c0] focus:outline-none focus:border-[#c9a87a] focus:ring-1 focus:ring-[#c9a87a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8a6040] mb-2">Mood</label>
                <select 
                  value={selectedMood}
                  onChange={(e) => setSelectedMood(e.target.value as Mood)}
                  className="w-full bg-[#0f0705] border border-[#3a2212] rounded-lg px-4 py-2 text-[#e8d5c0] focus:outline-none focus:border-[#c9a87a] focus:ring-1 focus:ring-[#c9a87a] appearance-none"
                >
                  <option value="COZY">Cozy</option>
                  <option value="FOCUSED">Focused</option>
                  <option value="RELAXED">Relaxed</option>
                  <option value="INTENSE">Intense</option>
                  <option value="SAD">Sad</option>
                  <option value="HAPPY">Happy</option>
                  <option value="THOUGHTFUL">Thoughtful</option>
                </select>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={submittingSession}
                  className="w-full bg-[#c9a87a] hover:bg-[#e6be8c] text-[#1a0f0a] font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {submittingSession ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
                  ) : (
                    "Save Session"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
