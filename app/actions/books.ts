"use server";

import { createBook, getBookById, getBookByExternalId, updateBook, deleteBook, searchBooks } from "@/lib/db/books"
import { Book, Prisma, BookSource } from "@prisma/client"
import { ActionResponse } from "./users"

interface CreateBookInput {
  externalId: string
  source: BookSource
  isbn10?: string
  isbn13?: string
  title: string
  subtitle?: string
  description?: string
  coverUrl?: string
  pageCount?: number
  publishedDate?: Date
  publisher?: string
  language?: string
  averageRating?: number
  ratingsCount?: number
  authors?: string[]
  genres?: string[]
}

/**
 * Server Action to create or register a book in the catalog.
 */
export async function createBookAction(data: CreateBookInput): Promise<ActionResponse<Book>> {
  try {
    if (!data.externalId || !data.source || !data.title) {
      return { success: false, error: "Missing required fields (externalId, source, and title are required)" }
    }
    const book = await createBook(data)
    return { success: true, data: book }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create book" }
  }
}

/**
 * Server Action to fetch a book by ID.
 */
export async function getBookByIdAction(id: string): Promise<ActionResponse<any>> {
  try {
    if (!id) {
      return { success: false, error: "Book ID is required" }
    }
    const book = await getBookById(id)
    return { success: true, data: book }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch book" }
  }
}

/**
 * Server Action to fetch a book by external source and external ID.
 */
export async function getBookByExternalIdAction(
  source: BookSource,
  externalId: string
): Promise<ActionResponse<any>> {
  try {
    if (!source || !externalId) {
      return { success: false, error: "Source and External ID are required" }
    }
    const book = await getBookByExternalId(source, externalId)
    return { success: true, data: book }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch book by external ID" }
  }
}

/**
 * Server Action to update a book.
 */
export async function updateBookAction(
  id: string,
  data: Prisma.BookUpdateInput
): Promise<ActionResponse<Book>> {
  try {
    if (!id) {
      return { success: false, error: "Book ID is required" }
    }
    const updatedBook = await updateBook(id, data)
    return { success: true, data: updatedBook }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update book" }
  }
}

/**
 * Server Action to delete a book.
 */
export async function deleteBookAction(id: string): Promise<ActionResponse<Book>> {
  try {
    if (!id) {
      return { success: false, error: "Book ID is required" }
    }
    const deletedBook = await deleteBook(id)
    return { success: true, data: deletedBook }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete book" }
  }
}

/**
 * Server Action to search books.
 */
export async function searchBooksAction(query: string): Promise<ActionResponse<Book[]>> {
  try {
    if (query === undefined || query === null) {
      return { success: false, error: "Search query is required" }
    }
    const books = await searchBooks(query)
    return { success: true, data: books }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to search books" }
  }
}
