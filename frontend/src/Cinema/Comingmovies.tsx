import React, { useState, useEffect } from "react";
import Nav from "../Header/nav";
import Bottom from "../Footer/bottom";
import { useNavigate } from "react-router";

interface Movie {
    movieId: string;
    movieName: string;
    movieImage: string;
    trailerURL: string;
}

function Comingmovies() {
    const navigate = useNavigate();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [showTrailer, setShowTrailer] = useState(false);
    const [trailerUrl, setTrailerUrl] = useState("");

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch("http://localhost:5229/api/movie/GetUnShowedMovie");
                const result = await response.json();
                if (result.status === "Success") {
                    setMovies(result.data);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách phim:", error);
            }
        };
        fetchMovies();
    }, []);

    const handleMoviedetail = (movieId: string) => {
        navigate(`/moviedetail/${movieId}`);
    };

    const handleOpenTrailer = (url: string) => {
        let embedUrl = url;

        if (url.includes("watch?v=")) {
            embedUrl = url.replace("watch?v=", "embed/");
        } else if (url.includes("youtu.be/")) {
            const videoId = url.split("youtu.be/")[1].split("?")[0];
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
        }

        setTrailerUrl(embedUrl);
        setShowTrailer(true);
    };

    return (
        <div className="relative min-h-screen w-full bg-slate-950 font-sans selection:bg-purple-500/30">
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[url('https://images8.alphacoders.com/136/thumb-1920-1368754.jpeg')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/80 to-slate-950"></div>
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <div className="sticky top-0 z-50 bg-slate-950 shadow-md border-b border-slate-800/50">
                    <header>
                        <div className="max-w-screen-xl mx-auto px-4 sm:px-8">
                            <Nav />
                        </div>
                    </header>
                </div>

                <main className="flex-grow max-w-screen-xl w-full mx-auto px-4 sm:px-8 py-12">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600 font-extrabold uppercase tracking-wider relative inline-block mx-auto">
                            Phim Sắp Chiếu
                            <span className="absolute -bottom-2 left-1/4 w-1/2 h-1 bg-gradient-to-r from-sky-400 to-transparent rounded-full"></span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {movies.map((movie) => (
                            <div
                                key={movie.movieId}
                                className="relative group bg-slate-900/80 rounded-2xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(56,189,248,0.4)] border border-slate-800 cursor-pointer h-[380px]"
                                onClick={() => handleMoviedetail(movie.movieId)}
                            >
                                <img
                                    src={movie.movieImage}
                                    alt={movie.movieName}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent flex flex-col justify-end p-5">
                                    <h3 className="text-slate-100 text-xl font-bold line-clamp-2 mb-4 group-hover:text-sky-400 transition-colors duration-300 drop-shadow-md">
                                        {movie.movieName}
                                    </h3>
                                    <div className="translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleMoviedetail(movie.movieId); }}
                                            className="w-full py-2.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white rounded-xl font-bold tracking-wide shadow-lg transition-all"
                                        >
                                            ℹ️ Tìm hiểu thêm
                                        </button>
                                    </div>
                                </div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100 z-10">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleOpenTrailer(movie.trailerURL); }}
                                        className="p-4 bg-red-600/90 rounded-full text-white hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.6)] transition-all transform hover:scale-110"
                                    >
                                        <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 576 512">
                                            <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>

                {/* Trailer Popup */}
                {showTrailer && (
                    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 p-4">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 sm:p-4 relative w-full max-w-5xl aspect-video shadow-2xl">
                            <button
                                onClick={() => setShowTrailer(false)}
                                className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-10 h-10 sm:w-12 sm:h-12 bg-slate-800 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xl shadow-lg transition-colors duration-300 z-10"
                            >
                                ✕
                            </button>
                            <iframe
                                src={trailerUrl}
                                title="Trailer"
                                className="w-full h-full rounded-xl"
                                allowFullScreen
                            />
                        </div>
                    </div>
                )}
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="fixed bottom-6 right-6 z-50 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full shadow-lg transition-all border border-slate-700 cursor-pointer">
                    ↑
                </button>
                <footer>
                    <Bottom />
                </footer>
            </div>
        </div>
    );
}

export default Comingmovies;