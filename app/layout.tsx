import type { Metadata } from "next";
import "./globals.css";
import { LibraryProvider } from "@/lib/library-store";

export const metadata: Metadata = {
  title: {
    default: "Bookify — Your Reading Identity",
    template: "%s | Bookify",
  },
  description:
    "Turn reading into a habit you're proud of. Track progress, discover books, and uncover who you're becoming as a reader.",
  keywords: ["reading", "books", "tracker", "library", "reading habit"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased" suppressHydrationWarning>
        <LibraryProvider>{children}</LibraryProvider>
      </body>
    </html>
  );
}