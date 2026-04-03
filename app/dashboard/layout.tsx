"use client";

import { MatrixRain } from "@/components/MatrixRain";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-[#000500] text-[#92e5a1] font-mono selection:bg-cyan/30 overflow-hidden">
      {/* Background Matrix Rain */}
      <MatrixRain />
      <div className="fixed inset-0 bg-linear-to-b from-[#000500]/40 via-transparent to-[#000500]/40 pointer-events-none z-0" />

      {/* Main Content Area */}
      <main className="relative z-10 min-h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-cyan/10 scrollbar-track-transparent">
        {children}
      </main>
    </div>
  );
}
