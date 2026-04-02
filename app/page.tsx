"use client";

import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { fetchTrendingMoviesAction } from "@/app/actions/tmdb";
import type { TMDBMovie } from "@/app/lib/tmdb";

// Static rooms and logs stay the same for now

const ACTIVE_ROOMS = [
  { name: "dune-lore-deep-dive", users: 34 },
  { name: "a24-transmission", users: 61 },
  { name: "criterion-archive", users: 22 },
  { name: "horror-void", users: 18 },
];

const LATEST_LOGS = [
  {
    user: "NEON_XAVI",
    film: "Dune: Part Two",
    text: "Villeneuve built a cathedral and then let it breathe. The Giedi Prime sequences shot in UV still make more visual sense than most blockbusters.",
    rating: 4,
    timestamp: "02:17 UTC",
  },
  {
    user: "KIRANREV",
    film: "Past Lives",
    text: "Celine Song understands that longing isn't dramatic. It's quiet. It sits at a bar watching the life you didn't choose.",
    rating: 5,
    timestamp: "05:44 UTC",
  },
  {
    user: "ZONE_PRIYA",
    film: "The Matrix",
    text: "Still the cleanest blend of action and philosophy. The pacing holds up surprisingly well after 25 years.",
    rating: 5,
    timestamp: "10:15 UTC",
  },
];

/* ─────────────────────────────────────────
   Matrix rain canvas
───────────────────────────────────────── */
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノ01アカサタナ◈▸◉■□▲△◆◇";
    const fontSize = 13;
    let cols = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(cols).fill(1).map(() => Math.random() * -50);

    const draw = () => {
      ctx.fillStyle = "rgba(4, 5, 10, 0.055)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      cols = Math.floor(canvas.width / fontSize);
      while (drops.length < cols) drops.push(Math.random() * -50);

      for (let i = 0; i < cols; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const progress = drops[i] / (canvas.height / fontSize);

        if (progress > 0.85) {
          ctx.fillStyle = `rgba(0, 255, 65, ${0.05 + (1 - progress) * 0.12})`;
        } else if (progress > 0.6) {
          ctx.fillStyle = `rgba(0, 143, 17, ${0.04 + progress * 0.06})`;
        } else {
          ctx.fillStyle = `rgba(0, 255, 65, ${0.03 + progress * 0.04})`;
        }

        ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 0.38;
      }
    };

    const interval = setInterval(draw, 45);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10 opacity-70"
    />
  );
}

/* ─────────────────────────────────────────
   Glitch text hook
───────────────────────────────────────── */
function useGlitch(text: string, interval = 5000) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    const GLITCH_CHARS = "▓░▒■□▪▫◈◉01XZ#@";
    let timeout: ReturnType<typeof setTimeout>;

    const glitch = () => {
      let iterations = 0;
      const max = 14;
      const iv = setInterval(() => {
        setDisplay(
          text
            .split("")
            .map((char, i) =>
              i < iterations
                ? char
                : Math.random() > 0.65
                  ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
                  : char
            )
            .join("")
        );
        iterations++;
        if (iterations > max) {
          clearInterval(iv);
          setDisplay(text);
        }
      }, 40);
    };

    const schedule = () => {
      timeout = setTimeout(() => {
        glitch();
        schedule();
      }, interval + Math.random() * 3000);
    };
    schedule();
    return () => clearTimeout(timeout);
  }, [text, interval]);

  return display;
}

