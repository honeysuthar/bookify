import prisma from '../prisma'
import { ReadingStatus } from '@prisma/client'

export interface AchievementItem {
  id: string
  key: string
  name: string
  description: string
  category: 'STREAKS' | 'VOLUME' | 'HABITS' | 'EXPLORATION'
  categoryLabel: string
  icon: string
  xpReward: number
  coinReward: number
  earned: boolean
  earnedAt?: string
  currentProgress: number
  targetProgress: number
  progressPercent: number
}

export interface UserLevelInfo {
  level: number
  title: string
  totalXp: number
  coins: number
  currentTierXp: number
  nextTierXp: number
  progressPercent: number
}

export interface AchievementsData {
  userLevel: UserLevelInfo
  achievements: AchievementItem[]
  categories: { key: string; label: string; count: number; earnedCount: number }[]
  stats: {
    totalEarned: number
    totalAchievements: number
    completionPercent: number
    totalCoinsEarned: number
    recentUnlocks: AchievementItem[]
  }
}

interface AchievementDefinition {
  key: string
  name: string
  description: string
  category: 'STREAKS' | 'VOLUME' | 'HABITS' | 'EXPLORATION'
  categoryLabel: string
  icon: string
  xpReward: number
  coinReward: number
  target: number
  evaluate: (ctx: EvaluationContext) => number
}

interface EvaluationContext {
  currentStreak: number
  longestStreak: number
  totalPagesRead: number
  finishedBooksCount: number
  uniqueGenresCount: number
  nightSessionsCount: number
  dawnSessionsCount: number
  maxSessionMinutes: number
  maxSessionPPH: number
  uniqueMoodsCount: number
}

