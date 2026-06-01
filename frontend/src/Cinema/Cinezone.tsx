import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Nav from "../Header/nav";
import Footer from "../Footer/bottom";
import filmszone from "../image/filmszone.jpg";

interface Movie {
    movieID: string;
    title: string;
    image: string;
    trailer: string;
}

interface Cinema {
    cinemaId: string;
    cinemaName: string;
    cinemaLocation: string;
}

interface ApiResponse {
    status: string;
    message: string;
    data: {
        movieId: string;
        movieName: string;
        movieImage: string;
        trailerURL: string;
    }[];
}

function Cinezone() {
    const { cinemaId } = useParams<{ cinemaId: string }>();
    const navigate = useNavigate();
    const [cinemas, setCinemas] = useState<Cinema[]>([]);
    const [selectedCinemaId, setSelectedCinemaId] = useState<string | null>(null);
    const [inShowMovies, setInShowMovies] = useState<Movie[]>([]);
    const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
    const [activeTab, setActiveTab] = useState<"tab1" | "tab2">("tab1");
    const [showTrailer, setShowTrailer] = useState(false);
    const [trailerUrl, setTrailerUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch cinema list
    useEffect(() => {
        setLoading(true);
        fetch("http://localhost:5229/api/Cinema/getCinemaList")
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                if (data.status === "Success" && Array.isArray(data.data)) {
                    const formattedCinemas = data.data.map((item: any) => ({
                        cinemaId: item.cinemaId || item.cinemaID || "",
                        cinemaName: item.cinemaName || "",
                        cinemaLocation: item.cinemaLocation || "",
                    }));
                    setCinemas(formattedCinemas);
                    const validCinema = formattedCinemas.find((c: Cinema) => c.cinemaId === cinemaId);
                    setSelectedCinemaId(validCinema ? cinemaId : formattedCinemas[0]?.cinemaId || null);
                    if (cinemaId && !validCinema) setError("Rạp không tồn tại. Vui lòng chọn rạp khác.");
                } else {
                    setError("Không tìm thấy danh sách rạp.");
                }
            })
            .catch((err) => setError(`Lỗi tải danh sách rạp: ${err.message}`))
            .finally(() => setLoading(false));
    }, [cinemaId]);

    // Fetch in-show movies
    useEffect(() => {
        const fetchInShowMovies = async () => {
            setLoading(true);
            try {
                const response = await fetch("http://localhost:5229/api/movie/GetInShowedMovie");
                if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
                const result: ApiResponse = await response.json();
                if (result.status === "Success") {
                    const formattedMovies = result.data.map((item) => ({
                        movieID: item.movieId,
                        title: item.movieName,
                        image: item.movieImage,
                        trailer: item.trailerURL,
                    }));
                    setInShowMovies(formattedMovies);
                } else {
                    setError("Không tìm thấy danh sách phim đang chiếu.");
                }
            } catch (err: any) {
                setError(`Lỗi tải danh sách phim đang chiếu: ${err.message}`);
                setInShowMovies([]);
            } finally {
                setLoading(false);
            }
        };
        fetchInShowMovies();
    }, []);

    // Fetch upcoming movies
    useEffect(() => {
        const fetchUpcomingMovies = async () => {
            setLoading(true);
            try {
                const response = await fetch("http://localhost:5229/api/movie/GetUnShowedMovie");
                if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
                const result: ApiResponse = await response.json();
                if (result.status === "Success") {
                    const formattedMovies = result.data.map((item) => ({
                        movieID: item.movieId,
                        title: item.movieName,
                        image: item.movieImage,
                        trailer: item.trailerURL,
                    }));
                    setUpcomingMovies(formattedMovies);
                } else {
                    setError("Không tìm thấy danh sách phim sắp chiếu.");
                }
            } catch (err: any) {
                setError(`Lỗi tải danh sách phim sắp chiếu: ${err.message}`);
                setUpcomingMovies([]);
            } finally {
                setLoading(false);
            }
        };
        fetchUpcomingMovies();
    }, []);

    const handleOpenTrailer = (url: string) => {
        const embedUrl = url.includes("watch?v=")
            ? url.replace("watch?v=", "embed/")
            : url.includes("youtu.be/")
                ? `https://www.youtube.com/embed/${url.split("youtu.be/")[1].split("?")[0]}`
                : url;
        setTrailerUrl(embedUrl);
        setShowTrailer(true);
    };

    const handleShowtimes = (movieId: string) => {
        localStorage.setItem('movieId', movieId);
        navigate("/movies");
    };

    const renderMovie = (movie: Movie) => (
        <div key={movie.movieID}
            className={`relative group bg-slate-900/80 rounded-2xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(${activeTab === "tab1" ? '168,85,247' : '56,189,248'},0.4)] border border-slate-800 cursor-pointer h-[350px] sm:h-[420px]`}
            onClick={() => activeTab === "tab1" ? handleShowtimes(movie.movieID) : navigate(`/moviedetail/${movie.movieID}`)}>
            <img
                src={movie.image}
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent flex flex-col justify-end p-5">
                <h3 className={`text-slate-100 text-lg sm:text-xl font-bold line-clamp-2 mb-4 group-hover:text-${activeTab === "tab1" ? 'purple' : 'sky'}-400 transition-colors duration-300 drop-shadow-md`}>{movie.title}</h3>
                <div className="translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                        onClick={(e) => { e.stopPropagation(); activeTab === "tab1" ? handleShowtimes(movie.movieID) : navigate(`/moviedetail/${movie.movieID}`); }}
                        className={`w-full py-2.5 bg-gradient-to-r ${activeTab === "tab1" ? "from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500" : "from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500"} text-white rounded-xl font-bold tracking-wide shadow-lg transition-all`}
                    >
                        {activeTab === "tab1" ? "🎟 Đặt vé ngay" : "ℹ️ Tìm hiểu thêm"}
                    </button>
                </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100 z-10">
                <button
                    onClick={(e) => { e.stopPropagation(); handleOpenTrailer(movie.trailer); }}
                    className="p-4 bg-red-600/90 rounded-full text-white hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.6)] transition-all transform hover:scale-110"
                >
                    <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 576 512"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" /></svg>
                </button>
            </div>
        </div>
    );

    if (loading) return <div className="text-white text-center p-4">Đang tải...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
    if (cinemas.length === 0) return <div className="text-white text-center p-4">Không tìm thấy rạp.</div>;

    return (
        <div className="relative min-h-screen w-full font-sans selection:bg-purple-500/30 text-slate-200">
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[url('https://images8.alphacoders.com/136/thumb-1920-1368754.jpeg')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/80 to-slate-950"></div>
            </div>
            <div className="relative z-10 flex flex-col min-h-screen">
                <div className="top-0 z-50 bg-slate-950 shadow-md sticky border-b border-slate-800/50">
                    <div className="max-w-screen-xl text-base mx-auto px-4 sm:px-8">
                        <Nav />
                    </div>
                </div>
                <main className="flex-grow flex flex-col items-center pt-8">
                    <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-8">
                        {/* Selected Cinema Info */}
                        {selectedCinemaId && (
                            <div className="relative h-48 md:h-64 w-full bg-cover bg-center rounded-3xl overflow-hidden mb-8 shadow-2xl border border-slate-800" style={{ backgroundImage: `url(${filmszone})` }}>
                                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent"></div>
                                <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12 text-white">
                                    <div className="p-4">
                                        <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 mb-2 uppercase tracking-wider">{cinemas.find((c: Cinema) => c.cinemaId === selectedCinemaId)?.cinemaName}</h1>
                                        <p className="text-slate-300 flex items-center gap-2 font-medium">
                                            <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                            {cinemas.find((c: Cinema) => c.cinemaId === selectedCinemaId)?.cinemaLocation}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Tab Header */}
                        <div className="flex justify-center items-center mb-8 gap-4 sm:gap-8 bg-slate-900/60 p-2 rounded-2xl border border-slate-800 w-fit mx-auto backdrop-blur-sm shadow-lg">
                            <button
                                onClick={() => setActiveTab("tab1")}
                                className={`font-bold text-sm sm:text-lg px-6 sm:px-10 py-3 rounded-xl transition-all duration-300 ${activeTab === "tab1" ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
                            >
                                Phim đang chiếu
                            </button>
                            <button
                                onClick={() => setActiveTab("tab2")}
                                className={`font-bold text-sm sm:text-lg px-6 sm:px-10 py-3 rounded-xl transition-all duration-300 ${activeTab === "tab2" ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
                            >
                                Phim sắp chiếu
                            </button>
                        </div>
                        {/* Tab Content */}
                        <div className="text-white w-full py-8">
                            {activeTab === "tab1" && (
                                <div>
                                    {loading ? (
                                        <p className="text-center text-slate-400">Đang tải...</p>
                                    ) : error ? (
                                        <p className="text-center text-red-400">{error}</p>
                                    ) : inShowMovies.length === 0 ? (
                                        <p className="text-center text-slate-400 font-medium">Không có phim nào đang chiếu tại rạp này</p>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">{inShowMovies.map(renderMovie)}</div>
                                    )}
                                </div>
                            )}
                            {activeTab === "tab2" && (
                                <div>
                                    {loading ? (
                                        <p className="text-center text-slate-400">Đang tải...</p>
                                    ) : error ? (
                                        <p className="text-center text-red-400">{error}</p>
                                    ) : upcomingMovies.length === 0 ? (
                                        <p className="text-center text-slate-400 font-medium">Không có phim nào sắp chiếu tại rạp này</p>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">{upcomingMovies.map(renderMovie)}</div>
                                    )}
                                </div>
                            )}
                            {/* Trailer Popup */}
                            {showTrailer && (
                                <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
                                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 sm:p-4 relative w-full max-w-5xl aspect-video shadow-2xl">
                                        <button onClick={() => setShowTrailer(false)} className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-10 h-10 sm:w-12 sm:h-12 bg-slate-800 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xl shadow-lg transition-colors duration-300 z-10">
                                            ✕
                                        </button>
                                        <iframe src={trailerUrl} title="Trailer" className="w-full h-full rounded-xl" allowFullScreen />
                                    </div>
                                </div>
                            )}
                            <button
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                className="fixed bottom-6 right-6 z-50 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full shadow-lg transition-all border border-slate-700 cursor-pointer"
                            >
                                ↑
                            </button>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
}

export default Cinezone;