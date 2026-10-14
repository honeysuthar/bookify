import { Bell } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 pt-20 md:pt-24 pb-16 space-y-6">
      <h1 className="text-3xl font-bold font-serif text-[#f0dfc0]">Notifications</h1>
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Bell className="h-8 w-8 text-primary/40" />
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-2">Nothing new</h2>
        <p className="text-sm text-muted-foreground">Go read something — we&apos;ll let you know when something happens.</p>
      </div>
    </div>
  );
}
