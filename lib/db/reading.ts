import prisma from '../prisma'
import { ReadingSession, StreakLog, Mood, Prisma } from '@prisma/client'

interface CreateSessionInput {
  startPage: number
  endPage: number
  durationMinutes: number
  mood?: Mood
  startedAt: Date
  endedAt: Date
}

/**
 * Creates a reading session and automatically updates the library entry,
 * user stats, and streak logs in a transaction.
 */
export async function createReadingSession(
  userId: string,
  bookId: string,
  sessionData: CreateSessionInput
): Promise<ReadingSession> {
  try {
    const pagesRead = Math.max(0, sessionData.endPage - sessionData.startPage)
    
    return await prisma.$transaction(async (tx) => {
      // 1. Create the session
      const session = await tx.readingSession.create({
        data: {
          userId,
          bookId,
          startPage: sessionData.startPage,
          endPage: sessionData.endPage,
          pagesRead,
          durationMinutes: sessionData.durationMinutes,
          mood: sessionData.mood,
          startedAt: sessionData.startedAt,
          endedAt: sessionData.endedAt,
        },
      })

      // 2. Update the user's current progress in library
      const libraryEntry = await tx.userLibrary.findUnique({
        where: { userId_bookId: { userId, bookId } },
        include: { book: true }
      })

      if (libraryEntry) {
        const isFinished = libraryEntry.book.pageCount 
          ? sessionData.endPage >= libraryEntry.book.pageCount 
          : false

        await tx.userLibrary.update({
          where: { userId_bookId: { userId, bookId } },
          data: {
            currentPage: sessionData.endPage,
            status: isFinished ? 'FINISHED' : 'CURRENTLY_READING',
            startedAt: libraryEntry.startedAt || sessionData.startedAt,
            finishedAt: isFinished ? sessionData.endedAt : libraryEntry.finishedAt,
          },
        })
      }

      // 3. Upsert Streak Log for the day
      const todayDateStr = new Date().toISOString().split('T')[0]
      const streakDate = new Date(`${todayDateStr}T00:00:00.000Z`)

      const existingStreakLog = await tx.streakLog.findUnique({
        where: {
          userId_date: {
            userId,
            date: streakDate,
          },
        },
      })

      const xpEarned = pagesRead * 2 + sessionData.durationMinutes // Standard XP formula

      if (existingStreakLog) {
        await tx.streakLog.update({
          where: {
            userId_date: {
              userId,
              date: streakDate,
            },
          },
          data: {
            pagesRead: { increment: pagesRead },
            minutesRead: { increment: sessionData.durationMinutes },
            xpEarned: { increment: xpEarned },
          },
        })
      } else {
        await tx.streakLog.create({
          data: {
            userId,
            date: streakDate,
            pagesRead,
            minutesRead: sessionData.durationMinutes,
            xpEarned,
          },
        })
      }

      // 4. Update user reading statistics, streak numbers, and total XP
      const user = await tx.user.findUnique({
        where: { id: userId },
      })

      if (user) {
        let newStreak = user.currentStreak
        const yesterdayDateStr = new Date(Date.now() - 86400000).toISOString().split('T')[0]
        const yesterdayDate = new Date(`${yesterdayDateStr}T00:00:00.000Z`)

        // If user didn't read today
        if (!user.lastReadDate) {
          newStreak = 1
        } else {
          const lastReadStr = user.lastReadDate.toISOString().split('T')[0]
          if (lastReadStr === todayDateStr) {
            // Already read today, streak remains same
          } else if (lastReadStr === yesterdayDateStr) {
            // Read yesterday, increment streak
            newStreak += 1
          } else {
            // Streak broken
            newStreak = 1
          }
        }

        const longestStreak = Math.max(user.longestStreak, newStreak)

        await tx.user.update({
          where: { id: userId },
          data: {
            lastReadDate: sessionData.endedAt,
            totalPagesRead: { increment: pagesRead },
            xp: { increment: xpEarned },
            coins: { increment: Math.floor(xpEarned / 10) },
            currentStreak: newStreak,
            longestStreak,
          },
        })
      }

      return session
    })
  } catch (error) {
    console.error('Error in createReadingSession:', error)
    throw error
  }
}

/**
 * Gets all reading sessions for a user, ordered by most recent.
 */
export async function getUserReadingSessions(userId: string): Promise<ReadingSession[]> {
  try {
    return await prisma.readingSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        book: true,
      },
    })
  } catch (error) {
    console.error('Error in getUserReadingSessions:', error)
    throw error
  }
}

/**
 * Gets reading sessions for a specific book by a user.
 */
export async function getBookReadingSessions(
  userId: string,
  bookId: string
): Promise<ReadingSession[]> {
  try {
    return await prisma.readingSession.findMany({
      where: { userId, bookId },
      orderBy: { startedAt: 'asc' },
    })
  } catch (error) {
    console.error('Error in getBookReadingSessions:', error)
    throw error
  }
}

