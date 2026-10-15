"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function LandingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [leaving, setLeaving] = useState(false);

  const isLoggedIn = status === "authenticated";

  const handleStartReading = () => {
    if (leaving) return;
    setLeaving(true);
    // If logged in from a previous session, direct straight to /dashboard
    // Otherwise direct to /signup to begin onboarding
    const target = isLoggedIn ? "/dashboard" : "/signup";
    setTimeout(() => router.push(target), 500);
  };

  const handleLogIn = () => {
    if (leaving) return;
    setLeaving(true);
    const target = isLoggedIn ? "/dashboard" : "/login";
    setTimeout(() => router.push(target), 500);
  };

  return (
    <main
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundColor: "#c9a87a",
        transition: "opacity 0.5s ease",
        opacity: leaving ? 0 : 1,
      }}
    >
      <style>{`
        @keyframes pageFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .page-enter { animation: pageFadeIn 0.8s ease forwards; }

        @keyframes fadeOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0.97); }
          60%  { opacity: 1; transform: scale(1.015); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes buttonReveal {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .btn-primary {
          animation: buttonReveal 0.6s 3.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          opacity: 0;
        }
        .btn-secondary {
          animation: buttonReveal 0.6s 3.75s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          opacity: 0;
        }
      `}</style>

      <div className="page-enter flex flex-col items-center w-full max-w-4xl px-4">
        {/* Logo area */}
        <div className="w-full h-40 md:h-56 lg:h-64 flex items-center justify-center -mb-8 relative">
          {/* Handwriting trace — fades out at 3.2s */}
          <img
            src="/bookify_intro.svg"
            alt="bookify trace intro"
            className="absolute inset-0 w-full h-full max-w-lg object-contain mx-auto"
            style={{ animation: "fadeOut 0.5s 3.2s ease forwards" }}
          />
          {/* Final logo — pops in at 3.3s */}
          <img
            src="/bookify.svg"
            alt="bookify"
            className="absolute inset-0 w-full h-full max-w-lg object-contain mx-auto"
            style={{ animation: "popIn 0.7s 3.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards", opacity: 0 }}
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-row gap-4 mt-8">
          <button
            onClick={handleStartReading}
            disabled={leaving}
            className="btn-primary flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:translate-y-0 disabled:opacity-50"
            style={{ backgroundColor: "#0f0705", color: "#c9a87a" }}
          >
            Start Reading <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={handleLogIn}
            disabled={leaving}
            className="btn-secondary flex items-center justify-center px-8 py-3.5 rounded-xl text-base font-medium border border-[#0f0705]/20 hover:bg-[#0f0705]/5 transition-all disabled:opacity-50"
            style={{ color: "#0f0705" }}
          >
            {isLoggedIn ? "Go to Hearth" : "Log In"}
          </button>
        </div>
      </div>
    </main>
  );
}
