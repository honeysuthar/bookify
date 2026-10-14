"use server";

import {
  createReadingSession,
  getUserReadingSessions,
  getBookReadingSessions,
  deleteReadingSession,
  getStreakLogs,
  getHeatmapData,
  getReadingStats,
  type HeatmapPeriod,
  type HeatmapCell,
  type ReadingStats,
} from "@/lib/db/reading"
import { ReadingSession, StreakLog, Mood } from "@prisma/client"
import { ActionResponse } from "./users"
import { getSessionUserId } from "@/lib/auth"

interface CreateSessionInput {
  startPage: number
  endPage: number
  durationMinutes: number
  mood?: Mood
  startedAt: Date
  endedAt: Date
}

/**
 * Server Action to log a new reading session for the authenticated user.
 */
export async function createReadingSessionAction(
  bookId: string,
  sessionData: CreateSessionInput
): Promise<ActionResponse<ReadingSession>> {
  try {
    const userId = await getSessionUserId()
    if (!userId) return { success: false, error: "Unauthorized" }
    if (!bookId) return { success: false, error: "Book ID is required" }
    if (
      sessionData.startPage === undefined ||
      sessionData.endPage === undefined ||
      !sessionData.startedAt ||
      !sessionData.endedAt
    ) {
      return { success: false, error: "Missing required session details" }
    }
    const session = await createReadingSession(userId, bookId, {
      ...sessionData,
      startedAt: new Date(sessionData.startedAt),
      endedAt: new Date(sessionData.endedAt),
    })
    return { success: true, data: session }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create reading session" }
  }
}

/**
 * Server Action to retrieve all reading sessions for the authenticated user.
 */
export async function getUserReadingSessionsAction(): Promise<ActionResponse<ReadingSession[]>> {
  try {
    const userId = await getSessionUserId()
    if (!userId) return { success: false, error: "Unauthorized" }
    const sessions = await getUserReadingSessions(userId)
    return { success: true, data: sessions }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch user reading sessions" }
  }
}

/**
 * Server Action to retrieve reading sessions for a specific book (authenticated user).
 */
export async function getBookReadingSessionsAction(
  bookId: string
): Promise<ActionResponse<ReadingSession[]>> {
  try {
    const userId = await getSessionUserId()
    if (!userId) return { success: false, error: "Unauthorized" }
    if (!bookId) return { success: false, error: "Book ID is required" }
    const sessions = await getBookReadingSessions(userId, bookId)
    return { success: true, data: sessions }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch book reading sessions" }
  }
}

/**
 * Server Action to delete a reading session (authenticated user only).
 */
export async function deleteReadingSessionAction(
  sessionId: string
): Promise<ActionResponse<ReadingSession>> {
  try {
    const userId = await getSessionUserId()
    if (!userId) return { success: false, error: "Unauthorized" }
    if (!sessionId) return { success: false, error: "Session ID is required" }
    const session = await deleteReadingSession(sessionId)
    return { success: true, data: session }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete reading session" }
  }
}

/**
 * Server Action to fetch streak logs for the authenticated user.
 */
export async function getStreakLogsAction(): Promise<ActionResponse<StreakLog[]>> {
  try {
    const userId = await getSessionUserId()
    if (!userId) return { success: false, error: "Unauthorized" }
    const logs = await getStreakLogs(userId)
    return { success: true, data: logs }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch streak logs" }
  }
}

/**
 * Server Action to fetch heatmap data for the authenticated user for a given period.
 */
export async function getHeatmapDataAction(
  period: HeatmapPeriod
): Promise<ActionResponse<HeatmapCell[]>> {
  try {
    const userId = await getSessionUserId()
    if (!userId) return { success: false, error: "Unauthorized" }
    const cells = await getHeatmapData(userId, period)
    return { success: true, data: cells }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch heatmap data" }
  }
}

/**
 * Server Action to fetch aggregated reading stats for the authenticated user.
 */
export async function getReadingStatsAction(
  period: HeatmapPeriod
): Promise<ActionResponse<ReadingStats>> {
  try {
    const userId = await getSessionUserId()
    if (!userId) return { success: false, error: "Unauthorized" }
    const stats = await getReadingStats(userId, period)
    return { success: true, data: stats }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch reading stats" }
  }
}

// Re-export types so client components can import them from this module
export type { HeatmapPeriod, HeatmapCell, ReadingStats }
