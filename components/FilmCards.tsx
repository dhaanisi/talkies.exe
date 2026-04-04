"use client";

import { useState } from "react";

/* ─────────────────────────────────────────
   Poster art (abstract geometric fallback)
───────────────────────────────────────── */
export function PosterArt({ palette, title }: { palette: string; title: string }) {
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
   Shared types
───────────────────────────────────────── */
export interface MyFilm {
  id: number;
  title: string;
  year: number;
  genre: string;
  rating: number;
  date: string;
  note: string;
  palette: string;
  poster: string | null;
}

export interface FollowFilm extends MyFilm {
  user: string;
}

/* ─────────────────────────────────────────
   Film card — my logs
───────────────────────────────────────── */
export function MyFilmCard({ film }: { film: MyFilm }) {
  const [hovered, setHovered] = useState(false);
  const accentColor = "#00ff41";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        background: "#080a16",
        border: `1px solid ${hovered ? accentColor + "AA" : "rgba(0,255,65,0.1)"}`,
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? `0 8px 16px ${accentColor}15` : "none",
        aspectRatio: "2 / 3",
      } as React.CSSProperties}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(90deg, ${accentColor}, transparent)`, opacity: hovered ? 0.8 : 0, transition: "opacity 0.2s", zIndex: 10 }} />
      {/* poster layer */}
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        {film.poster ? (
          <img src={`https://image.tmdb.org/t/p/w500${film.poster}`} alt={film.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        ) : (
          <PosterArt palette={film.palette} title={film.title} />
        )}

        {/* Hover overlay rating */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0))",
          padding: "24px 0 12px 0", display: "flex", justifyContent: "center",
          opacity: hovered ? 1 : 0, transition: "opacity 0.2s",
          pointerEvents: "none",
        }}>
          <div style={{ display: "flex", gap: 3 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} style={{ fontSize: 13, color: i < film.rating ? accentColor : "rgba(0,255,65,0.15)", textShadow: i < film.rating ? `0 0 6px ${accentColor}` : "none" }}>★</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Film card — following feed
───────────────────────────────────────── */
export function FollowCard({ film }: { film: FollowFilm }) {
  const [hovered, setHovered] = useState(false);
  const accentColor = "#00ff41";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        background: "#080a16",
        border: `1px solid ${hovered ? accentColor + "AA" : "rgba(0,255,65,0.1)"}`,
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? `0 8px 16px ${accentColor}15` : "none",
        aspectRatio: "2 / 3",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(90deg, ${accentColor}, transparent)`, opacity: hovered ? 0.8 : 0, transition: "opacity 0.2s", zIndex: 10 }} />
      {/* poster layer */}
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        {film.poster ? (
          <img src={`https://image.tmdb.org/t/p/w500${film.poster}`} alt={film.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        ) : (
          <PosterArt palette={film.palette} title={film.title} />
        )}

        {/* Hover overlay text */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(0,10,5,0.95) 0%, rgba(0,10,5,0.75) 60%, rgba(0,10,5,0.2) 100%)",
          padding: "16px 12px 12px", display: "flex", flexDirection: "column", justifyContent: "flex-end",
          opacity: hovered ? 1 : 0, transition: "opacity 0.2s",
          pointerEvents: "none",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: "#00ff41", letterSpacing: 1 }}>@{film.user}</span>
            <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, color: "rgba(0,255,65,0.4)", letterSpacing: 1, marginLeft: "auto" }}>{film.date}</span>
          </div>
          <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 15, color: "rgba(220,230,255,0.95)", letterSpacing: 0.5, marginBottom: 2, lineHeight: 1.1 }}>{film.title}</div>
          <div style={{ display: "flex", gap: 2, marginBottom: 10 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} style={{ fontSize: 11, color: i < film.rating ? accentColor : "rgba(0,255,65,0.15)", textShadow: i < film.rating ? `0 0 6px ${accentColor}` : "none" }}>★</span>
            ))}
          </div>
          <p style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 12, color: "rgba(180,200,210,0.8)", lineHeight: 1.4, margin: 0, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical" } as React.CSSProperties}>{film.note}</p>
        </div>
      </div>
    </div>
  );
}
