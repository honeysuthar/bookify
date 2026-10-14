import type { Metadata } from "next";
import "./globals.css";
import { LibraryProvider } from "@/lib/library-store";
import { Providers } from "@/app/providers";
import { Great_Vibes, Fraunces, Cormorant } from "next/font/google";

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

const cormorant = Cormorant({
  subsets: ["latin"],
  variable: "--font-cormorant",
});
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
    <html lang="en" className={`dark ${greatVibes.variable} ${fraunces.variable} ${cormorant.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased" suppressHydrationWarning>
        <Providers>
          <LibraryProvider>{children}</LibraryProvider>
        </Providers>
      </body>
    </html>
  );
}