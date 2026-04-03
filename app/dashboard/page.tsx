"use client";

import { useState } from "react";
import { useAuth, SignOutButton } from "@clerk/nextjs";

/* ─────────────────────────────────────────
   Mock data
───────────────────────────────────────── */
const MY_RECENT = [
  { id: 1, title: "Dune: Part Two", year: 2024, genre: "Sci-Fi", rating: 5, date: "today, 02:17", note: "The Giedi Prime sequences shot in UV still haunt me.", palette: "blue" },
  { id: 2, title: "Stalker", year: 1979, genre: "Arthouse", rating: 5, date: "yesterday", note: "Memory as architecture. Tarkovsky builds rooms you can feel.", palette: "purple" },
  { id: 3, title: "The Substance", year: 2024, genre: "Horror", rating: 4, date: "3 days ago", note: "Maximalist body horror that somehow still lands.", palette: "green" },
];

const FOLLOWING_RECENT = [
  { id: 4, user: "voidframe", title: "Annihilation", year: 2018, genre: "Sci-Fi", rating: 5, date: "01:44 UTC", note: "The shimmer sequences feel like thinking itself.", palette: "blue" },
  { id: 5, user: "nn_user", title: "Past Lives", year: 2023, genre: "Drama", rating: 5, date: "05:20 UTC", note: "Quiet longing. The bar scene alone earns five stars.", palette: "green" },
  { id: 6, user: "rx_ghost", title: "Hereditary", year: 2018, genre: "Horror", rating: 4, date: "09:11 UTC", note: "Sound design as dread. Nothing compares.", palette: "purple" },
  { id: 7, user: "k1llswitch", title: "Blade Runner 2049", year: 2017, genre: "Neo-Noir", rating: 5, date: "11:05 UTC", note: "Deakins. Every frame. That's it.", palette: "blue" },
  { id: 8, user: "staticwave", title: "The Brutalist", year: 2024, genre: "Epic", rating: 4, date: "14:33 UTC", note: "Three and a half hours and I wanted more.", palette: "green" },
];

const ROOMS = [
  { name: "horror-void", unread: 3 },
  { name: "a24-transmission", unread: 0 },
  { name: "criterion-archive", unread: 0 },
  { name: "sci-fi-lab", unread: 1 },
  { name: "arthouse", unread: 0 },
];

/* ─────────────────────────────────────────
   Poster art (abstract geometric)
───────────────────────────────────────── */
function PosterArt({ palette, title }: { palette: string; title: string }) {
  const colors = {
    blue: { bg: "#020c1a", line: "rgba(0,194,255,0.15)", glyph: "rgba(0,194,255,0.08)" },
    purple: { bg: "#08021a", line: "rgba(168,85,247,0.15)", glyph: "rgba(168,85,247,0.08)" },
    green: { bg: "#011208", line: "rgba(0,255,65,0.15)", glyph: "rgba(0,255,65,0.08)" },
  };
  const c = colors[palette as keyof typeof colors] ?? colors.blue;
  const seed = title.charCodeAt(0) % 4;

  return (
    <div style={{ height: "100%", background: c.bg, position: "relative", overflow: "hidden" }}>
      {/* scanlines */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
        backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.1) 3px,rgba(0,0,0,0.1) 4px)",
      }} />
      {/* geometric lines */}
      {seed === 0 && <>
        <div style={{ position: "absolute", top: "35%", left: 0, width: "100%", height: "1px", background: c.line }} />
        <div style={{ position: "absolute", top: 0, left: "40%", width: "1px", height: "100%", background: c.line }} />
      </>}
      {seed === 1 && <>
        <div style={{ position: "absolute", top: "55%", left: 0, width: "100%", height: "1px", background: c.line }} />
        <div style={{ position: "absolute", top: "20%", left: 0, width: "100%", height: "1px", background: c.line, opacity: 0.5 }} />
      </>}
      {seed === 2 && <>
        <div style={{ position: "absolute", top: 0, left: "55%", width: "1px", height: "100%", background: c.line }} />
        <div style={{ position: "absolute", top: "40%", left: "15%", width: "70%", height: "1px", background: c.line }} />
      </>}
      {seed === 3 && <>
        <div style={{ position: "absolute", top: "30%", left: "20%", width: "60%", height: "40%", border: `1px solid ${c.line}`, transform: "rotate(-6deg)" }} />
      </>}
      {/* corner brackets */}
      <div style={{ position: "absolute", top: 8, left: 8, width: 10, height: 10, borderTop: `1px solid ${c.line.replace("0.15", "0.5")}`, borderLeft: `1px solid ${c.line.replace("0.15", "0.5")}`, zIndex: 3 }} />
      <div style={{ position: "absolute", bottom: 8, right: 8, width: 10, height: 10, borderBottom: `1px solid ${c.line.replace("0.15", "0.5")}`, borderRight: `1px solid ${c.line.replace("0.15", "0.5")}`, zIndex: 3 }} />
      {/* glyph */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontFamily: "'VT323',monospace", fontSize: 48, color: c.glyph, zIndex: 1, userSelect: "none" }}>◈</div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Film card — my logs
