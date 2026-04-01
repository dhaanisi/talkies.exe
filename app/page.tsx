import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { SignedIn, SignedOut } from "@/components/ClerkAuth";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-6 md:px-12">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 border border-cyan-400 flex items-center justify-center">
            <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-cyan-400 border-b-[6px] border-b-transparent ml-1" />
          </div>
          <span className="text-xl font-bold tracking-[0.2em] font-cyber">CELLULOID</span>
        </div>

        <div className="hidden md:block text-xs font-mono-cyber opacity-50">
          // NETWORK v0.1
        </div>

        <div className="flex items-center gap-6">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-sm font-mono-cyber hover:opacity-70 transition-opacity cursor-pointer">
                SIGN IN
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-5 py-2 border border-cyan-400/50 text-sm font-mono-cyber hover:bg-cyan-400 hover:text-black transition-all cursor-pointer">
                JOIN
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="px-5 py-2 border border-cyan-400/50 text-sm font-mono-cyber hover:bg-cyan-400 hover:text-black transition-all">
              GO TO SYSTEM
            </Link>
          </SignedIn>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="mt-24 md:mt-40 flex flex-col items-center text-center px-6">
        <div className="flex items-center gap-2 mb-8 animate-pulse">
          <div className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-[10px] md:text-xs font-mono-cyber text-cyan-400 tracking-[0.3em]">
            LIVE // CINEMATIC NETWORK
          </span>
        </div>

        <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tight font-cyber max-w-5xl leading-[0.9]">
          WHERE <span className="text-white">FILM LOVERS</span><br />
          <span className="text-cyan-400">BECOME CRITICS.</span>
        </h1>

        <p className="max-w-2xl text-gray-400 text-sm md:text-base mb-12 font-cyber leading-relaxed">
          A dark-mode cinematic network to discover, review, and archive films.<br />
          Real-time rooms. Honest takes. No algorithm — just taste.
        </p>

        <div className="flex flex-col md:flex-row gap-4">
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="px-10 py-4 bg-transparent border border-cyan-400 text-cyan-400 font-mono-cyber hover:bg-cyan-400 hover:text-black transition-all group flex items-center gap-2 cursor-pointer">
                ENTER NETWORK
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="px-10 py-4 text-gray-500 font-mono-cyber hover:text-white transition-colors cursor-pointer">
                SIGN IN
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="px-10 py-4 bg-cyan-400 text-black font-mono-cyber hover:bg-cyan-500 transition-all flex items-center gap-2">
              ACCESS TERMINAL
              <span>→</span>
            </Link>
          </SignedIn>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="absolute bottom-12 left-0 w-full px-6 flex flex-wrap justify-center gap-12 md:gap-24 opacity-80">
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl font-bold font-cyber text-cyan-400 tracking-wider">2.4K</span>
          <span className="text-[9px] font-mono-cyber text-gray-500">ACTIVE USERS</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl font-bold font-cyber text-cyan-400 tracking-wider">18K</span>
          <span className="text-[9px] font-mono-cyber text-gray-500">FILMS LOGGED</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl font-bold font-cyber text-cyan-400 tracking-wider">12</span>
          <span className="text-[9px] font-mono-cyber text-gray-500">LIVE ROOMS</span>
        </div>
      </div>

      {/* Background Ambience */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.05),transparent_70%)]" />
    </main>
  );
}
