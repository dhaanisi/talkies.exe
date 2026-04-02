"use server";

import { getTrendingMovies } from "@/app/lib/tmdb";

/**
 * Server Action to fetch trending movies for the client safely.
 * This keeps the TMDB API Token on the server.
 */
export async function fetchTrendingMoviesAction() {
  try {
    const data = await getTrendingMovies("day");
    return { success: true, data: data.results };
  } catch (error) {
    console.error("Failed to fetch trending movies:", error);
    return { success: false, error: "FETCH_FAILED" };
  }
}