/**
 * Deletes a reading session by ID.
 */
export async function deleteReadingSession(sessionId: string): Promise<ReadingSession> {
  try {
    return await prisma.readingSession.delete({
      where: { id: sessionId },
    })
  } catch (error) {
    console.error('Error in deleteReadingSession:', error)
    throw error
  }
}

/**
 * Gets streak logs for a user.
 */
export async function getStreakLogs(userId: string): Promise<StreakLog[]> {
  try {
    return await prisma.streakLog.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    })
  } catch (error) {
    console.error('Error in getStreakLogs:', error)
    throw error
  }
}

export type HeatmapPeriod = 'week' | 'month' | 'year'

export interface HeatmapCell {
  date: string   // ISO date string "YYYY-MM-DD"
  pages: number
  minutes: number
  level: 0 | 1 | 2 | 3 | 4
}

function pagesLevel(pages: number): 0 | 1 | 2 | 3 | 4 {
  if (pages === 0) return 0
  if (pages <= 15) return 1
  if (pages <= 35) return 2
  if (pages <= 60) return 3
  return 4
}

function getDateRange(period: HeatmapPeriod): { startDate: Date; endDate: Date } {
  const now = new Date()
  const endDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))

  let startDate: Date
  if (period === 'week') {
    startDate = new Date(endDate)
    startDate.setUTCDate(endDate.getUTCDate() - 6) // last 7 days inclusive
  } else if (period === 'month') {
    startDate = new Date(endDate)
    startDate.setUTCDate(endDate.getUTCDate() - 29) // last 30 days inclusive
  } else {
    startDate = new Date(endDate)
    startDate.setUTCFullYear(endDate.getUTCFullYear() - 1)
    startDate.setUTCDate(startDate.getUTCDate() + 1) // last 365 days inclusive
  }
  return { startDate, endDate }
}

/**
 * Returns a zero-padded heatmap array for the requested period,
 * one entry per calendar day (UTC), ordered chronologically.
 */
export async function getHeatmapData(
  userId: string,
  period: HeatmapPeriod
): Promise<HeatmapCell[]> {
  try {
    const { startDate, endDate } = getDateRange(period)

    const logs = await prisma.streakLog.findMany({
      where: {
        userId,
        date: { gte: startDate, lte: endDate },
      },
      orderBy: { date: 'asc' },
    })

    // Build a quick-lookup map keyed by "YYYY-MM-DD"
    const logMap = new Map<string, { pages: number; minutes: number }>()
    for (const log of logs) {
      const key = log.date.toISOString().split('T')[0]
      logMap.set(key, { pages: log.pagesRead, minutes: log.minutesRead })
    }

    // Zero-pad every day in the range
    const cells: HeatmapCell[] = []
    const cursor = new Date(startDate)
    while (cursor <= endDate) {
      const key = cursor.toISOString().split('T')[0]
      const entry = logMap.get(key)
      cells.push({
        date: key,
        pages: entry?.pages ?? 0,
        minutes: entry?.minutes ?? 0,
        level: pagesLevel(entry?.pages ?? 0),
      })
      cursor.setUTCDate(cursor.getUTCDate() + 1)
    }
    return cells
  } catch (error) {
    console.error('Error in getHeatmapData:', error)
    throw error
  }
}

export interface ReadingStats {
  totalPages: number
  totalSessions: number
  avgDurationMinutes: number
  longestSessionMinutes: number
  currentStreak: number
  longestStreak: number
}

/**
 * Aggregates reading stats for the given period from ReadingSession + User.
 */
export async function getReadingStats(
  userId: string,
  period: HeatmapPeriod
): Promise<ReadingStats> {
  try {
    const { startDate } = getDateRange(period)

    const [sessions, user] = await Promise.all([
      prisma.readingSession.findMany({
        where: { userId, startedAt: { gte: startDate } },
        select: { pagesRead: true, durationMinutes: true },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { currentStreak: true, longestStreak: true },
      }),
    ])

    const totalPages = sessions.reduce((s, r) => s + r.pagesRead, 0)
    const totalMinutes = sessions.reduce((s, r) => s + r.durationMinutes, 0)
    const longestSessionMinutes = sessions.reduce((max, r) => Math.max(max, r.durationMinutes), 0)

    return {
      totalPages,
      totalSessions: sessions.length,
      avgDurationMinutes: sessions.length ? Math.round(totalMinutes / sessions.length) : 0,
      longestSessionMinutes,
      currentStreak: user?.currentStreak ?? 0,
      longestStreak: user?.longestStreak ?? 0,
    }
  } catch (error) {
    console.error('Error in getReadingStats:', error)
    throw error
  }
}
