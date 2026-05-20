import Link from "next/link";
import { Star } from "lucide-react";

function Animes({ movies = [], title = "Trending Movies", loading = false }) {
  return (
    <div className="p-4 md:p-8 text-white min-h-[400px]">
      <h2 className="text-2xl font-bold mb-6 tracking-tight text-slate-100">
        {title}
      </h2>

      {/* Loading Skeleton Backdrop */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6 opacity-60">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-slate-900 border border-slate-800 rounded-xl aspect-[2/3] w-full"
              />
            ))}
        </div>
      ) : movies.length === 0 ? (
        <div className="p-8 text-center text-slate-400">
          <p className="text-lg">
            No movies found. Try searching for something else!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {movies.map((item) => {
            // Serialize movie details safely to pass through the URL query parameters
            const queryParams = new URLSearchParams({
              title: item.title || "",
              overview: item.overview || "",
              poster: item.poster_path || "",
              backdrop: item.backdrop_path || "",
              rating: item.vote_average ? item.vote_average.toFixed(1) : "0.0",
              date: item.release_date || "",
            }).toString();

            return (
              <Link
                key={item.id}
                href={`/movies/${item.id}?${queryParams}`}
                className="flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.02] hover:border-slate-700 group cursor-pointer"
              >
                {/* Aspect ratio wrapper / Image container */}
                <div className="relative aspect-[2/3] w-full bg-slate-800 overflow-hidden">
                  <img
                    src={
                      item.poster_path
                        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                        : "/fallback-poster.png"
                    }
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {item.vote_average > 0 && (
                    <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-slate-950/80 backdrop-blur-md border border-slate-800 px-2 py-1 rounded-lg">
                      <Star
                        className="text-amber-400 fill-amber-400"
                        size={14}
                      />
                      <span className="text-xs font-bold text-slate-100">
                        {item.vote_average.toFixed(1)}
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent flex flex-col justify-end p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out z-10">
                    <p className="text-slate-200 text-xs line-clamp-6 leading-relaxed mb-2">
                      {item.overview || "No description available."}
                    </p>
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-grow bg-gradient-to-b from-slate-900 to-slate-950 z-20">
                  <h3
                    className="font-bold text-sm text-slate-100 line-clamp-1"
                    title={item.title}
                  >
                    {item.title}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Animes;
