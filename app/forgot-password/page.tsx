import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <BookOpen className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold text-gradient">Bookify</span>
        </div>
        <div className="glass rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-foreground mb-1">Reset password</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Enter your email and we&apos;ll send a reset link.
          </p>
          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
            </div>
            <Button type="submit" className="w-full">Send Reset Link</Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link href="/login" className="text-primary hover:underline">← Back to login</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
