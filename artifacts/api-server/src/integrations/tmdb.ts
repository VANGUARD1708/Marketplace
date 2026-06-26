const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p";

function headers() {
  return { Authorization: `Bearer ${TMDB_API_KEY}`, "Content-Type": "application/json" };
}

export interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  posterPath?: string;
  backdropPath?: string;
  releaseDate: string;
  voteAverage: number;
}

async function tmdbGet<T>(path: string): Promise<T | null> {
  if (!TMDB_API_KEY) return null;
  const res = await fetch(`${BASE_URL}${path}`, { headers: headers() });
  if (!res.ok) return null;
  return res.json() as Promise<T>;
}

export async function searchMovies(query: string, page = 1): Promise<TmdbMovie[]> {
  const data = await tmdbGet<{ results: { id: number; title: string; overview: string; poster_path: string; backdrop_path: string; release_date: string; vote_average: number }[] }>(
    `/search/movie?query=${encodeURIComponent(query)}&page=${page}`
  );
  if (!data) return [];
  return data.results.map((m) => ({
    id: m.id,
    title: m.title,
    overview: m.overview,
    posterPath: m.poster_path ? `${IMAGE_BASE}/w342${m.poster_path}` : undefined,
    backdropPath: m.backdrop_path ? `${IMAGE_BASE}/w780${m.backdrop_path}` : undefined,
    releaseDate: m.release_date,
    voteAverage: m.vote_average,
  }));
}

export async function getTrendingMovies(): Promise<TmdbMovie[]> {
  const data = await tmdbGet<{ results: { id: number; title: string; overview: string; poster_path: string; backdrop_path: string; release_date: string; vote_average: number }[] }>(
    "/trending/movie/week"
  );
  if (!data) return [];
  return data.results.slice(0, 10).map((m) => ({
    id: m.id,
    title: m.title,
    overview: m.overview,
    posterPath: m.poster_path ? `${IMAGE_BASE}/w342${m.poster_path}` : undefined,
    backdropPath: m.backdrop_path ? `${IMAGE_BASE}/w780${m.backdrop_path}` : undefined,
    releaseDate: m.release_date,
    voteAverage: m.vote_average,
  }));
}

export function getPosterUrl(path: string, size: "w92" | "w185" | "w342" | "w500" | "original" = "w342"): string {
  return `${IMAGE_BASE}/${size}${path}`;
}
