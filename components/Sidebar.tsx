"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface NavItem {
  icon: string;
  label: string;
  href: string;
  badge?: number;
}

interface Room {
  name: string;
  unread: number;
}

/* ─────────────────────────────────────────
   Static data — swap for real API later
───────────────────────────────────────── */
const NAV_ITEMS: NavItem[] = [
  { icon: "◈", label: "discover", href: "/discover" },
  { icon: "≡", label: "feed", href: "/dashboard" },
  { icon: "⊞", label: "watchlist", href: "/watchlist", badge: 12 },
  { icon: "◉", label: "profile", href: "/profile" },
  { icon: "◆", label: "stats", href: "/stats" },
];

const ROOMS: Room[] = [
  { name: "horror-void", unread: 3 },
  { name: "a24-transmission", unread: 0 },
  { name: "criterion-archive", unread: 0 },
  { name: "sci-fi-lab", unread: 1 },
  { name: "arthouse", unread: 0 },
];

/* ─────────────────────────────────────────
   Tooltip wrapper (shows on collapsed mode)
───────────────────────────────────────── */
function Tip({
  label,
  show,
  children,
}: {
  label: string;
  show: boolean;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);

  if (!show) return <>{children}</>;

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          style={{
            position: "absolute",
            left: "calc(100% + 12px)",
            top: "50%",
            transform: "translateY(-50%)",
            background: "#080a16",
            border: "1px solid rgba(0,255,65,0.22)",
            color: "rgba(0,255,65,0.9)",
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 10,
            letterSpacing: 2,
            padding: "5px 10px",
            whiteSpace: "nowrap",
            zIndex: 100,
            pointerEvents: "none",
          }}
        >
          {label}
          {/* left arrow */}
          <div
            style={{
              position: "absolute",
              left: -5,
              top: "50%",
              transform: "translateY(-50%)",
              width: 0,
              height: 0,
              borderTop: "4px solid transparent",
              borderBottom: "4px solid transparent",
              borderRight: "5px solid rgba(0,255,65,0.22)",
            }}
          />
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   Sidebar
───────────────────────────────────────── */
export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();

  useEffect(() => setMounted(true), []);

  const W = collapsed ? 56 : 220;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=VT323&family=Rajdhani:wght@400;600&display=swap');

        :root {
          --g:   #00ff41;
          --b:   rgba(0,255,65,0.10);
          --b2:  rgba(0,255,65,0.22);
          --dim: rgba(0,255,65,0.32);
          --w:   rgba(210,220,255,0.88);
          --bg2: #080a16;
          --bg3: #0c0e1c;
          --mono: 'Share Tech Mono', monospace;
          --vt:   'VT323', monospace;
          --raj:  'Rajdhani', sans-serif;
        }

        .sb {
          background: var(--bg2);
          border-right: 1px solid var(--b2);
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
          position: relative;
          transition: width 0.28s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0;
        }

        /* scanline overlay on sidebar */
        .sb::after {
          content: '';
          pointer-events: none;
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent, transparent 3px,
            rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px
          );
          z-index: 0;
        }

        /* everything above the scanline */
        .sb > * { position: relative; z-index: 1; }

        /* ── toggle row ── */
        .sb-toggle {
          display: flex;
          align-items: center;
          height: 48px;
          padding: 0 14px;
          border-bottom: 1px solid var(--b);
          flex-shrink: 0;
        }
        .sb-logo {
          font-family: var(--vt);
          font-size: 20px;
          letter-spacing: 3px;
          color: var(--w);
          text-decoration: none;
          white-space: nowrap;
          overflow: hidden;
          flex: 1;
          transition: opacity 0.2s;
        }
        .sb-logo span { color: var(--g); }
        .sb-chevron {
          background: transparent;
          border: 1px solid var(--b);
          color: var(--dim);
          font-family: var(--mono);
          font-size: 11px;
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: border-color 0.18s, color 0.18s;
          margin-left: auto;
        }
        .sb-chevron:hover { border-color: var(--g); color: var(--g); }

        /* ── section label ── */
        .sb-section {
          font-family: var(--mono);
          font-size: 8px;
          color: rgba(0,255,65,0.2);
          letter-spacing: 3px;
          text-transform: uppercase;
          padding: 16px 16px 5px;
          white-space: nowrap;
          overflow: hidden;
        }
        .sb-section.centered { text-align: center; padding: 16px 0 5px; }

        /* ── nav item ── */
        .sb-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 16px;
          font-family: var(--mono);
          font-size: 11px;
          color: rgba(0,255,65,0.32);
          border-left: 2px solid transparent;
          text-decoration: none;
          white-space: nowrap;
          cursor: pointer;
          transition: color 0.15s, background 0.15s, padding-left 0.15s, border-color 0.15s;
          overflow: hidden;
          position: relative;
        }
        .sb-item.centered {
          justify-content: center;
          padding: 9px 0;
          border-left: 2px solid transparent;
        }
        .sb-item:hover {
          color: var(--g);
          background: rgba(0,255,65,0.03);
        }
        .sb-item.active {
          color: var(--g);
          border-left-color: var(--g);
          background: rgba(0,255,65,0.04);
        }
        .sb-item.active::before {
          content: '';
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 1px;
          background: rgba(0,255,65,0.15);
        }

        .sb-icon {
          font-size: 13px;
          flex-shrink: 0;
          width: 16px;
          text-align: center;
        }
        .sb-label {
          overflow: hidden;
          transition: opacity 0.18s, max-width 0.28s cubic-bezier(0.4,0,0.2,1);
          letter-spacing: 0.5px;
        }
        .sb-badge {
          margin-left: auto;
          font-size: 8px;
          color: var(--g);
          background: rgba(0,255,65,0.08);
          border: 1px solid var(--b2);
          padding: 1px 5px;
          flex-shrink: 0;
          font-family: var(--mono);
          transition: opacity 0.15s;
        }

        /* ── room row ── */
        .sb-room {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          font-family: var(--mono);
          font-size: 10px;
          color: rgba(0,255,65,0.28);
          text-decoration: none;
          cursor: pointer;
          white-space: nowrap;
          overflow: hidden;
          transition: color 0.15s, background 0.15s, padding-left 0.15s;
        }
        .sb-room.centered {
          justify-content: center;
          padding: 8px 0;
        }
        .sb-room:hover {
          color: var(--g);
          background: rgba(0,255,65,0.02);
          padding-left: 20px;
        }
        .sb-room.centered:hover { padding-left: 0; }
        .sb-room-hash {
          font-size: 10px;
          color: rgba(0,255,65,0.18);
          flex-shrink: 0;
        }
        .sb-room-unread {
          margin-left: auto;
          font-size: 8px;
          color: var(--g);
          background: rgba(0,255,65,0.08);
          border: 1px solid var(--b2);
          padding: 1px 4px;
          flex-shrink: 0;
          font-family: var(--mono);
          transition: opacity 0.15s;
        }

        /* ── divider ── */
        .sb-divider {
          height: 1px;
          background: var(--b);
          margin: 8px 16px;
          flex-shrink: 0;
        }
        .sb-divider.full { margin: 8px 0; }

        /* ── spacer ── */
        .sb-spacer { flex: 1; }

        /* ── user profile bottom ── */
        .sb-user {
          border-top: 1px solid var(--b);
          padding: 14px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: background 0.15s;
          flex-shrink: 0;
          overflow: hidden;
        }
        .sb-user.centered { justify-content: center; padding: 14px 0; }
        .sb-user:hover { background: rgba(0,255,65,0.03); }
        .sb-avatar {
          width: 30px;
          height: 30px;
          border: 1px solid var(--b2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--vt);
          font-size: 16px;
          color: var(--g);
          flex-shrink: 0;
          transition: border-color 0.18s;
          position: relative;
        }
        .sb-user:hover .sb-avatar { border-color: var(--g); }
        .sb-online {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--g);
          border: 1px solid var(--bg2);
          animation: online-pulse 2s ease-in-out infinite;
        }
        @keyframes online-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,255,65,0.4); }
          50%       { box-shadow: 0 0 0 4px rgba(0,255,65,0); }
        }
        .sb-user-info {
          overflow: hidden;
          transition: opacity 0.18s, max-width 0.28s cubic-bezier(0.4,0,0.2,1);
        }
        .sb-username {
          font-family: var(--mono);
          font-size: 11px;
          color: var(--g);
          letter-spacing: 1px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sb-user-sub {
          font-family: var(--mono);
          font-size: 9px;
          color: rgba(0,255,65,0.28);
          letter-spacing: 1px;
          white-space: nowrap;
        }
        .sb-user-action {
          margin-left: auto;
          font-size: 10px;
          color: rgba(0,255,65,0.2);
          flex-shrink: 0;
          transition: color 0.15s, opacity 0.18s;
        }
        .sb-user:hover .sb-user-action { color: var(--dim); }
      `}</style>

      <div className="sb" style={{ width: W }}>

        {/* ── LOGO + COLLAPSE TOGGLE ── */}
        <div className="sb-toggle">
          {!collapsed && (
            <Link href="/" className="sb-logo">
              talkies<span>.exe</span>
            </Link>
          )}
          <button
            className="sb-chevron"
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? "expand sidebar" : "collapse sidebar"}
            style={{ marginLeft: collapsed ? "auto" : "auto" }}
          >
            {collapsed ? "▸" : "◂"}
          </button>
        </div>

        {/* ── MAIN NAV ── */}
        {!collapsed && (
          <div className="sb-section">// navigate</div>
        )}
        {NAV_ITEMS.map((item) => {
          const active = mounted && pathname === item.href;
          return (
            <Tip key={item.label} label={item.label} show={collapsed}>
              <Link
                href={item.href}
                className={`sb-item${active ? " active" : ""}${collapsed ? " centered" : ""}`}
              >
                <span className="sb-icon">{item.icon}</span>
                {!collapsed && (
                  <>
                    <span className="sb-label">{item.label}</span>
                    {item.badge != null && (
                      <span className="sb-badge">{item.badge}</span>
                    )}
                  </>
                )}
                {collapsed && item.badge != null && (
                  /* tiny dot indicator when collapsed */
                  <span
                    style={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "var(--g)",
                    }}
                  />
                )}
              </Link>
            </Tip>
          );
        })}

        <div className={`sb-divider${collapsed ? " full" : ""}`} />

        {/* ── ROOMS ── */}
        {!collapsed && (
          <div className="sb-section">// rooms</div>
        )}
        {ROOMS.map((room) => (
          <Tip key={room.name} label={`#${room.name}`} show={collapsed}>
            <Link
              href={`/rooms/${room.name}`}
              className={`sb-room${collapsed ? " centered" : ""}`}
            >
              <span className="sb-room-hash">#</span>
              {!collapsed && (
                <>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}>
                    {room.name}
                  </span>
                  {room.unread > 0 && (
                    <span className="sb-room-unread">{room.unread}</span>
                  )}
                </>
              )}
              {collapsed && room.unread > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "var(--g)",
                  }}
                />
              )}
            </Link>
          </Tip>
        ))}

        {/* ── SETTINGS ── */}
        <div className="sb-spacer" />

        <div className={`sb-divider${collapsed ? " full" : ""}`} />

        {!collapsed && (
          <div className="sb-section">// system</div>
        )}
        <Tip label="settings" show={collapsed}>
          <Link href="/settings" className={`sb-item${collapsed ? " centered" : ""}`}>
            <span className="sb-icon">⊙</span>
            {!collapsed && <span className="sb-label">settings</span>}
          </Link>
        </Tip>

        {/* ── USER PROFILE ── */}
        <div className={`sb-user${collapsed ? " centered" : ""}`}>
          <div className="sb-avatar">
            {mounted && user?.username
              ? user.username.slice(0, 2).toUpperCase()
              : "KL"}
            <span className="sb-online" />
          </div>
          {!collapsed && (
            <>
              <div className="sb-user-info">
                <div className="sb-username">
                  @{mounted && user?.username ? user.username : "k1llswitch"}
                </div>
                <div className="sb-user-sub">247 logged · 3.8 avg</div>
              </div>
              <span className="sb-user-action">⊕</span>
            </>
          )}
        </div>

      </div>
    </>
  );
}