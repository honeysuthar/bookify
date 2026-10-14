import prisma from '../prisma'
import { UserLibrary, Favorite, ReadingStatus, Prisma } from '@prisma/client'

/**
 * Adds a book to a user's library. If the entry already exists, updates it.
 */
export async function addBookToLibrary(
  userId: string,
  bookId: string,
  status: ReadingStatus = 'WANT_TO_READ'
): Promise<UserLibrary> {
  try {
    return await prisma.userLibrary.upsert({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
      update: {
        status,
      },
      create: {
        userId,
        bookId,
        status,
      },
    })
  } catch (error) {
    console.error('Error in addBookToLibrary:', error)
    throw error
  }
}

/**
 * Retrieves all library entries for a specific user, including the book details.
 */
export async function getUserLibrary(userId: string) {
  try {
    return await prisma.userLibrary.findMany({
      where: { userId },
      include: {
        book: {
          include: {
            authors: {
              include: {
                author: true,
              },
            },
            genres: {
              include: {
                genre: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })
  } catch (error) {
    console.error('Error in getUserLibrary:', error)
    throw error
  }
}

/**
 * Updates a library entry's status or current page progress.
 */
export async function updateLibraryEntry(
  userId: string,
  bookId: string,
  data: Prisma.UserLibraryUpdateWithoutUserInput
): Promise<UserLibrary> {
  try {
    return await prisma.userLibrary.update({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
      data,
    })
  } catch (error) {
    console.error('Error in updateLibraryEntry:', error)
    throw error
  }
}

/**
 * Removes a book from a user's library.
 */
export async function removeBookFromLibrary(
  userId: string,
  bookId: string
): Promise<UserLibrary> {
  try {
    return await prisma.userLibrary.delete({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    })
  } catch (error) {
    console.error('Error in removeBookFromLibrary:', error)
    throw error
  }
}

/**
 * Toggles whether a book is in a user's favorites.
 */
export async function toggleFavorite(userId: string, bookId: string): Promise<{ favorited: boolean }> {
  try {
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    })

    if (existing) {
      await prisma.favorite.delete({
        where: {
          userId_bookId: {
            userId,
            bookId,
          },
        },
      })
      return { favorited: false }
    } else {
      await prisma.favorite.create({
        data: {
          userId,
          bookId,
        },
      })
      return { favorited: true }
    }
  } catch (error) {
    console.error('Error in toggleFavorite:', error)
    throw error
  }
}

/**
 * Gets all favorite books for a user.
 */
export async function getUserFavorites(userId: string) {
  try {
    return await prisma.favorite.findMany({
      where: { userId },
      include: {
        book: {
          include: {
            authors: {
              include: {
                author: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  } catch (error) {
    console.error('Error in getUserFavorites:', error)
    throw error
  }
}
