import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Settings } from "lucide-react";

const groups = [
  {
    title: "Account",
    items: [
      { label: "Email", value: "user@example.com" },
      { label: "Username", value: "@username" },
      { label: "Connected accounts", value: "None" },
    ],
  },
  {
    title: "Reading Goals",
    items: [
      { label: "Daily goal", value: "15 min / day" },
      { label: "Yearly goal", value: "12 books" },
    ],
  },
  {
    title: "Notifications",
    items: [
      { label: "Reading reminders", value: "Off" },
      { label: "Streak alerts", value: "Off" },
      { label: "Achievement unlocks", value: "Off" },
    ],
  },
  {
    title: "Appearance",
    items: [
      { label: "Theme", value: "Dark" },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
      </div>

      {groups.map((group) => (
        <div key={group.title} className="glass rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border/50">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{group.title}</p>
          </div>
          {group.items.map((item, i) => (
            <div
              key={item.label}
              className={`flex items-center justify-between px-5 py-4 ${
                i < group.items.length - 1 ? "border-b border-border/30" : ""
              }`}
            >
              <span className="text-sm text-foreground">{item.label}</span>
              <span className="text-sm text-muted-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      ))}

      {/* Danger zone */}
      <div className="glass rounded-2xl overflow-hidden border border-destructive/20">
        <div className="px-5 py-3 border-b border-border/50">
          <p className="text-xs font-semibold text-destructive/80 uppercase tracking-wider">Danger Zone</p>
        </div>
        <div className="p-5 flex flex-col gap-3">
          <Button variant="outline" className="w-full border-destructive/30 text-destructive hover:bg-destructive/10">
            Log Out
          </Button>
          <Button variant="ghost" className="w-full text-destructive/60 hover:text-destructive hover:bg-destructive/10 text-xs">
            Delete Account
          </Button>
        </div>
      </div>

      <div className="text-center">
        <Link href="/profile" className="text-xs text-muted-foreground hover:text-foreground">
          ← Back to Profile
        </Link>
      </div>
    </div>
  );
}
