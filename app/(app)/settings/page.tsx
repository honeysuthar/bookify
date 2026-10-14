"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  Settings,
  User as UserIcon,
  Target,
  Bell,
  Palette,
  AlertTriangle,
  LogOut,
  Trash2,
  Check,
  Save,
  Clock,
  BookOpen,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import {
  getUserSettingsAction,
  updateProfileAction,
  saveReadingGoalAction,
  deleteAccountAction,
} from "@/app/actions/settings";
import type { UserSettingsData } from "@/lib/db/settings";
import { GoalPeriod, GoalTargetType } from "@prisma/client";

export default function SettingsPage() {
  const router = useRouter();
  const [data, setData] = useState<UserSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Profile form state
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  // Goal state
  const [dailyMinutes, setDailyMinutes] = useState(20);
  const [yearlyBooks, setYearlyBooks] = useState(12);
  const [savingDailyGoal, setSavingDailyGoal] = useState(false);
  const [savingYearlyGoal, setSavingYearlyGoal] = useState(false);

  // Preference state
  const [readingReminders, setReadingReminders] = useState(true);
  const [streakAlerts, setStreakAlerts] = useState(true);
  const [achievementAlerts, setAchievementAlerts] = useState(true);
  const [ambientSounds, setAmbientSounds] = useState(true);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      setLoading(true);
      try {
        const res = await getUserSettingsAction();
        if (res.success && res.data) {
          setData(res.data);
          setName(res.data.user.name || "");
          setUsername(res.data.user.username || "");
          setBio(res.data.user.bio || "");
          setDailyMinutes(res.data.goals.dailyMinutes);
          setYearlyBooks(res.data.goals.yearlyBooks);
          setReadingReminders(res.data.preferences.readingReminders);
          setStreakAlerts(res.data.preferences.streakAlerts);
          setAchievementAlerts(res.data.preferences.achievementAlerts);
          setAmbientSounds(res.data.preferences.ambientSounds);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    setProfileError(null);
    setProfileSuccess(false);

    try {
      const res = await updateProfileAction({ name, username, bio });
      if (!res.success) {
        throw new Error(res.error || "Failed to update profile");
      }
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err: any) {
      setProfileError(err.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleSaveDailyGoal(val: number) {
    setDailyMinutes(val);
    setSavingDailyGoal(true);
    try {
      await saveReadingGoalAction(GoalPeriod.DAILY, GoalTargetType.MINUTES, val);
    } catch (e) {
      console.error(e);
    } finally {
      setSavingDailyGoal(false);
    }
  }

  async function handleSaveYearlyGoal(val: number) {
    setYearlyBooks(val);
    setSavingYearlyGoal(true);
    try {
      await saveReadingGoalAction(GoalPeriod.YEARLY, GoalTargetType.BOOKS, val);
    } catch (e) {
      console.error(e);
    } finally {
      setSavingYearlyGoal(false);
    }
  }

  async function handleLogout() {
    await signOut({ redirect: false });
    router.push("/login");
  }

  async function handleDeleteAccount() {
    if (deleteConfirmText.toLowerCase() !== "delete my account") {
      setDeleteError("Please type 'delete my account' to confirm.");
      return;
    }
    setDeleting(true);
    setDeleteError(null);

    try {
      const res = await deleteAccountAction();
      if (!res.success) throw new Error(res.error || "Failed to delete account");
      await signOut({ redirect: false });
      router.push("/register");
    } catch (err: any) {
      setDeleteError(err.message || "Failed to delete account");
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pt-20 md:pt-24 pb-20 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="p-2 rounded-xl bg-[#c9a87a]/15 text-[#c9a87a]">
          <Settings className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#f0dfc0]">Settings</h1>
          <p className="text-xs sm:text-sm text-[#a6907c] mt-0.5">
            Manage your profile, literary goals, notifications, and account preferences.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-[#160a05]/60 border border-[#2a1508] animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* Profile & Account Information */}
          <div className="rounded-2xl bg-[#160a05]/80 border border-[#2a1508] p-6 shadow-xl backdrop-blur-md space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
              <UserIcon className="h-4 w-4 text-[#c9a87a]" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#f0dfc0]">
                Profile & Account
              </h2>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#a6907c]">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f0705]/80 border border-[#2a1508] text-sm text-[#f0dfc0] focus:outline-none focus:border-[#c9a87a]/60 transition-colors"
                    placeholder="Your name"
                    required
                  />
                </div>

                {/* Username */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#a6907c]">Username</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#8a6040]">@</span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-[#0f0705]/80 border border-[#2a1508] text-sm text-[#f0dfc0] focus:outline-none focus:border-[#c9a87a]/60 transition-colors"
                      placeholder="username"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#a6907c]">Reader Bio</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f0705]/80 border border-[#2a1508] text-sm text-[#f0dfc0] focus:outline-none focus:border-[#c9a87a]/60 transition-colors resize-none"
                  placeholder="Share a sentence about your favorite genres or current reading quest..."
                />
              </div>

              {/* Email & Auth Provider (Read-only) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-3 rounded-xl bg-[#0f0705]/60 border border-white/5 space-y-0.5">
                  <p className="text-[11px] text-[#8a6040] uppercase">Email Address</p>
                  <p className="text-xs sm:text-sm font-medium text-[#f0dfc0] truncate">
                    {data?.user.email}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#0f0705]/60 border border-white/5 space-y-0.5">
                  <p className="text-[11px] text-[#8a6040] uppercase">Sign-in Method</p>
                  <p className="text-xs sm:text-sm font-medium text-[#c9a87a] capitalize">
                    {data?.user.authProvider === "GOOGLE" ? "Google Account" : "Email & Password"}
                  </p>
                </div>
              </div>

              {/* Status and Save button */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  {profileSuccess && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#4ade80]">
                      <Check className="h-3.5 w-3.5" />
                      Profile saved successfully!
                    </span>
                  )}
                  {profileError && (
                    <span className="text-xs text-red-400">{profileError}</span>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-[#c9a87a] text-[#0f0705] hover:bg-[#e0b364] transition-colors shadow-md disabled:opacity-50"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{savingProfile ? "Saving…" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Reading Goals */}
          <div className="rounded-2xl bg-[#160a05]/80 border border-[#2a1508] p-6 shadow-xl backdrop-blur-md space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
              <Target className="h-4 w-4 text-[#c9a87a]" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#f0dfc0]">
                Reading Goals
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Daily Target */}
              <div className="p-4 rounded-xl bg-[#0f0705]/60 border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#c9a87a]" />
                    <span className="text-xs font-medium text-[#f0dfc0]">Daily Reading Target</span>
                  </div>
                  {savingDailyGoal && <span className="text-[10px] text-[#c9a87a] animate-pulse">Saving…</span>}
                </div>
                <p className="text-xs text-[#a6907c]">Target minutes to read each calendar day.</p>
                <div className="flex items-center gap-2">
                  {[15, 20, 30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => handleSaveDailyGoal(mins)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                        dailyMinutes === mins
                          ? "bg-[#c9a87a] text-[#0f0705] border-[#c9a87a] font-bold shadow-md"
                          : "bg-[#160a05]/60 border-white/5 text-[#a6907c] hover:text-[#f0dfc0]"
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Annual Books Target */}
              <div className="p-4 rounded-xl bg-[#0f0705]/60 border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-[#c9a87a]" />
                    <span className="text-xs font-medium text-[#f0dfc0]">Yearly Book Challenge</span>
                  </div>
                  {savingYearlyGoal && <span className="text-[10px] text-[#c9a87a] animate-pulse">Saving…</span>}
                </div>
                <p className="text-xs text-[#a6907c]">Number of books you aspire to complete this year.</p>
                <div className="flex items-center gap-2">
                  {[12, 24, 36, 52].map((books) => (
                    <button
                      key={books}
                      onClick={() => handleSaveYearlyGoal(books)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                        yearlyBooks === books
                          ? "bg-[#c9a87a] text-[#0f0705] border-[#c9a87a] font-bold shadow-md"
                          : "bg-[#160a05]/60 border-white/5 text-[#a6907c] hover:text-[#f0dfc0]"
                      }`}
                    >
                      {books}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preferences & Experience */}
          <div className="rounded-2xl bg-[#160a05]/80 border border-[#2a1508] p-6 shadow-xl backdrop-blur-md space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
              <Bell className="h-4 w-4 text-[#c9a87a]" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#f0dfc0]">
                Preferences & Notifications
              </h2>
            </div>

            <div className="space-y-3">
              {[
                {
                  label: "Daily Reading Reminders",
                  desc: "Subtle nudges to keep your daily streak alive",
                  state: readingReminders,
                  setter: setReadingReminders,
                },
                {
                  label: "Streak Protection Alerts",
                  desc: "Notification warnings if your reading streak is at risk before midnight",
                  state: streakAlerts,
                  setter: setStreakAlerts,
                },
                {
                  label: "Achievement & Level Celebrations",
                  desc: "In-app animations when unlocking new badges and reader tiers",
                  state: achievementAlerts,
                  setter: setAchievementAlerts,
                },
                {
                  label: "Ambient Background Audio",
                  desc: "Enable atmospheric crackling hearth sounds during reading sessions",
                  state: ambientSounds,
                  setter: setAmbientSounds,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#0f0705]/60 border border-white/5"
                >
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-[#f0dfc0]">{item.label}</p>
                    <p className="text-[11px] text-[#a6907c]">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => item.setter(!item.state)}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 border ${
                      item.state
                        ? "bg-[#c9a87a] border-[#c9a87a]"
                        : "bg-[#1f0f08] border-white/10"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-[#0f0705] transition-transform duration-200 ${
                        item.state ? "translate-x-5 bg-black" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Aesthetic Theme */}
          <div className="rounded-2xl bg-[#160a05]/80 border border-[#2a1508] p-6 shadow-xl backdrop-blur-md space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
              <Palette className="h-4 w-4 text-[#c9a87a]" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#f0dfc0]">
                Atmospheric Palette
              </h2>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-[#0f0705]/60 border border-white/5">
              <div>
                <p className="text-sm font-medium text-[#f0dfc0]">Espresso Hearth</p>
                <p className="text-xs text-[#a6907c]">
                  Rich midnight espresso, warm hearth amber, and gilded page edges.
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#0f0705] border border-white/20" title="Midnight Noir" />
                <span className="w-5 h-5 rounded-full bg-[#2a1508] border border-white/20" title="Dark Roast" />
                <span className="w-5 h-5 rounded-full bg-[#c9a87a] border border-white/20" title="Hearth Amber" />
                <span className="w-5 h-5 rounded-full bg-[#e0b364] border border-white/20" title="Starlit Gold" />
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="rounded-2xl bg-[#160a05]/80 border border-red-950/60 p-6 shadow-xl backdrop-blur-md space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-red-950/40">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-red-400">
                Danger Zone
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Sign Out */}
              <button
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#3d2010] text-sm text-[#f0dfc0] hover:bg-white/5 transition-colors font-medium"
              >
                <LogOut className="h-4 w-4 text-[#a6907c]" />
                <span>Sign Out of Account</span>
              </button>

              {/* Delete Account */}
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-900/40 text-sm text-red-400 hover:bg-red-950/30 transition-colors font-medium"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="max-w-md w-full rounded-3xl bg-[#160a05] border border-red-900/60 p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-red-950/50 text-red-400 border border-red-900/40">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-[#f0dfc0]">Delete Account</h3>
                <p className="text-xs text-red-400">This action is permanent and irreversible.</p>
              </div>
            </div>

            <p className="text-xs text-[#a6907c] leading-relaxed">
              All your reading sessions, streak logs, achievements, personal library, and Reading DNA will be permanently wiped from the database.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs text-[#a6907c]">
                Type <span className="font-bold text-[#f0dfc0]">delete my account</span> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f0705] border border-[#2a1508] text-sm text-[#f0dfc0] focus:outline-none focus:border-red-500/60 transition-colors"
                placeholder="delete my account"
              />
            </div>

            {deleteError && <p className="text-xs text-red-400">{deleteError}</p>}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText("");
                  setDeleteError(null);
                }}
                className="flex-1 py-2.5 rounded-xl border border-[#2a1508] text-xs font-medium text-[#a6907c] hover:text-[#f0dfc0]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-lg disabled:opacity-50 transition-colors"
              >
                {deleting ? "Deleting…" : "Confirm Deletion"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
