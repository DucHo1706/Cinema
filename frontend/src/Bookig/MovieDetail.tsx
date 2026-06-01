import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Nav from '../Header/nav';
import Bottom from '../Footer/bottom';

interface MovieVisualFormat {
    movieVisualFormatId: string;
    movieVisualFormatName: string;
}

interface MovieGenre {
    movieGenreId: string;
    movieGenreName: string;
}

interface MovieData {
    movieId: string;
    movieName: string;
    movieImage: string;
    movieDescription: string;
    movieMinimumAge: { [key: string]: string };
    movieDirector: string;
    movieActor: string;
    movieTrailerUrl: string;
    movieDuration: number;
    releaseDate: string;
    movieLanguage: { [key: string]: string };
    movieVisualFormat: MovieVisualFormat[];
    movieGenre: MovieGenre[];
}

interface ApiResponse {
    status: string;
    message: string;
    data: MovieData;
}

const MovieDetail: React.FC = () => {
    const { movieId } = useParams<{ movieId: string }>();
    const navigate = useNavigate();
    const [movie, setMovie] = useState<MovieData | null>(null);
    const [showTrailer, setShowTrailer] = useState(false);
    const [trailerUrl, setTrailerUrl] = useState('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            if (!movieId) {
                setError('Không tìm thấy movieId');
                setLoading(false);
                return;
            }

            const cacheKey = `movie_${movieId}`;
            const cachedData = localStorage.getItem(cacheKey);

            if (cachedData) {
                setMovie(JSON.parse(cachedData));
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `http://localhost:5229/api/movie/getMovieDetail/${movieId}`,
                    { headers: { accept: '*/*' } }
                );
                if (!response.ok) {
                    throw new Error('Lỗi khi lấy chi tiết phim');
                }
                const data: ApiResponse = await response.json();
                if (data.status === 'Success' && data.data) {
                    localStorage.setItem(cacheKey, JSON.stringify(data.data));
                    setMovie(data.data);
                } else {
                    setError('Không tìm thấy chi tiết phim');
                }
                setLoading(false);
            } catch (err: any) {
                setError(`Lỗi tải dữ liệu phim: ${err.message}`);
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [movieId]);

    const handleOpenTrailer = (url: string) => {
        const embedUrl = url.includes('watch?v=')
            ? url.replace('watch?v=', 'embed/')
            : url.includes('youtu.be/')
                ? `https://www.youtube.com/embed/${url.split('youtu.be/')[1].split('?')[0]}`
                : url;
        setTrailerUrl(embedUrl);
        setShowTrailer(true);
    };

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center bg-slate-950">
                <div className="flex-col gap-4 w-full flex items-center justify-center">
                    <div className="w-20 h-20 border-4 border-transparent text-purple-500 text-4xl animate-spin flex items-center justify-center border-t-purple-500 rounded-full">
                        <div className="w-16 h-16 border-4 border-transparent text-indigo-500 text-2xl animate-spin flex items-center justify-center border-t-indigo-500 rounded-full"></div>
                    </div>
                    <p className="text-slate-400 font-medium mt-4 tracking-wider animate-pulse">Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    if (error || !movie) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-red-400 text-center p-4 font-medium">{error || 'Không tìm thấy phim'}</div>;
    }

    return (
        <div className="relative min-h-screen w-full font-sans selection:bg-purple-500/30 text-slate-200">
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[url('https://images8.alphacoders.com/136/thumb-1920-1368754.jpeg')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/80 to-slate-950"></div>
            </div>
            <div className="relative z-10 flex flex-col min-h-screen">
                <div className="sticky top-0 z-50 bg-slate-950 shadow-md border-b border-slate-800/50">
                    <div className="max-w-screen-xl mx-auto px-4 sm:px-8">
                        <Nav />
                    </div>
                </div>
                <main className="flex-grow flex flex-col items-center">
                    <div className="pt-3 w-full max-w-screen-xl mx-auto px-4 sm:px-8 py-12">
                        <div className="p-6 md:p-8 text-white bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl mb-12">
                            <div className="flex flex-col md:flex-row gap-6 mb-6 justify-center items-start">
                                <div className="flex-shrink-0">
                                    <img
                                        src={movie.movieImage}
                                        alt={movie.movieName}
                                        className="w-full max-w-[400px] rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.3)] object-cover"
                                    />
                                </div>
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 mb-6 uppercase tracking-wider">{movie.movieName}</h1>
                                    <ul className="text-slate-300 mb-6 space-y-3">
                                        <li className="flex items-start">
                                            <span className="text-purple-400 font-bold w-32 shrink-0">Thể loại:</span>{' '}
                                            <span>{movie.movieGenre.map(genre => genre.movieGenreName).join(', ')}</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-purple-400 font-bold w-32 shrink-0">Thời lượng:</span>{' '}
                                            <span>{movie.movieDuration} phút</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-purple-400 font-bold w-32 shrink-0">Định dạng:</span>{' '}
                                            <span>{movie.movieVisualFormat.map(format => format.movieVisualFormatName).join(', ')}</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-purple-400 font-bold w-32 shrink-0">Ngôn ngữ:</span>{' '}
                                            <span>{Object.values(movie.movieLanguage)[0]}</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-purple-400 font-bold w-32 shrink-0">Độ tuổi:</span>{' '}
                                            <span className="inline-block px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-sm">{Object.values(movie.movieMinimumAge)[0]}</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-purple-400 font-bold w-32 shrink-0">Đạo diễn:</span>{' '}
                                            <span>{movie.movieDirector || 'Không có thông tin'}</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-purple-400 font-bold w-32 shrink-0">Diễn viên:</span>{' '}
                                            <span>{movie.movieActor || 'Không có thông tin'}</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-purple-400 font-bold w-32 shrink-0">Khởi chiếu:</span>{' '}
                                            <span>{new Date(movie.releaseDate).toLocaleDateString('vi-VN')}</span>
                                        </li>
                                    </ul>
                                    <p className="max-w-[600px] mb-8 text-slate-400 italic text-justify">"{movie.movieDescription}"</p>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleOpenTrailer(movie.movieTrailerUrl)}
                                            className="p-3 rounded-full backdrop-blur-lg border border-red-500/20 bg-gradient-to-tr from-black/60 to-black/40 shadow-lg hover:shadow-2xl hover:shadow-red-500/30 hover:scale-110 hover:rotate-2 active:scale-95 active:rotate-0 transition-all duration-300 ease-out cursor-pointer group relative overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                                            <div className="relative z-10">
                                                <svg
                                                    className="w-7 h-7 fill-current text-red-500 group-hover:text-red-400 transition-colors duration-300"
                                                    viewBox="0 0 576 512"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"
                                                    ></path>
                                                </svg>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row justify-center items-center py-10 mb-20">
                                <img
                                    alt="film-reel"
                                    className="filter opacity-60"
                                />
                                <p className="text-center text-3xl md:text-4xl font-bold text-slate-500 uppercase pl-4 tracking-widest">Hiện chưa có lịch chiếu</p>
                            </div>
                        </div>
                        {showTrailer && (
                            <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
                                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 sm:p-4 relative w-full max-w-5xl aspect-video shadow-2xl">
                                    <button
                                        onClick={() => setShowTrailer(false)}
                                        className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-10 h-10 sm:w-12 sm:h-12 bg-slate-800 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xl shadow-lg transition-colors duration-300 z-10"
                                    >
                                        ✕
                                    </button>
                                    <iframe src={trailerUrl} title="Trailer" className="w-full h-full rounded-xl" allowFullScreen />
                                </div>
                            </div>
                        )}
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="fixed bottom-6 right-6 z-50 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full shadow-lg transition-all border border-slate-700 cursor-pointer"
                        >
                            ↑
                        </button>
                    </div>
                </main>
                <footer>
                    <Bottom />
                </footer>
            </div>
        </div>
    );
};

export default MovieDetail;