const ACHIEVEMENT_CATALOG: AchievementDefinition[] = [
  // ── STREAKS & CONSISTENCY ──
  {
    key: 'STREAK_3',
    name: 'Kindled Spark',
    description: 'Maintain a 3-day reading streak',
    category: 'STREAKS',
    categoryLabel: 'Consistency',
    icon: 'Flame',
    xpReward: 50,
    coinReward: 10,
    target: 3,
    evaluate: (ctx) => Math.max(ctx.currentStreak, ctx.longestStreak),
  },
  {
    key: 'STREAK_7',
    name: 'Week Warrior',
    description: 'Read 7 days in a row without breaking the chain',
    category: 'STREAKS',
    categoryLabel: 'Consistency',
    icon: 'Flame',
    xpReward: 150,
    coinReward: 25,
    target: 7,
    evaluate: (ctx) => Math.max(ctx.currentStreak, ctx.longestStreak),
  },
  {
    key: 'STREAK_14',
    name: 'Fortnight Flame',
    description: 'Read consecutively for 14 days',
    category: 'STREAKS',
    categoryLabel: 'Consistency',
    icon: 'Flame',
    xpReward: 350,
    coinReward: 50,
    target: 14,
    evaluate: (ctx) => Math.max(ctx.currentStreak, ctx.longestStreak),
  },
  {
    key: 'STREAK_30',
    name: 'Month Master',
    description: 'Achieve an unbroken 30-day reading streak',
    category: 'STREAKS',
    categoryLabel: 'Consistency',
    icon: 'Crown',
    xpReward: 800,
    coinReward: 120,
    target: 30,
    evaluate: (ctx) => Math.max(ctx.currentStreak, ctx.longestStreak),
  },

  // ── VOLUME & READING VOLUME ──
  {
    key: 'FIRST_BOOK',
    name: 'First Chapter',
    description: 'Complete and finish your first book',
    category: 'VOLUME',
    categoryLabel: 'Volume',
    icon: 'BookOpen',
    xpReward: 100,
    coinReward: 20,
    target: 1,
    evaluate: (ctx) => ctx.finishedBooksCount,
  },
  {
    key: 'BOOKS_5',
    name: 'Avid Bibliophile',
    description: 'Finish 5 complete books in your library',
    category: 'VOLUME',
    categoryLabel: 'Volume',
    icon: 'Library',
    xpReward: 300,
    coinReward: 50,
    target: 5,
    evaluate: (ctx) => ctx.finishedBooksCount,
  },
  {
    key: 'BOOKS_10',
    name: 'Tome Conqueror',
    description: 'Finish 10 books in your personal library',
    category: 'VOLUME',
    categoryLabel: 'Volume',
    icon: 'Trophy',
    xpReward: 600,
    coinReward: 100,
    target: 10,
    evaluate: (ctx) => ctx.finishedBooksCount,
  },
  {
    key: 'PAGE_100',
    name: 'Century Reader',
    description: 'Read 100 total pages across your sessions',
    category: 'VOLUME',
    categoryLabel: 'Volume',
    icon: 'Layers',
    xpReward: 50,
    coinReward: 10,
    target: 100,
    evaluate: (ctx) => ctx.totalPagesRead,
  },
  {
    key: 'PAGE_500',
    name: 'Page Turner',
    description: 'Turn 500 pages in your literary journeys',
    category: 'VOLUME',
    categoryLabel: 'Volume',
    icon: 'Bookmark',
    xpReward: 200,
    coinReward: 30,
    target: 500,
    evaluate: (ctx) => ctx.totalPagesRead,
  },
  {
    key: 'PAGE_1000',
    name: 'Millennium Milestone',
    description: 'Surpass 1,000 total pages read',
    category: 'VOLUME',
    categoryLabel: 'Volume',
    icon: 'Sparkles',
    xpReward: 450,
    coinReward: 70,
    target: 1000,
    evaluate: (ctx) => ctx.totalPagesRead,
  },
  {
    key: 'PAGE_3000',
    name: 'Literary Titan',
    description: 'Surpass 3,000 total pages logged in Bookify',
    category: 'VOLUME',
    categoryLabel: 'Volume',
    icon: 'Award',
    xpReward: 1000,
    coinReward: 150,
    target: 3000,
    evaluate: (ctx) => ctx.totalPagesRead,
  },

  // ── HABITS & FOCUS ──
  {
    key: 'NIGHT_OWL',
    name: 'Midnight Owl',
    description: 'Log 5 late-night reading sessions after 10 PM',
    category: 'HABITS',
    categoryLabel: 'Habits',
    icon: 'Moon',
    xpReward: 150,
    coinReward: 25,
    target: 5,
    evaluate: (ctx) => ctx.nightSessionsCount,
  },
  {
    key: 'DAWN_SCHOLAR',
    name: 'Dawn Scholar',
    description: 'Log 3 early morning reading sessions before 9 AM',
    category: 'HABITS',
    categoryLabel: 'Habits',
    icon: 'Sunrise',
    xpReward: 120,
    coinReward: 20,
    target: 3,
    evaluate: (ctx) => ctx.dawnSessionsCount,
  },
  {
    key: 'DEEP_DIVER',
    name: 'Deep Immersion',
    description: 'Complete a continuous reading session of 60+ minutes',
    category: 'HABITS',
    categoryLabel: 'Habits',
    icon: 'Clock',
    xpReward: 150,
    coinReward: 25,
    target: 60,
    evaluate: (ctx) => ctx.maxSessionMinutes,
  },
  {
    key: 'RAPID_PACER',
    name: 'Velocity Pacer',
    description: 'Reach a reading pace of 60+ pages/hr in a session',
    category: 'HABITS',
    categoryLabel: 'Habits',
    icon: 'Zap',
    xpReward: 150,
    coinReward: 25,
    target: 60,
    evaluate: (ctx) => ctx.maxSessionPPH,
  },

  // ── EXPLORATION & DIVERSITY ──
  {
    key: 'GENRE_EXPLORER',
    name: 'Genre Explorer',
    description: 'Read books across 3 distinct literary genres',
    category: 'EXPLORATION',
    categoryLabel: 'Exploration',
    icon: 'Compass',
    xpReward: 200,
    coinReward: 35,
    target: 3,
    evaluate: (ctx) => ctx.uniqueGenresCount,
  },
  {
    key: 'GENRE_OMNIVORE',
    name: 'Literary Omnivore',
    description: 'Expand your horizons across 5 distinct genres',
    category: 'EXPLORATION',
    categoryLabel: 'Exploration',
    icon: 'Globe',
    xpReward: 450,
    coinReward: 75,
    target: 5,
    evaluate: (ctx) => ctx.uniqueGenresCount,
  },
  {
    key: 'MOOD_EXPLORER',
    name: 'Atmospheric Resonance',
    description: 'Log sessions with 3 different reading moods',
    category: 'EXPLORATION',
    categoryLabel: 'Exploration',
    icon: 'Heart',
    xpReward: 120,
    coinReward: 20,
    target: 3,
    evaluate: (ctx) => ctx.uniqueMoodsCount,
  },
]

// Level Tier Thresholds
const LEVEL_TIERS = [
  { level: 1, xpReq: 0, title: 'Novice Reader' },
  { level: 2, xpReq: 150, title: 'Curious Browser' },
  { level: 3, xpReq: 400, title: 'Active Reader' },
  { level: 4, xpReq: 800, title: 'Dedicated Bookworm' },
  { level: 5, xpReq: 1400, title: 'Page Turner' },
  { level: 6, xpReq: 2200, title: 'Bibliophile' },
  { level: 7, xpReq: 3200, title: 'Literary Scholar' },
  { level: 8, xpReq: 4500, title: 'Arch-Librarian' },
  { level: 9, xpReq: 6000, title: 'Grandmaster of Tomes' },
  { level: 10, xpReq: 8000, title: 'Mythic Sage' },
]

