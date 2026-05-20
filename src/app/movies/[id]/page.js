import Link from "next/link";
import { ArrowLeft, Calendar, Star, Clock } from "lucide-react";

async function getMovie(id) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=229a853ab6b9c8d03d48dbe3e9b5d19b`,
    {
      next: { revalidate: 3600 },
    },
  );

  if (!res.ok) {
    console.log("STATUS:", res.status);

    const errorText = await res.text();
    console.log(errorText);

    throw new Error("Failed to fetch movie");
  }

  return res.json();
}

export default async function MovieDetailsPage({ params }) {
  const { id } = await params;

  const movie = await getMovie(id);

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/fallback-poster.png";

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : posterUrl;

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* BACKDROP */}
      <div className="absolute inset-0">
        <img
          src={backdropUrl}
          alt={movie.title}
          className="w-full h-full object-cover opacity-20 blur-sm scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/30" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md px-4 py-2 rounded-xl transition mb-10"
        >
          <ArrowLeft size={16} />
          Back
        </Link>

        <div className="grid lg:grid-cols-[350px_1fr] gap-10 items-center">
          {/* POSTER */}
          <div className="overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* DETAILS */}
          <div>
            <h1 className="text-5xl md:text-6xl font-black mb-5">
              {movie.title}
            </h1>

            {/* META */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-xl">
                <Star size={16} className="fill-yellow-400 text-yellow-400" />

                <span className="font-semibold text-yellow-300">
                  {movie.vote_average?.toFixed(1)}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                <Calendar size={16} />

                <span>{new Date(movie.release_date).getFullYear()}</span>
              </div>

              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                <Clock size={16} />

                <span>{movie.runtime} mins</span>
              </div>
            </div>

            {/* GENRES */}
            <div className="flex flex-wrap gap-3 mb-8">
              {movie.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-2 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* OVERVIEW */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8">
              <h2 className="text-xl font-bold mb-4">Overview</h2>

              <p className="text-slate-300 leading-relaxed text-lg">
                {movie.overview}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
