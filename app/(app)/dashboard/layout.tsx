export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat relative"
      style={{
        backgroundImage: "url('/interior.png')",
      }}
    >
      {/* Atmospheric darkening overlay to keep text & cards crisp */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-[1px] pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