export function computeLevelInfo(totalXp: number, coins: number): UserLevelInfo {
  let currentTier = LEVEL_TIERS[0]
  let nextTier = LEVEL_TIERS[1]

  for (let i = LEVEL_TIERS.length - 1; i >= 0; i--) {
    if (totalXp >= LEVEL_TIERS[i].xpReq) {
      currentTier = LEVEL_TIERS[i]
      nextTier = LEVEL_TIERS[i + 1] || { level: currentTier.level + 1, xpReq: currentTier.xpReq + 2500, title: 'Mythic Sage' }
      break
    }
  }

  const range = nextTier.xpReq - currentTier.xpReq
  const earnedInRange = Math.max(0, totalXp - currentTier.xpReq)
  const progressPercent = Math.min(100, Math.round((earnedInRange / range) * 100))

  return {
    level: currentTier.level,
    title: currentTier.title,
    totalXp,
    coins,
    currentTierXp: earnedInRange,
    nextTierXp: range,
    progressPercent,
  }
}

/**
 * Ensures all achievements in the catalog are seeded into the database.
 */
export async function ensureAchievementsSeeded() {
  for (const item of ACHIEVEMENT_CATALOG) {
    await prisma.achievement.upsert({
      where: { key: item.key },
      create: {
        key: item.key,
        name: item.name,
        description: item.description,
        category: item.category,
        xpReward: item.xpReward,
        coinReward: item.coinReward,
      },
      update: {
        name: item.name,
        description: item.description,
        category: item.category,
        xpReward: item.xpReward,
        coinReward: item.coinReward,
      },
    })
  }
}

/**
 * Evaluates real-time user activity, automatically awards any newly reached achievements,
 * and returns the full achievements and progression payload.
 */
