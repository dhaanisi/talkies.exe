/**
 * TMDB API Utility for talkies.exe
 * 
 * This library handles all movie data fetching from The Movie Database.
 * API Documentation: https://developer.themoviedb.org/reference/intro/getting-started
 */

const TMDB_API_URL = "https://api.themoviedb.org/3";
const TMDB_TOKEN = process.env.TMDB_ACCESS_TOKEN;

/**
 * Interface representing a Movie from TMDB
 */
export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  adult: false;
  video: false;
}

/**
 * Generic response from TMDB list endpoints (trending, search, etc.)
 */
export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

/**
 * Standard fetch options for TMDB
 */
const fetchOptions: RequestInit = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${TMDB_TOKEN}`,
  },
  // Use Next.js caching strategy
  next: { revalidate: 3600 }, // Cache for 1 hour by default
};

/**
 * Fetch movie data from TMDB
 */
async function tmdbFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  if (!TMDB_TOKEN) {
    throw new Error("TMDB_API_READ_ACCESS_TOKEN is not defined in environment variables.");
  }

  const queryParams = new URLSearchParams(params).toString();
  const url = `${TMDB_API_URL}${endpoint}${queryParams ? `?${queryParams}` : ""}`;

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`TMDB API Error: ${response.status} - ${errorData.status_message || "Unknown error"}`);
  }

  return response.json();
}

/**
 * Get trending movies (daily or weekly)
 */
export async function getTrendingMovies(timeWindow: "day" | "week" = "day") {
  return tmdbFetch<TMDBResponse<TMDBMovie>>(`/trending/movie/${timeWindow}`);
}

/**
 * Search movies by title
 */
export async function searchMovies(query: string, page = 1) {
  return tmdbFetch<TMDBResponse<TMDBMovie>>("/search/movie", {
    query,
    page: page.toString(),
  });
}

/**
 * Get detailed info for a specific movie
 */
export async function getMovieDetails(movieId: number) {
  return tmdbFetch<TMDBMovie & { runtime: number; genres: { id: number; name: string }[] }>(`/movie/${movieId}`);
}

/**
 * Get full image URL for a TMDB path
 */
export function getTMDBImageUrl(path: string | null, size: "w500" | "original" = "w500"): string {
  if (!path) return "/placeholder-poster.png"; // Placeholder if no path
  const baseUrl = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p/";
  return `${baseUrl}${size}${path}`;
}
