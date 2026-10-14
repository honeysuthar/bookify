import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getJournalEntries, getUserLibraryBooks } from "@/app/actions/journal";
import JournalClient from "./JournalClient";

export const dynamic = "force-dynamic";

export default async function JournalPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const entries = await getJournalEntries();
  const libraryBooks = await getUserLibraryBooks();

  return (
    <JournalClient 
      initialEntries={entries} 
      libraryBooks={libraryBooks} 
    />
  );
}
