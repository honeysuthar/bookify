import prisma from '../prisma'
import { GoalPeriod, GoalTargetType } from '@prisma/client'

export interface UserSettingsData {
  user: {
    id: string
    name: string
    email: string
    username: string
    bio: string | null
    avatarUrl: string | null
    authProvider: string
    readingLevel: number
    xp: number
    coins: number
    createdAt: string
  }
  goals: {
    dailyMinutes: number
    yearlyBooks: number
  }
  preferences: {
    readingReminders: boolean
    streakAlerts: boolean
    achievementAlerts: boolean
    ambientSounds: boolean
    theme: string
  }
}

/**
 * Retrieves full settings and goals for a user.
 */
export async function getUserSettings(userId: string): Promise<UserSettingsData> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new Error('User not found')
    }

    // Fetch active daily and yearly goals
    const goals = await prisma.readingGoal.findMany({
      where: {
        userId,
        period: { in: [GoalPeriod.DAILY, GoalPeriod.YEARLY] },
      },
      orderBy: { createdAt: 'desc' },
    })

    const dailyGoal = goals.find((g) => g.period === GoalPeriod.DAILY && g.targetType === GoalTargetType.MINUTES)
    const yearlyGoal = goals.find((g) => g.period === GoalPeriod.YEARLY && g.targetType === GoalTargetType.BOOKS)

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        authProvider: user.authProvider,
        readingLevel: user.readingLevel,
        xp: user.xp,
        coins: user.coins,
        createdAt: user.createdAt.toISOString(),
      },
      goals: {
        dailyMinutes: dailyGoal?.targetValue ?? 20,
        yearlyBooks: yearlyGoal?.targetValue ?? 12,
      },
      preferences: {
        readingReminders: true,
        streakAlerts: true,
        achievementAlerts: true,
        ambientSounds: true,
        theme: 'Espresso Hearth',
      },
    }
  } catch (error) {
    console.error('Error in getUserSettings:', error)
    throw error
  }
}

/**
 * Updates a user's editable profile fields.
 */
export async function updateProfile(
  userId: string,
  data: { name?: string; username?: string; bio?: string }
) {
  try {
    if (data.username) {
      // Check if username is taken by another user
      const existing = await prisma.user.findFirst({
        where: {
          username: data.username,
          NOT: { id: userId },
        },
      })
      if (existing) {
        throw new Error('Username is already taken')
      }
    }

    return await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name && { name: data.name.trim() }),
        ...(data.username && { username: data.username.trim().toLowerCase().replace(/^@/, '') }),
        ...(data.bio !== undefined && { bio: data.bio.trim() }),
      },
    })
  } catch (error) {
    console.error('Error in updateProfile:', error)
    throw error
  }
}

/**
 * Upserts a reading goal for the current period.
 */
export async function saveReadingGoal(
  userId: string,
  period: GoalPeriod,
  targetType: GoalTargetType,
  targetValue: number
) {
  try {
    const now = new Date()
    let periodStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
    let periodEnd = new Date(periodStart)

    if (period === GoalPeriod.DAILY) {
      periodEnd.setUTCDate(periodStart.getUTCDate() + 1)
    } else if (period === GoalPeriod.YEARLY) {
      periodStart = new Date(Date.UTC(now.getUTCFullYear(), 0, 1))
      periodEnd = new Date(Date.UTC(now.getUTCFullYear() + 1, 0, 1))
    }

    const existingGoal = await prisma.readingGoal.findFirst({
      where: {
        userId,
        period,
        targetType,
      },
      orderBy: { createdAt: 'desc' },
    })

    if (existingGoal) {
      return await prisma.readingGoal.update({
        where: { id: existingGoal.id },
        data: { targetValue },
      })
    } else {
      return await prisma.readingGoal.create({
        data: {
          userId,
          period,
          targetType,
          targetValue,
          periodStart,
          periodEnd,
        },
      })
    }
  } catch (error) {
    console.error('Error in saveReadingGoal:', error)
    throw error
  }
}

/**
 * Permanently deletes user account.
 */
export async function deleteAccount(userId: string) {
  try {
    return await prisma.user.delete({
      where: { id: userId },
    })
  } catch (error) {
    console.error('Error in deleteAccount:', error)
    throw error
  }
}
