"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Popcorn, Search } from "lucide-react";
import Image from "next/image";

const HeroPage = ({ bgImages = [] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Initialize local state with whatever is currently in the URL bar
  const currentSearch = searchParams.get("search") || "";
  const [text, setText] = useState(currentSearch);

  // Sync state if the URL changes externally (e.g., clearing search)
  useEffect(() => {
    setText(currentSearch);
  }, [currentSearch]);

  // 2. Helper function to push the new search string to the browser URL
  const handleSearchSubmit = (queryValue) => {
    const params = new URLSearchParams(searchParams.toString());
    if (queryValue.trim()) {
      params.set("search", queryValue);
    } else {
      params.delete("search");
    }
    // Pushes the update instantly to the server component
    router.push(`/?${params.toString()}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearchSubmit(text);
  };

  // 3. Real-time typing adjustment
  const handleInputChange = (e) => {
    const value = e.target.value;
    setText(value);

    // Optional: If you want real-time typing results without hitting enter,
    // uncomment the line below. Otherwise, it updates strictly on 'Enter' or button click.
    // handleSearchSubmit(value);
  };

  return (
    <div className="relative h-[70vh] w-full bg-slate-950 overflow-hidden">
      {/* Foreground Layer: Centered Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-4">
        <div className="flex flex-col items-center gap-6 max-w-2xl w-full">
          {/* Logo Icon */}
          <div className="bg-red-600 p-4 rounded-2xl shadow-2xl transform hover:scale-110 transition-transform cursor-pointer">
            <Popcorn color="white" size={48} />
          </div>

          {/* Text Content */}
          <div className="text-center space-y-2">
            <h1 className="text-slate-50 text-6xl font-black tracking-tighter">
              CBox
            </h1>
            <p className="text-slate-300 text-xl md:text-2xl font-light leading-relaxed">
              Discover the most popular{" "}
              <span className="text-white font-medium">Movies</span> trending
              right now
            </p>
          </div>

          {/* Search Input Bar */}
          <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-md group mt-2"
          >
            <button
              type="submit"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-20 hover:text-red-500 transition-colors"
              title="Search"
            >
              <Search size={20} />
            </button>
            <input
              type="text"
              value={text}
              onChange={handleInputChange}
              placeholder="Type to search movies..."
              className="w-full bg-slate-900/40 border border-slate-800 text-slate-100 pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-slate-500/50 focus:border-slate-500 focus:bg-slate-950/80 transition-all backdrop-blur-md placeholder:text-slate-500 shadow-xl"
            />
          </form>
        </div>
      </div>

      {/* Background Layer: Movie Posters from API */}
      <div className="grid grid-cols-2 md:grid-cols-5 opacity-55 absolute inset-0 transition-all duration-1000">
        {Array(5)
          .fill(0)
          .map((_, index) => {
            const posterPath = bgImages[index];
            const imageSrc = posterPath
              ? `https://image.tmdb.org/t/p/w500${posterPath}`
              : `/movie-img/movie-${index + 1}.webp`;

            return (
              <div
                key={index}
                className="relative h-full w-full border-r border-slate-900/10 overflow-hidden"
              >
                <Image
                  src={imageSrc}
                  alt="Movie background"
                  fill
                  className="object-cover object-center transition-all duration-700 ease-in-out"
                  sizes="(max-w-768px) 50vw, 20vw"
                  priority={index < 2}
                  unoptimized={imageSrc.startsWith("http")}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950" />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default HeroPage;
