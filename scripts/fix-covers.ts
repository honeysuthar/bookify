import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const books = await prisma.book.findMany();
  for (const book of books) {
    if (book.isbn13 && book.coverUrl?.includes("books.google.com/books/content?id=")) {
      // It's a fake google books ID like id=fourth-wing
      const newCover = `https://covers.openlibrary.org/b/isbn/${book.isbn13}-L.jpg?default=false`;
      await prisma.book.update({
        where: { id: book.id },
        data: { coverUrl: newCover },
      });
      console.log(`Updated ${book.title} cover to ${newCover}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