export async function getUserAchievementsData(userId: string): Promise<AchievementsData> {
  try {
    // 1. Ensure catalog is synchronized
    await ensureAchievementsSeeded()

    // 2. Fetch all user data
    const [user, library, sessions, earnedRecords, dbAchievements] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.userLibrary.findMany({
        where: { userId },
        include: {
          book: {
            include: {
              genres: { include: { genre: true } },
            },
          },
        },
      }),
      prisma.readingSession.findMany({
        where: { userId },
        include: {
          book: {
            include: {
              genres: { include: { genre: true } },
            },
          },
        },
      }),
      prisma.userAchievement.findMany({
        where: { userId },
        include: { achievement: true },
      }),
      prisma.achievement.findMany(),
    ])

    if (!user) throw new Error('User not found')

    const dbAchMap = new Map(dbAchievements.map((a) => [a.key, a]))
    const earnedKeyMap = new Map(earnedRecords.map((r) => [r.achievement.key, r]))

    // 3. Compute evaluation context
    const isReaderDemo = user.email === 'reader@bookify.com' && library.length === 0 && sessions.length === 0

    const finishedBooksCount = isReaderDemo ? 6 : library.filter((e) => e.status === ReadingStatus.FINISHED).length
    const totalPagesRead = Math.max(
      user.totalPagesRead,
      sessions.reduce((s, r) => s + r.pagesRead, 0) || (isReaderDemo ? 3071 : 0)
    )

    // Distinct genres
    const genreSet = new Set<string>()
    for (const entry of library) {
      for (const bg of entry.book.genres) {
        genreSet.add(bg.genre.name.toLowerCase())
      }
    }
    for (const session of sessions) {
      if (session.book?.genres) {
        for (const bg of session.book.genres) {
          genreSet.add(bg.genre.name.toLowerCase())
        }
      }
    }
    if (isReaderDemo) {
      genreSet.add('fantasy')
      genreSet.add('sci-fi')
      genreSet.add('mystery')
      genreSet.add('philosophy')
    }
    const uniqueGenresCount = genreSet.size

    // Night & Dawn sessions
    let nightSessionsCount = isReaderDemo ? 12 : 0
    let dawnSessionsCount = isReaderDemo ? 3 : 0
    let maxSessionMinutes = isReaderDemo ? 82 : 0
    let maxSessionPPH = isReaderDemo ? 65 : 0
    const moodSet = new Set<string>()

    for (const s of sessions) {
      const h = new Date(s.startedAt).getUTCHours()
      if (h >= 22 || h < 4) nightSessionsCount++
      if (h >= 5 && h < 9) dawnSessionsCount++
      if (s.durationMinutes > maxSessionMinutes) maxSessionMinutes = s.durationMinutes
      if (s.durationMinutes > 0) {
        const pph = Math.round((s.pagesRead / s.durationMinutes) * 60)
        if (pph > maxSessionPPH) maxSessionPPH = pph
      }
      if (s.mood) moodSet.add(s.mood)
    }

    if (isReaderDemo) {
      moodSet.add('DARK_ACADEMIA')
      moodSet.add('FANTASY_ESCAPE')
      moodSet.add('COZY')
    }

    const evalCtx: EvaluationContext = {
      currentStreak: user.currentStreak || (isReaderDemo ? 7 : 0),
      longestStreak: user.longestStreak || (isReaderDemo ? 14 : 0),
      totalPagesRead,
      finishedBooksCount,
      uniqueGenresCount,
      nightSessionsCount,
      dawnSessionsCount,
      maxSessionMinutes,
      maxSessionPPH,
      uniqueMoodsCount: moodSet.size,
    }

    // 4. Evaluate each achievement & check for newly unlocked
    let bonusXp = 0
    let bonusCoins = 0
    const newlyEarnedKeys: string[] = []

    const items: AchievementItem[] = []

    for (const def of ACHIEVEMENT_CATALOG) {
      const current = def.evaluate(evalCtx)
      const target = def.target
      const isQualified = current >= target
      const existingEarned = earnedKeyMap.get(def.key)

      const dbRecord = dbAchMap.get(def.key)
      const id = dbRecord?.id || def.key

      if (isQualified && !existingEarned) {
        // Unlock newly achieved!
        if (dbRecord) {
          try {
            await prisma.userAchievement.create({
              data: {
                userId,
                achievementId: dbRecord.id,
              },
            })
            bonusXp += def.xpReward
            bonusCoins += def.coinReward
            newlyEarnedKeys.push(def.key)
          } catch (e) {
            // If already created in race condition, ignore
          }
        }
      }

      const isEarned = Boolean(existingEarned) || isQualified
      const earnedAtDate = existingEarned?.earnedAt
        ? existingEarned.earnedAt.toISOString()
        : isQualified
        ? new Date().toISOString()
        : undefined

      const progressPercent = Math.min(100, Math.round((current / target) * 100))

      items.push({
        id,
        key: def.key,
        name: def.name,
        description: def.description,
        category: def.category,
        categoryLabel: def.categoryLabel,
        icon: def.icon,
        xpReward: def.xpReward,
        coinReward: def.coinReward,
        earned: isEarned,
        earnedAt: earnedAtDate,
        currentProgress: current,
        targetProgress: target,
        progressPercent,
      })
    }

    // If new achievements were unlocked, update user totals
    let currentXp = user.xp || (isReaderDemo ? 4250 : 0)
    let currentCoins = user.coins || (isReaderDemo ? 420 : 0)

    if (bonusXp > 0 || bonusCoins > 0) {
      currentXp += bonusXp
      currentCoins += bonusCoins
      await prisma.user.update({
        where: { id: userId },
        data: {
          xp: { increment: bonusXp },
          coins: { increment: bonusCoins },
        },
      })
    }

    // 5. Categorize and build stats
    const categoryKeys: { key: AchievementDefinition['category']; label: string }[] = [
      { key: 'STREAKS', label: 'Streaks & Consistency' },
      { key: 'VOLUME', label: 'Reading Volume' },
      { key: 'HABITS', label: 'Habits & Atmosphere' },
      { key: 'EXPLORATION', label: 'Exploration & Diversity' },
    ]

    const categories = categoryKeys.map(({ key, label }) => {
      const catItems = items.filter((i) => i.category === key)
      return {
        key,
        label,
        count: catItems.length,
        earnedCount: catItems.filter((i) => i.earned).length,
      }
    })

    const earnedItems = items.filter((i) => i.earned)
    const totalEarned = earnedItems.length
    const totalAchievements = items.length
    const completionPercent = Math.round((totalEarned / totalAchievements) * 100)

    const userLevel = computeLevelInfo(currentXp, currentCoins)

    // Sort achievements: earned first (by earnedAt desc), then by progress percent desc
    items.sort((a, b) => {
      if (a.earned && !b.earned) return -1
      if (!a.earned && b.earned) return 1
      if (!a.earned && !b.earned) return b.progressPercent - a.progressPercent
      return 0
    })

    return {
      userLevel,
      achievements: items,
      categories,
      stats: {
        totalEarned,
        totalAchievements,
        completionPercent,
        totalCoinsEarned: currentCoins,
        recentUnlocks: earnedItems.slice(0, 3),
      },
    }
  } catch (error) {
    console.error('Error in getUserAchievementsData:', error)
    throw error
  }
}