───────────────────────────────────────── */
function MyFilmCard({ film }: { film: typeof MY_RECENT[0] }) {
  const [hovered, setHovered] = useState(false);
  const accentColor = film.palette === "blue" ? "#00c2ff" : film.palette === "purple" ? "#a855f7" : "#00ff41";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `1px solid ${hovered ? accentColor + "44" : "rgba(0,255,65,0.1)"}`,
        transition: "border-color 0.2s, background 0.2s",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        background: hovered ? "rgba(0,255,65,0.02)" : "#080a16",
      } as React.CSSProperties}
    >
      {/* top accent bar */}
      <div style={{ height: 2, background: `linear-gradient(90deg, ${accentColor}, transparent)`, transform: hovered ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left", transition: "transform 0.3s ease" }} />
      <div style={{ display: "flex", gap: 0 }}>
        {/* poster */}
        <div style={{ width: 80, flexShrink: 0, height: 120 }}>
          <PosterArt palette={film.palette} title={film.title} />
        </div>
        {/* info */}
        <div style={{ padding: "16px 20px", flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
            <div>
              <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 600, fontSize: 15, color: "rgba(210,220,255,0.9)", letterSpacing: 0.5, marginBottom: 2 }}>{film.title}</div>
              <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: "rgba(0,255,65,0.35)", letterSpacing: 2 }}>{film.year} · {film.genre}</div>
            </div>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: "rgba(0,255,65,0.3)", letterSpacing: 1, whiteSpace: "nowrap", marginLeft: 12 }}>{film.date}</div>
          </div>
          <div style={{ display: "flex", gap: 3, marginBottom: 10 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} style={{ fontSize: 11, color: i < film.rating ? accentColor : "rgba(0,255,65,0.1)" }}>★</span>
            ))}
          </div>
          <p style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 13, color: "rgba(160,175,220,0.45)", lineHeight: 1.6, margin: 0, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" } as React.CSSProperties}>{film.note}</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Film card — following feed
───────────────────────────────────────── */
function FollowCard({ film }: { film: typeof FOLLOWING_RECENT[0] }) {
  const [hovered, setHovered] = useState(false);
  const accentColor = film.palette === "blue" ? "#00c2ff" : film.palette === "purple" ? "#a855f7" : "#00ff41";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(0,255,65,0.015)" : "transparent",
        border: `1px solid ${hovered ? "rgba(0,255,65,0.15)" : "rgba(0,255,65,0.07)"}`,
        transition: "all 0.2s",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ height: 1, background: `linear-gradient(90deg, ${accentColor}, transparent)`, transform: hovered ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left", transition: "transform 0.28s ease" }} />
      <div style={{ display: "flex", gap: 0 }}>
        {/* poster */}
        <div style={{ width: 64, flexShrink: 0, height: 100 }}>
          <PosterArt palette={film.palette} title={film.title} />
        </div>
        {/* info */}
        <div style={{ padding: "14px 18px", flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: "#00ff41", letterSpacing: 2 }}>@{film.user}</span>
            <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 9, color: "rgba(0,255,65,0.25)", letterSpacing: 1, marginLeft: "auto" }}>{film.date}</span>
          </div>
          <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 600, fontSize: 14, color: "rgba(210,220,255,0.85)", marginBottom: 3 }}>{film.title}</div>
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 9, color: "rgba(0,255,65,0.28)", letterSpacing: 2, marginBottom: 8 }}>{film.year} · {film.genre}</div>
          <div style={{ display: "flex", gap: 3, marginBottom: 8 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} style={{ fontSize: 10, color: i < film.rating ? accentColor : "rgba(0,255,65,0.1)" }}>★</span>
            ))}
          </div>
          <p style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 12, color: "rgba(160,175,220,0.4)", lineHeight: 1.6, margin: 0, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" } as React.CSSProperties}>{film.note}</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Dashboard Feed (Main Content)
