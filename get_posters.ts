import { searchMovie } from "./app/lib/tmdb";
import fs from "fs";

async function run() {
  const titles = [
    "Dune: Part Two", "Stalker", "The Substance",
    "Annihilation", "Past Lives", "Hereditary",
    "Blade Runner 2049", "The Brutalist"
  ];
  let results = {};
  for (const t of titles) {
    const res = await searchMovie(t); // assuming searchMovie exists
    results[t] = res.results[0] ? res.results[0].poster_path : null;
  }
  console.log(results);
}
run();