/* ─────────────────────────────────────────
   Typewriter hook
───────────────────────────────────────── */
function useTypewriter(text: string, speed = 55, startDelay = 800) {
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const start = setTimeout(() => {
      const iv = setInterval(() => {
        setTyped(text.slice(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(iv);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(iv);
    }, startDelay);
    return () => clearTimeout(start);
  }, [text, speed, startDelay]);

  return { typed, done };
}

/* ─────────────────────────────────────────
   Star rating display
───────────────────────────────────────── */
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          style={{
            color: i < rating ? "#00c2ff" : "rgba(0,194,255,0.15)",
            fontSize: "12px",
            transition: "color 0.2s",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   Page
───────────────────────────────────────── */
export default function Home() {
  const { isLoaded, isSignedIn } = useAuth();
  const titleGlitch = useGlitch("talkies.exe", 4000);
  const { typed: tagline, done: taglineDone } = useTypewriter(
    "log. discuss. obsess.",
    60,
    1200
  );
  const [mounted, setMounted] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState<TMDBMovie[]>([]);
  const [isLoadingTrending, setIsLoadingTrending] = useState(true);

  useEffect(() => {
    setMounted(true);
    
    // Fetch live trending movies from TMDB via Server Action
    async function getTrending() {
      const result = await fetchTrendingMoviesAction();
      if (result.success && result.data) {
        setTrendingMovies(result.data.slice(0, 5)); // Get top 5
      }
      setIsLoadingTrending(false);
    }
    
    getTrending();
  }, []);

  return (
    <>
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=VT323&family=Rajdhani:wght@300;400;500;600&display=swap');

        :root {
          --blue: #00FF41;
          --purple: #008F11;
          --bg: #000500;
          --bg2: #051005;
          --b: rgba(0,255,65,0.12);
          --b2: rgba(0,255,65,0.26);
          --w: rgba(210,255,220,0.9);
          --dim: rgba(0,255,65,0.4);
          --mono: 'Share Tech Mono', monospace;
          --vt: 'VT323', monospace;
          --raj: 'Rajdhani', sans-serif;
        }

        * { box-sizing: border-box; }

        body {
          background: var(--bg);
          color: var(--w);
          font-family: var(--mono);
          overflow-x: hidden;
        }

        /* scanlines overlay */
        body::after {
          content: '';
          pointer-events: none;
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(0,0,0,0.06) 3px,
            rgba(0,0,0,0.06) 4px
          );
        }

        /* thin grid */
        .grid-bg {
          pointer-events: none;
          position: fixed;
          inset: 0;
          z-index: 0;
          background-image:
            linear-gradient(rgba(0,194,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,194,255,0.03) 1px, transparent 1px);
          background-size: 64px 64px;
        }

        /* ── nav ── */
        .t-nav {
          position: relative;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 64px;
          height: 60px;
          border-bottom: 1px solid var(--b);
          background: rgba(0,5,0,0.85);
          backdrop-filter: blur(12px);
        }
        .t-logo {
          font-family: var(--vt);
          font-size: 28px;
          letter-spacing: 4px;
          color: var(--w);
        }
        .t-logo span { color: var(--blue); }
        .t-nav-links {
          display: flex;
          align-items: center;
          gap: 32px;
        }
        .t-nav-link {
          font-size: 10px;
          color: var(--dim);
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          text-decoration: none;
          transition: color 0.2s;
        }
        .t-nav-link:hover { color: var(--blue); }
        .t-btn-ghost {
          font-family: var(--mono);
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(0,255,65,0.5);
          border: 1px solid rgba(0,255,65,0.18);
          padding: 8px 20px;
          background: transparent;
          cursor: pointer;
          transition: all 0.2s;
        }
        .t-btn-ghost:hover {
          color: var(--blue);
          border-color: var(--b2);
          background: rgba(0,194,255,0.05);
        }
        .t-btn-primary {
          font-family: var(--mono);
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--bg);
          background: #22b455;
          border: none;
          padding: 10px 24px;
          cursor: pointer;
          transition: all 0.18s;
          font-weight: 900;
        }
        .t-btn-primary:hover { opacity: 0.88; }

        /* ── hero ── */
        .hero {
          position: relative;
          z-index: 10;
          padding: 120px 64px 100px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0;
        }
        .hero-eyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          color: var(--dim);
          letter-spacing: 5px;
          text-transform: uppercase;
          margin-bottom: 32px;
        }
        .hero-pulse {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #FFD700;
          animation: pulse-dot 1.4s ease-in-out infinite;
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.4);
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.7); }
        }
        .hero-title {
          font-family: var(--vt);
          font-size: clamp(72px, 14vw, 140px);
          line-height: 1;
          letter-spacing: 10px;
          color: var(--w);
          margin-bottom: 10px;
        }
        .hero-title-accent { color: var(--blue); }
        .hero-tagline {
          font-family: var(--raj);
          font-size: clamp(16px, 2.5vw, 24px);
          font-weight: 300;
          letter-spacing: 6px;
          text-transform: uppercase;
          color: rgba(160,175,230,0.55);
          margin-bottom: 20px;
          min-height: 32px;
        }
        .hero-tagline-cursor {
          display: inline-block;
          width: 2px;
          height: 1em;
          background: var(--blue);
          vertical-align: text-bottom;
          animation: blink-cursor 0.8s step-end infinite;
          margin-left: 3px;
        }
        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .hero-desc {
          font-size: 15px;
          color: rgba(200,255,220,0.6);
          line-height: 1.8;
          max-width: 520px;
          margin: 0 auto 52px;
          letter-spacing: 0.8px;
          font-weight: 500;
        }
        .hero-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          margin-bottom: 80px;
        }
        .btn-enter {
          font-family: var(--mono);
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--bg);
          background: #00ff41;
          border: none;
          padding: 14px 40px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-weight: 900;
        }
        .btn-enter::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.12);
          transform: translateX(-100%);
          transition: transform 0.3s;
        }
        .btn-enter:hover::before { transform: translateX(0); }
        .btn-enter:hover {
          box-shadow: 0 0 28px rgba(34,180,85,0.5);
          transform: translateY(-2px);
        }
        .btn-outline {
          font-family: var(--mono);
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #00ff41;
          border: 1px solid rgba(0, 255, 65, 0.3);
          padding: 14px 40px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 900;
        }
        .btn-outline:hover {
          background: rgba(0, 255, 65, 0.05);
          border-color: rgba(0, 255, 65, 0.6);
          box-shadow: 0 0 20px rgba(0, 255, 65, 0.15);
        }

        /* stats bar */
        .stats-bar {
          display: flex;
          gap: 80px;
          justify-content: center;
          border-top: 1px solid var(--b);
          padding-top: 48px;
          width: 100%;
          max-width: 600px;
        }
        .stat { text-align: center; }
        .stat-n {
          font-family: var(--vt);
          font-size: 40px;
          color: var(--blue);
          letter-spacing: 4px;
          display: block;
          line-height: 1;
          margin-bottom: 6px;
        }
        .stat-l {
          font-size: 11px;
          color: var(--dim);
          letter-spacing: 4px;
          text-transform: uppercase;
          font-weight: 600;
        }

        /* ── section ── */
        .section {
          position: relative;
          z-index: 10;
          padding: 96px 64px;
          border-top: 1px solid var(--b);
        }
        .section-label {
          font-size: 11px;
          color: var(--dim);
          letter-spacing: 6px;
          text-transform: uppercase;
          text-align: center;
          margin-bottom: 64px;
          font-weight: 600;
        }

        /* panels grid */
        .panels {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          max-width: 1100px;
          margin: 0 auto;
          border: 1px solid var(--b);
        }
        .panel {
          padding: 40px 36px;
          border-right: 1px solid var(--b);
          background: rgba(8,10,22,0.6);
        }
        .panel:last-child { border-right: none; }
        .panel-label {
          font-size: 11px;
          color: var(--dim);
          letter-spacing: 5px;
          text-transform: uppercase;
          margin-bottom: 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 700;
        }
        .live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #FFD700;
          box-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
          animation: pulse-dot 1.6s infinite;
        }

        /* room row */
        .room-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid rgba(0,194,255,0.07);
          cursor: pointer;
          transition: all 0.18s;
          font-size: 12px;
          color: rgba(160,175,220,0.5);
        }
        .room-row:last-child { border-bottom: none; }
        .room-row:hover { color: var(--blue); padding-left: 6px; }
        .room-row:hover .room-count { color: var(--blue); }
        .room-hash { color: rgba(0,194,255,0.3); margin-right: 4px; }
        .room-count { font-size: 10px; color: rgba(0,194,255,0.25); transition: color 0.18s; }

        /* trending row */
        .trend-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(0,194,255,0.07);
          cursor: pointer;
          transition: all 0.18s;
        }
        .trend-row:last-child { border-bottom: none; }
        .trend-row:hover .trend-title { color: var(--blue); }
        .trend-row:hover { padding-left: 4px; }
        .trend-num {
          font-size: 10px;
          color: rgba(0,194,255,0.25);
          font-weight: 700;
          width: 20px;
          flex-shrink: 0;
        }
        .trend-title {
          font-size: 14px;
          color: rgba(210,255,220,0.85);
          letter-spacing: 0.8px;
          transition: color 0.18s;
          font-family: var(--raj);
          font-weight: 700;
          text-transform: uppercase;
        }
        .trend-meta {
          font-size: 10px;
          color: rgba(0,194,255,0.28);
          margin-top: 2px;
        }

        /* status rows */
        .status-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 0;
          border-bottom: 1px solid rgba(0,194,255,0.07);
          font-size: 10px;
        }
        .status-row:last-child { border-bottom: none; }
        .status-key { color: rgba(160,175,220,0.4); letter-spacing: 2px; }
        .status-ok { color: #10ff88; letter-spacing: 2px; font-weight: 700; }
        .status-info { color: var(--blue); letter-spacing: 2px; font-weight: 700; }

        /* ── divider ── */
        .divider {
          position: relative;
          z-index: 10;
          border-top: 1px solid var(--b);
          margin: 0 64px;
        }
        .divider-label {
          position: absolute;
          top: -9px;
          left: 32px;
          background: var(--bg);
          padding: 0 16px;
          font-size: 9px;
          color: var(--dim);
          letter-spacing: 5px;
          text-transform: uppercase;
        }

        /* ── feed ── */
        .feed-grid {
          position: relative;
          z-index: 10;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          max-width: 1100px;
          margin: 80px auto 100px;
          padding: 0 64px;
          border: 1px solid var(--b);
        }
        .feed-card {
          padding: 40px 36px;
          border-right: 1px solid var(--b);
          background: rgba(8,10,22,0.4);
          cursor: pointer;
          transition: all 0.22s;
          position: relative;
          overflow: hidden;
        }
        .feed-card:last-child { border-right: none; }
        .feed-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 2px;
          background: linear-gradient(90deg, var(--blue), var(--purple));
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        .feed-card:hover::before { transform: scaleX(1); }
        .feed-card:hover { background: rgba(0,194,255,0.03); }
        .feed-user {
          font-size: 11px;
          color: var(--blue);
          letter-spacing: 3px;
          margin-bottom: 6px;
          font-weight: 700;
        }
        .feed-time {
          font-size: 9px;
          color: rgba(0,194,255,0.25);
          letter-spacing: 2px;
          margin-bottom: 20px;
        }
        .feed-film-label {
          font-size: 9px;
          color: var(--dim);
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .feed-film-label span {
          color: rgba(210,220,255,0.7);
          font-family: var(--raj);
          font-weight: 600;
        }
        .feed-text {
          font-size: 14px;
          color: rgba(200,255,220,0.65);
          line-height: 1.8;
          margin-bottom: 24px;
          transition: color 0.2s;
          font-family: var(--raj);
          font-weight: 500;
        }
        .feed-card:hover .feed-text { color: rgba(200,210,255,0.75); }

        /* ── footer ── */
        .t-footer {
          position: relative;
          z-index: 10;
          border-top: 1px solid var(--b);
          background: rgba(4,5,14,0.9);
          padding: 32px 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .footer-logo {
          font-family: var(--vt);
          font-size: 22px;
          letter-spacing: 3px;
          color: rgba(0,194,255,0.25);
        }
        .footer-logo span { color: rgba(0,194,255,0.45); }
        .footer-links {
          display: flex;
          gap: 28px;
        }
        .footer-link {
          font-size: 9px;
          color: rgba(0,194,255,0.22);
          letter-spacing: 3px;
          text-transform: uppercase;
          cursor: pointer;
          transition: color 0.2s;
        }
        .footer-link:hover { color: var(--blue); }
        .footer-copy {
          font-size: 9px;
          color: rgba(0,194,255,0.15);
          letter-spacing: 2px;
        }

        /* entry animation */
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fade-up 0.7s ease forwards; }
        .delay-1 { animation-delay: 0.1s; opacity: 0; }
        .delay-2 { animation-delay: 0.25s; opacity: 0; }
        .delay-3 { animation-delay: 0.4s; opacity: 0; }
        .delay-4 { animation-delay: 0.55s; opacity: 0; }
        .delay-5 { animation-delay: 0.7s; opacity: 0; }
        .delay-6 { animation-delay: 0.85s; opacity: 0; }
      `}</style>

      <MatrixRain />
      <div className="grid-bg" />

      {/* ── NAV ── */}
      <nav className="t-nav">
        <div className="t-logo">
          talkies<span>.exe</span>
        </div>
        <div className="t-nav-links">
          <a className="t-nav-link">films</a>
          <a className="t-nav-link">rooms</a>
          <a className="t-nav-link">about</a>
          {isLoaded && (isSignedIn ? (
            <Link href="/dashboard" className="t-btn-primary" style={{ textDecoration: "none" }}>open terminal</Link>
          ) : (
            <>
              <SignInButton mode="modal"><button className="t-btn-ghost">sign in</button></SignInButton>
              <SignUpButton mode="modal"><button className="t-btn-primary">request access</button></SignUpButton>
            </>
          ))}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        {mounted && (
          <>
            <div className="hero-eyebrow fade-up delay-1">
              <span className="hero-pulse" />
              live &nbsp;·&nbsp; cinematic network &nbsp;·&nbsp; v0.4.1-beta
            </div>

            <div className="hero-title fade-up delay-2">
              {titleGlitch.split("").map((ch, i) => (
                <span
                  key={i}
                  style={{ color: ch === "." ? "var(--blue)" : undefined }}
                >
                  {ch}
                </span>
              ))}
            </div>

            <div className="hero-tagline fade-up delay-3">
              {tagline}
              {!taglineDone && <span className="hero-tagline-cursor" />}
            </div>

            <p className="hero-desc fade-up delay-4">
              a dark-mode cinematic network. log films, write honest takes,
              and find your people inside live rooms.
              <br />
              no algorithm — just taste.
            </p>

            <div className="hero-actions fade-up delay-5">
              {isLoaded && (isSignedIn ? (
                <Link href="/dashboard" className="btn-enter" style={{ textDecoration: "none" }}>open terminal <span>→</span></Link>
              ) : (
                <>
                  <SignUpButton mode="modal"><button className="btn-enter">enter network <span>→</span></button></SignUpButton>
                  <SignInButton mode="modal"><button className="btn-outline">sign in</button></SignInButton>
                </>
              ))}
            </div>

            <div className="stats-bar fade-up delay-6">
              {[
                { n: "2.4K", l: "active users" },
                { n: "18K", l: "films logged" },
                { n: "12", l: "live rooms" },
              ].map((s) => (
                <div className="stat" key={s.l}>
                  <span className="stat-n">{s.n}</span>
                  <span className="stat-l">{s.l}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* ── SYSTEM PANELS ── */}
      <section className="section">
        <div className="section-label">// system panels</div>
        <div className="panels">
          {/* active rooms */}
          <div className="panel">
            <div className="panel-label">
              <span>active rooms</span>
              <span className="live-dot" />
            </div>
            {ACTIVE_ROOMS.map((r) => (
              <div className="room-row" key={r.name}>
                <span>
                  <span className="room-hash">#</span>
                  {r.name}
                </span>
                <span className="room-count">{r.users} online</span>
              </div>
            ))}
          </div>

          {/* trending */}
          <div className="panel">
            <div className="panel-label">trending now</div>
            {isLoadingTrending ? (
              <div className="status-row">
                <span className="status-key">[RUNNING: SYNC_DATA...]</span>
              </div>
            ) : trendingMovies.length > 0 ? (
              trendingMovies.map((f, i) => (
                <div className="trend-row" key={f.id}>
                  <span className="trend-num">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <div className="trend-title">{f.title}</div>
                    <div className="trend-meta">
                      {f.release_date?.split("-")[0] || "????"} · TRENDING
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="status-row">
                <span className="status-key text-red-500">[ERROR: SYNC_FAILED]</span>
              </div>
            )}
          </div>

          {/* system status */}
          <div className="panel">
            <div className="panel-label">system status</div>
            <div className="status-row">
              <span className="status-key">API</span>
              <span className="status-ok">operational</span>
            </div>
            <div className="status-row">
              <span className="status-key">TMDB sync</span>
              <span className="status-ok">connected</span>
            </div>
            <div className="status-row">
              <span className="status-key">latency</span>
              <span className="status-info">12ms</span>
            </div>
            <div className="status-row">
              <span className="status-key">uptime</span>
              <span className="status-info">99.98%</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="divider">
        <span className="divider-label">latest transmissions</span>
      </div>

      {/* ── FEED ── */}
      <div className="feed-grid">
        {LATEST_LOGS.map((log, i) => (
          <div className="feed-card" key={i}>
            <div className="feed-user">@{log.user}</div>
            <div className="feed-time">{log.timestamp}</div>
            <div className="feed-film-label">
              reviewing <span>{log.film}</span>
            </div>
            <p className="feed-text">"{log.text}"</p>
            <Stars rating={log.rating} />
          </div>
        ))}
      </div>

      {/* ── FOOTER ── */}
      <footer className="t-footer">
        <div className="footer-logo">
          talkies<span>.exe</span>
        </div>
        <div className="footer-links">
          {["about", "privacy", "terms", "github"].map((l) => (
            <span className="footer-link" key={l}>{l}</span>
          ))}
        </div>
        <span className="footer-copy">© 2026 // built for cinema lovers</span>
      </footer>
    </>
  );
}