───────────────────────────────────────── */
export default function Dashboard() {
  const { isSignedIn } = useAuth();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=VT323&family=Rajdhani:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --g: #00ff41;
          --g2: rgba(0,255,65,0.35);
          --g3: rgba(0,255,65,0.1);
          --blue: #00c2ff;
          --purple: #a855f7;
          --bg: transparent; /* allow the Matrix rain through */
          --bg2: #080a16;
          --bg3: #0c0e1c;
          --b: rgba(0,255,65,0.1);
          --b2: rgba(0,255,65,0.22);
          --w: rgba(210,220,255,0.9);
          --dim: rgba(0,255,65,0.35);
          --mono: 'Share Tech Mono', monospace;
          --vt: 'VT323', monospace;
          --raj: 'Rajdhani', sans-serif;
        }

        /* main layout */
        .main { 
          background: transparent; 
          display: grid; 
          grid-template-columns: 1fr 280px; 
          min-height: 100vh;
        }
        
        .feed { padding: 36px 40px; border-right: 1px solid var(--b); }
        .panel-right { padding: 36px 28px; background: transparent; }

        .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .section-title { font-size: 9px; color: var(--dim); letter-spacing: 4px; text-transform: uppercase; font-family: var(--mono); }
        .section-count { font-size: 9px; color: rgba(0,255,65,0.2); letter-spacing: 2px; font-family: var(--mono); }

        .film-stack { display: flex; flex-direction: column; gap: 1px; margin-bottom: 48px; }

        /* right panel */
        .panel-block { margin-bottom: 36px; }
        .panel-label { font-size: 8px; color: rgba(0,255,65,0.25); letter-spacing: 4px; text-transform: uppercase; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid var(--b); font-family: var(--mono); }
        .stat-row { display: flex; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid rgba(0,255,65,0.05); font-size: 11px; font-family: var(--mono); }
        .stat-row:last-child { border-bottom: none; }
        .stat-key { color: rgba(0,255,65,0.3); letter-spacing: 1px; }
        .stat-val { color: var(--g); letter-spacing: 1px; }
        .room-row { display: flex; align-items: center; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid rgba(0,255,65,0.05); cursor: pointer; transition: padding-left 0.15s; font-family: var(--mono); }
        .room-row:last-child { border-bottom: none; }
        .room-row:hover { padding-left: 4px; }
        .room-name { font-size: 11px; color: rgba(0,255,65,0.4); letter-spacing: 0.5px; transition: color 0.15s; }
        .room-row:hover .room-name { color: var(--g); }
        .room-badge { font-size: 8px; color: var(--g); background: rgba(0,255,65,0.1); border: 1px solid rgba(0,255,65,0.2); padding: 1px 5px; }
        .log-btn { width: 100%; background: transparent; border: 1px solid var(--b2); color: var(--g); font-family: var(--mono); font-size: 11px; padding: 12px; cursor: pointer; letter-spacing: 3px; text-transform: uppercase; transition: all 0.2s; margin-bottom: 8px; }
        .log-btn:hover { background: rgba(0,255,65,0.06); box-shadow: 0 0 16px rgba(0,255,65,0.08); }
        .log-btn-secondary { width: 100%; background: transparent; border: 1px solid rgba(0,255,65,0.1); color: rgba(0,255,65,0.35); font-family: var(--mono); font-size: 10px; padding: 10px; cursor: pointer; letter-spacing: 2px; text-transform: uppercase; transition: all 0.2s; }
        .log-btn-secondary:hover { border-color: var(--b2); color: var(--g); }
        
        /* top-level search container (was topbar) */
        .top-search-container {
          padding: 24px 40px;
          border-bottom: 1px solid var(--b);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .t-search { position: relative; width: 100%; max-width: 480px; flex: 1; }
        .t-search input { width: 100%; background: var(--bg3); border: 1px solid var(--b); color: var(--w); font-family: var(--mono); font-size: 11px; padding: 7px 14px 7px 32px; outline: none; letter-spacing: 0.5px; transition: border-color 0.2s; }
        .t-search input:focus { border-color: var(--b2); }
        .t-search input::placeholder { color: rgba(0,255,65,0.2); }
        .t-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 11px; color: var(--dim); font-family: var(--mono); }
        
        .t-btn-yellow {
          font-family: var(--mono);
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #FFD700;
          border: 1px solid rgba(255, 215, 0, 0.4);
          padding: 8px 20px;
          background: transparent;
          cursor: pointer;
          transition: all 0.2s;
        }
        .t-btn-yellow:hover {
          background: rgba(255, 215, 0, 0.1);
          border-color: #FFD700;
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.2);
        }
      `}</style>
      
      {/* ── MAIN SEARCH ── */}
      <div className="top-search-container bg-(--bg2)/60 backdrop-blur-md">
        <div className="t-search">
          <span className="t-search-icon">⌕</span>
          <input type="text" placeholder="search cinema surveillance..." />
        </div>
        <SignOutButton>
          <button className="t-btn-yellow">sign out</button>
        </SignOutButton>
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="main">
        {/* Feed */}
        <div className="feed bg-(--bg)/40 backdrop-blur-sm">
          {/* My recent logs */}
          <div className="section-header">
            <span className="section-title">// my recent logs</span>
            <span className="section-count">{MY_RECENT.length} entries</span>
          </div>
          <div className="film-stack">
            {MY_RECENT.map((f) => <MyFilmCard key={f.id} film={f} />)}
          </div>

          {/* Following feed */}
          <div className="section-header">
            <span className="section-title">// following</span>
            <span className="section-count">{FOLLOWING_RECENT.length} new</span>
          </div>
          <div className="film-stack">
            {FOLLOWING_RECENT.map((f) => <FollowCard key={f.id} film={f} />)}
          </div>
        </div>

        {/* Right panel */}
        <div className="panel-right bg-(--bg2)/80 backdrop-blur-xl border-l border-(--b)">
          <div className="panel-block">
            <button className="log-btn">+ log a film</button>
            <button className="log-btn-secondary">browse watchlist</button>
          </div>

          <div className="panel-block">
            <div className="panel-label">your stats</div>
            <div className="stat-row"><span className="stat-key">logged</span><span className="stat-val">247</span></div>
            <div className="stat-row"><span className="stat-key">this month</span><span className="stat-val">14</span></div>
            <div className="stat-row"><span className="stat-key">avg rating</span><span className="stat-val">★ 3.8</span></div>
            <div className="stat-row"><span className="stat-key">following</span><span className="stat-val">31</span></div>
            <div className="stat-row"><span className="stat-key">followers</span><span className="stat-val">18</span></div>
          </div>

          <div className="panel-block">
            <div className="panel-label">active rooms</div>
            {ROOMS.filter(r => r.unread > 0 || true).slice(0, 4).map((r) => (
              <div key={r.name} className="room-row">
                <span className="room-name"># {r.name}</span>
                {r.unread > 0 && <span className="room-badge">{r.unread}</span>}
              </div>
            ))}
          </div>

          <div className="panel-block">
            <div className="panel-label">trending today</div>
            {["The Brutalist", "Anora", "Nosferatu", "Stalker"].map((t, i) => (
              <div key={t} className="stat-row">
                <span className="stat-key" style={{ color: "rgba(0,255,65,0.22)" }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 600, fontSize: 12, color: "rgba(210,220,255,0.6)", letterSpacing: 0.5 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}