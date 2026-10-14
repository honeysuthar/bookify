"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function createJournalEntry(
  bookId: string,
  content: string,
  title?: string,
  rating?: number
) {
  const user = await getCurrentUser();
  if (!user || !user.id) {
    throw new Error("Unauthorized");
  }

  // Check if book exists in db
  const book = await prisma.book.findUnique({
    where: { id: bookId },
  });

  if (!book) {
    throw new Error("Book not found");
  }

  const entry = await prisma.journalEntry.create({
    data: {
      userId: user.id,
      bookId,
      title,
      content,
      rating,
    },
  });

  revalidatePath("/journal");
  return entry;
}

export async function updateJournalEntry(
  entryId: string,
  content: string,
  title?: string,
  rating?: number
) {
  const user = await getCurrentUser();
  if (!user || !user.id) {
    throw new Error("Unauthorized");
  }

  const existingEntry = await prisma.journalEntry.findUnique({
    where: { id: entryId },
  });

  if (!existingEntry || existingEntry.userId !== user.id) {
    throw new Error("Unauthorized or entry not found");
  }

  const entry = await prisma.journalEntry.update({
    where: { id: entryId },
    data: {
      content,
      title,
      rating,
    },
  });

  revalidatePath("/journal");
  return entry;
}

export async function deleteJournalEntry(entryId: string) {
  const user = await getCurrentUser();
  if (!user || !user.id) {
    throw new Error("Unauthorized");
  }

  const existingEntry = await prisma.journalEntry.findUnique({
    where: { id: entryId },
  });

  if (!existingEntry || existingEntry.userId !== user.id) {
    throw new Error("Unauthorized or entry not found");
  }

  await prisma.journalEntry.delete({
    where: { id: entryId },
  });

  revalidatePath("/journal");
  return { success: true };
}

export async function getJournalEntries() {
  const user = await getCurrentUser();
  if (!user || !user.id) {
    return [];
  }

  const entries = await prisma.journalEntry.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      book: true,
    },
  });

  return entries;
}

export async function getUserLibraryBooks() {
  const user = await getCurrentUser();
  if (!user || !user.id) {
    return [];
  }

  const library = await prisma.userLibrary.findMany({
    where: { userId: user.id },
    include: { book: true },
    orderBy: { updatedAt: "desc" },
  });

  return library.map((lib) => lib.book);
}
