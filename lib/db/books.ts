import prisma from '../prisma'
import { Book, Prisma, BookSource } from '@prisma/client'

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
  authors?: string[] // list of author names
  genres?: string[]  // list of genre names
}

/**
 * Creates a new book, including upserting authors and genres, and linking them.
 */
export async function createBook(data: CreateBookInput): Promise<Book> {
  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Create or find the book base record
      const book = await tx.book.create({
        data: {
          externalId: data.externalId,
          source: data.source,
          isbn10: data.isbn10,
          isbn13: data.isbn13,
          title: data.title,
          subtitle: data.subtitle,
          description: data.description,
          coverUrl: data.coverUrl,
          pageCount: data.pageCount,
          publishedDate: data.publishedDate,
          publisher: data.publisher,
          language: data.language,
          averageRating: data.averageRating,
          ratingsCount: data.ratingsCount || 0,
        },
      })

      // 2. Link authors
      if (data.authors && data.authors.length > 0) {
        for (const authorName of data.authors) {
          // Find or create the Author
          let author = await tx.author.findFirst({
            where: { name: authorName },
          })
          if (!author) {
            author = await tx.author.create({
              data: { name: authorName },
            })
          }
          // Link via BookAuthor
          await tx.bookAuthor.create({
            data: {
              bookId: book.id,
              authorId: author.id,
            },
          })
        }
      }

      // 3. Link genres
      if (data.genres && data.genres.length > 0) {
        for (const genreName of data.genres) {
          const slug = genreName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          // Find or create the Genre
          let genre = await tx.genre.findUnique({
            where: { slug },
          })
          if (!genre) {
            genre = await tx.genre.create({
              data: {
                name: genreName,
                slug,
              },
            })
          }
          // Link via BookGenre
          await tx.bookGenre.create({
            data: {
              bookId: book.id,
              genreId: genre.id,
            },
          })
        }
      }

      return book
    })
  } catch (error) {
    console.error('Error in createBook:', error)
    throw error
  }
}

/**
 * Retrieves a book by its internal database ID, including its authors and genres.
 */
export async function getBookById(id: string) {
  try {
    return await prisma.book.findUnique({
      where: { id },
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
    })
  } catch (error) {
    console.error('Error in getBookById:', error)
    throw error
  }
}

/**
 * Retrieves a book by its external source and ID.
 */
export async function getBookByExternalId(source: BookSource, externalId: string) {
  try {
    return await prisma.book.findUnique({
      where: {
        source_externalId: {
          source,
          externalId,
        },
      },
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
    })
  } catch (error) {
    console.error('Error in getBookByExternalId:', error)
    throw error
  }
}

/**
 * Updates a book's basic details.
 */
export async function updateBook(
  id: string,
  data: Prisma.BookUpdateInput
): Promise<Book> {
  try {
    return await prisma.book.update({
      where: { id },
      data,
    })
  } catch (error) {
    console.error('Error in updateBook:', error)
    throw error
  }
}

/**
 * Deletes a book by its internal ID.
 */
export async function deleteBook(id: string): Promise<Book> {
  try {
    return await prisma.book.delete({
      where: { id },
    })
  } catch (error) {
    console.error('Error in deleteBook:', error)
    throw error
  }
}

/**
 * Searches for books matching a query in title or description.
 */
export async function searchBooks(query: string): Promise<Book[]> {
  try {
    return await prisma.book.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { subtitle: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
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
      take: 20,
    })
  } catch (error) {
    console.error('Error in searchBooks:', error)
    throw error
  }
}
