import HeroPage from "../component/HeroPage";
import Animes from "../component/Animes";

// Next.js automatically passes searchParams to page components
export default async function Home({ searchParams }) {
  // Await searchParams in Next.js 14/15
  const params = await searchParams;
  const searchQuery = params.search || "";

  const apiKey = "229a853ab6b9c8d03d48dbe3e9b5d19b";

  // Decide which API endpoint to hit based on search presence
  const url = searchQuery
    ? `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(searchQuery)}&language=en-US&api_key=${apiKey}`
    : `https://api.themoviedb.org/3/trending/movie/day?language=en-US&api_key=${apiKey}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch movie data");
  }

  const data = await res.json();
  const movies = data.results || [];

  // Extract the poster paths of the first 5 movies to feed into the Hero background
  const topFivePosters = movies
    .slice(0, 5)
    .map((movie) => movie.poster_path)
    .filter(Boolean); // Filters out any movies missing an image path

  return (
    <main className="bg-slate-950 min-h-screen">
      {/* Pass the dynamic top 5 images to the Hero background */}
      <HeroPage bgImages={topFivePosters} />

      {/* Pass the already-fetched movies down to the grid layout */}
      <Animes
        movies={movies}
        title={searchQuery ? `Results for "${searchQuery}"` : "Trending Movies"}
      />
    </main>
  );
}
