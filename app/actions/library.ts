"use server";

import prisma from "@/lib/prisma"
import { createBook } from "@/lib/db/books"
import { addBookToLibrary, getUserLibrary, updateLibraryEntry, removeBookFromLibrary, toggleFavorite, getUserFavorites } from "@/lib/db/library"
import { UserLibrary, ReadingStatus, Prisma } from "@prisma/client"
import { ActionResponse } from "./users"

import { getSessionUserId } from "@/lib/auth"

/**
 * Server Action to add a book to the library. Handles automatic caching of book metadata if needed.
 */
export async function addBookToLibraryAction(
  userId: string,
  bookId: string,
  status?: ReadingStatus,
  metadata?: {
    title: string
    author: string
    coverUrl?: string
  }
): Promise<ActionResponse<UserLibrary>> {
  try {
    const sessionUserId = await getSessionUserId()
    const actualUserId = sessionUserId || userId
    if (!actualUserId || !bookId) {
      return { success: false, error: "User ID and Book ID are required" }
    }

    let dbBook = await prisma.book.findFirst({
      where: {
        OR: [
          { id: bookId },
          { externalId: bookId }
        ]
      }
    })

    if (!dbBook) {
      if (metadata) {
        dbBook = await createBook({
          externalId: bookId,
          source: "GOOGLE_BOOKS",
          title: metadata.title,
          coverUrl: metadata.coverUrl,
          authors: metadata.author ? [metadata.author] : [],
        })
      } else {
        return { success: false, error: "Book not found in database catalog and no metadata provided." }
      }
    }

    const entry = await addBookToLibrary(actualUserId, dbBook.id, status)
    return { success: true, data: entry }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to add book to library" }
  }
}

/**
 * Server Action to retrieve the user's library.
 */
export async function getUserLibraryAction(userId: string): Promise<ActionResponse<any[]>> {
  try {
    const sessionUserId = await getSessionUserId()
    const actualUserId = sessionUserId || userId
    if (!actualUserId) {
      return { success: false, error: "User ID is required" }
    }
    const library = await getUserLibrary(actualUserId)
    return { success: true, data: library }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch user library" }
  }
}

/**
 * Server Action to update a library entry (such as progress or status).
 */
export async function updateLibraryEntryAction(
  userId: string,
  bookId: string,
  data: Prisma.UserLibraryUpdateWithoutUserInput
): Promise<ActionResponse<UserLibrary>> {
  try {
    const sessionUserId = await getSessionUserId()
    const actualUserId = sessionUserId || userId
    if (!actualUserId || !bookId) {
      return { success: false, error: "User ID and Book ID are required" }
    }

    const dbBook = await prisma.book.findFirst({
      where: {
        OR: [
          { id: bookId },
          { externalId: bookId }
        ]
      }
    })

    if (!dbBook) {
      return { success: false, error: "Book not found in database catalog." }
    }

    const updatedEntry = await updateLibraryEntry(actualUserId, dbBook.id, data)
    return { success: true, data: updatedEntry }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update library entry" }
  }
}

/**
 * Server Action to remove a book from the library.
 */
export async function removeBookFromLibraryAction(
  userId: string,
  bookId: string
): Promise<ActionResponse<UserLibrary>> {
  try {
    const sessionUserId = await getSessionUserId()
    const actualUserId = sessionUserId || userId
    if (!actualUserId || !bookId) {
      return { success: false, error: "User ID and Book ID are required" }
    }

    const dbBook = await prisma.book.findFirst({
      where: {
        OR: [
          { id: bookId },
          { externalId: bookId }
        ]
      }
    })

    if (!dbBook) {
      return { success: false, error: "Book not found in database catalog." }
    }

    const deletedEntry = await removeBookFromLibrary(actualUserId, dbBook.id)
    return { success: true, data: deletedEntry }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to remove book from library" }
  }
}

/**
 * Server Action to toggle favorited status.
 */
export async function toggleFavoriteAction(
  userId: string,
  bookId: string,
  metadata?: {
    title?: string
    author?: string
    coverUrl?: string
  }
): Promise<ActionResponse<{ favorited: boolean }>> {
  try {
    const sessionUserId = await getSessionUserId()
    const actualUserId = sessionUserId || userId
    if (!actualUserId || !bookId) {
      return { success: false, error: "User ID and Book ID are required" }
    }

    let dbBook = await prisma.book.findFirst({
      where: {
        OR: [
          { id: bookId },
          { externalId: bookId }
        ]
      }
    })

    if (!dbBook) {
      if (metadata?.title) {
        dbBook = await createBook({
          externalId: bookId,
          source: "GOOGLE_BOOKS",
          title: metadata.title,
          coverUrl: metadata.coverUrl,
          authors: metadata.author ? [metadata.author] : [],
        })
      } else {
        return { success: false, error: "Book not found in database catalog." }
      }
    }

    const result = await toggleFavorite(actualUserId, dbBook.id)
    return { success: true, data: result }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to toggle favorite status" }
  }
}

/**
 * Server Action to get user favorites.
 */
export async function getUserFavoritesAction(userId: string): Promise<ActionResponse<any[]>> {
  try {
    const sessionUserId = await getSessionUserId()
    const actualUserId = sessionUserId || userId
    if (!actualUserId) {
      return { success: false, error: "User ID is required" }
    }
    const favorites = await getUserFavorites(actualUserId)
    return { success: true, data: favorites }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch user favorites" }
  }
}
