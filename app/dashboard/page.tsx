import { getTrendingMovies, type TMDBMovie } from "@/app/lib/tmdb";
import { SignOutButton } from "@clerk/nextjs";
import { MyFilmCard, FollowCard, type MyFilm, type FollowFilm } from "@/components/FilmCards";
import { MatrixRain } from "@/components/MatrixRain";
/* ─────────────────────────────────────────
   Generate dynamic mock social metadata
   (stitched to real TMDB movie data)
───────────────────────────────────────── */
const PALETTES = ["blue", "purple", "green"] as const;
const HANDLES = [
  "voidframe", "nn_user", "rx_ghost", "k1llswitch",
  "staticwave", "cyber_junkie", "lens_flare", "noir_sys",
  "phantom_crtx", "cellul0id", "deeptrace", "lux_machina",
];
const GENRES = [
  "Sci-Fi", "Drama", "Horror", "Thriller", "Neo-Noir",
  "Arthouse", "Action", "Gothic", "Anime", "Epic", "Biopic",
];
const REVIEW_FRAGMENTS = [
  "Every frame is a painting. This is cinema at its most visually intoxicating.",
  "Sound design as dread. It climbs right under your skin and never leaves.",
  "The editing is peerless. Reality dissolves completely into controlled madness.",
  "Maximalist storytelling that somehow still lands every single emotional beat.",
  "Atmosphere was suffocating, in the best way. Couldn't look away.",
  "Philosophy interwoven with stunning visuals. Absolutely transcendent work.",
  "The brutalist compositions contrast perfectly against the narrative weight.",
  "A masterclass in visual storytelling and restrained emotional devastation.",
  "Style as substance dripping in neon. Pure cinematic adrenaline distilled.",
  "Memory as architecture. You can feel every room the camera enters.",
  "Hand drawn destruction on a scale that still hasn't been matched.",
  "Quiet longing rendered in the most devastating way possible.",
  "The blueprint for everything we celebrate about cinema.",
  "Horrifying beauty wrapped in iridescent oil slicks. Cosmic dread perfected.",
  "Three hours and I desperately wanted more. Absolutely sprawling and vital.",
  "Still flawless after multiple viewings. The gold standard of its genre.",
  "The score alone earns five stars. Auditory perfection from start to finish.",
  "An airtight screenplay executed with breathtaking precision and confidence.",
  "True cosmic horror wrapped in a shell of mesmerizing visual craft.",
  "A two hour experience that manages to contain entire worlds within it.",
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function mapToMyFilm(movie: TMDBMovie, index: number): MyFilm {
  const rng = seededRandom(movie.id);
  const year = movie.release_date ? parseInt(movie.release_date.split("-")[0]) : 2024;
  const daysAgo = index === 0 ? 0 : index;
  const dateLabel =
    daysAgo === 0 ? "today, 02:17" :
      daysAgo === 1 ? "yesterday" :
        daysAgo < 7 ? `${daysAgo} days ago` :
          `${Math.ceil(daysAgo / 7)} week${Math.ceil(daysAgo / 7) > 1 ? "s" : ""} ago`;

  return {
    id: movie.id,
    title: movie.title,
    year,
    genre: GENRES[Math.floor(rng() * GENRES.length)],
    rating: Math.floor(rng() * 2) + 4, // 4 or 5
    date: dateLabel,
    note: REVIEW_FRAGMENTS[Math.floor(rng() * REVIEW_FRAGMENTS.length)],
    palette: PALETTES[index % PALETTES.length],
    poster: movie.poster_path,
  };
}

function mapToFollowFilm(movie: TMDBMovie, index: number): FollowFilm {
  const rng = seededRandom(movie.id + 1000);
  const year = movie.release_date ? parseInt(movie.release_date.split("-")[0]) : 2024;
  const hour = (index * 3 + 1) % 24;
  const minute = Math.floor(rng() * 60);

  return {
    id: movie.id,
    title: movie.title,
    year,
    genre: GENRES[Math.floor(rng() * GENRES.length)],
    rating: Math.floor(rng() * 2) + 4,
    date: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} UTC`,
    note: REVIEW_FRAGMENTS[Math.floor(rng() * REVIEW_FRAGMENTS.length)],
    palette: PALETTES[index % PALETTES.length],
    poster: movie.poster_path,
    user: HANDLES[index % HANDLES.length],
  };
}

/* ─────────────────────────────────────────
   Dashboard (Server Component)
───────────────────────────────────────── */
const ROOMS = [
  { name: "horror-void", unread: 3 },
  { name: "a24-transmission", unread: 0 },
  { name: "criterion-archive", unread: 0 },
  { name: "sci-fi-lab", unread: 1 },
  { name: "arthouse", unread: 0 },
];

export default async function Dashboard() {
  // ── Fetch live TMDB trending movies ──
  let myRecent: MyFilm[] = [];
  let followingFeed: FollowFilm[] = [];
  let trendingTitles: string[] = [];

  try {
    const data = await getTrendingMovies("day");
    const movies = data.results;

    // First 7 movies → "my recent logs"
    myRecent = movies.slice(0, 7).map(mapToMyFilm);

    // Next 12 movies → "following feed"
    followingFeed = movies.slice(7, 19).map(mapToFollowFilm);

    // Top 4 for trending sidebar
    trendingTitles = movies.slice(0, 4).map((m) => m.title);
  } catch (err) {
    console.error("TMDB fetch failed, using empty state:", err);
    trendingTitles = ["—", "—", "—", "—"];
  }

  return (
    <>
      <div className="grid-bg" />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=VT323&family=Rajdhani:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --g: #00ff41;
          --g2: rgba(0,255,65,0.35);
          --g3: rgba(0,255,65,0.1);
          --blue: #00c2ff;
          --purple: #a855f7;
          --bg: transparent;
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

        .grid-bg { pointer-events: none; position: fixed; inset: 0; z-index: 0; background-image: linear-gradient(rgba(0,255,65,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.02) 1px, transparent 1px); background-size: 64px 64px; }

        .film-matrix-compact { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 6px; margin-bottom: 48px; width: 100%; }
        .film-matrix { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px; margin-bottom: 48px; width: 100%; }

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
        
        /* top-level search container */
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

        /* live pulse indicator */
        .live-pulse {
          display: inline-block;
          width: 6px;
          height: 6px;
          background: #00ff41;
          border-radius: 50%;
          margin-right: 8px;
          animation: pulse-glow 2s ease-in-out infinite;
          box-shadow: 0 0 6px rgba(0,255,65,0.5);
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px rgba(0,255,65,0.5); }
          50% { opacity: 0.4; box-shadow: 0 0 2px rgba(0,255,65,0.2); }
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
            <span className="section-title"><span className="live-pulse" />// my recent logs</span>
            <span className="section-count">{myRecent.length} entries</span>
          </div>
          {myRecent.length === 0 ? (
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: "rgba(0,255,65,0.3)", padding: "40px 0", textAlign: "center", letterSpacing: 2 }}>
              ▓▓ SIGNAL LOST — TMDB UPLINK FAILED ▓▓
            </div>
          ) : (
            <div className="film-matrix-compact">
              {myRecent.map((f) => <MyFilmCard key={f.id} film={f} />)}
            </div>
          )}

          {/* Following feed */}
          <div className="section-header" style={{ marginTop: 40 }}>
            <span className="section-title"><span className="live-pulse" />// following</span>
            <span className="section-count">{followingFeed.length} new</span>
          </div>
          {followingFeed.length === 0 ? (
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: "rgba(0,255,65,0.3)", padding: "40px 0", textAlign: "center", letterSpacing: 2 }}>
              ▓▓ FEED EMPTY — AWAITING TRANSMISSION ▓▓
            </div>
          ) : (
            <div className="film-matrix">
              {followingFeed.map((f) => <FollowCard key={f.id} film={f} />)}
            </div>
          )}
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
            <div className="panel-label"><span className="live-pulse" />trending today</div>
            {trendingTitles.map((t, i) => (
              <div key={t + i} className="stat-row">
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