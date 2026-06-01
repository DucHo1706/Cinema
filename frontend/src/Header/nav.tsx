import React, { useState, useEffect, useMemo, useRef } from 'react';
import { TicketIcon, MapPinIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import user from "../image/user.png";
import logo from '../image/logocinema1.png';
import { useNavigate, useLocation } from 'react-router-dom';

// Định nghĩa interface cho rạp chiếu phim
interface Cinema {
    cinemaId: string;
    cinemaName: string;
    cinemaLocation: string;
}

// Định nghĩa interface cho phim dựa trên phản hồi API
interface Movie {
    movieID: string;
    movieName: string;
    movieImage: string;
    movieTrailerUrl: string;
    movieDuration: number;
    isRelease: boolean;
    releaseDate: string;
    listLanguageName: string;
    movieVisualFormat: string[];
    movieGenres: string[];
}

function Nav() {
    const userEmail = localStorage.getItem('userEmail');
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Thêm trạng thái để kiểm soát dropdown
    const [cinemas, setCinemas] = useState<Cinema[]>([]);
    const [allMovies, setAllMovies] = useState<Movie[]>([]);
    const [searchResults, setSearchResults] = useState<Movie[]>([]);
    const [filteredCinemas, setFilteredCinemas] = useState<Cinema[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation(); // Hook để lấy thông tin về URL hiện tại
    const searchRef = useRef<HTMLDivElement>(null); // Ref cho vùng tìm kiếm và dropdown

    // Lấy danh sách rạp từ API
    useEffect(() => {
        fetch('http://localhost:5229/api/Cinema/getCinemaList')
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'Success') {
                    setCinemas(data.data);
                }
            })
            .catch((error) => console.error('Lỗi khi lấy danh sách rạp:', error));
    }, []);

    // Cache kết quả tìm kiếm
    const cache = useMemo(() => new Map<string, Movie[]>(), []);

    // Hàm gọi API lấy tất cả phim khi click vào input tìm kiếm
    const fetchAllMovies = () => {
        setIsLoading(true);
        setError(null);

        const cachedResults = cache.get('allMovies');
        if (cachedResults) {
            setAllMovies(cachedResults);
            setSearchResults(cachedResults);
            setFilteredCinemas(cinemas);
            setIsLoading(false);
            return;
        }

        let retries = 0;
        const maxRetries = 3;
        const retryDelay = 2000;

        const fetchData = () => {
            const url = 'http://localhost:5229/api/movie/getAllMoviesPagniation/1';
            console.log('URL yêu cầu:', url);

            fetch(url, {
                method: 'GET',
                headers: {
                    'accept': '*/*'
                }
            })
                .then((response) => {
                    console.log('Trạng thái HTTP:', response.status);
                    if (!response.ok) {
                        throw new Error(`Lỗi HTTP: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log('Dữ liệu API:', data);
                    if (data.movieRespondDTOs && Array.isArray(data.movieRespondDTOs)) {
                        const results = data.movieRespondDTOs;
                        cache.set('allMovies', results);
                        setAllMovies(results);
                        setSearchResults(results);
                        setFilteredCinemas(cinemas);
                    } else {
                        setAllMovies([]);
                        setSearchResults([]);
                        setFilteredCinemas([]);
                        setError('Không tìm thấy phim hoặc rạp.');
                    }
                })
                .catch((error) => {
                    console.error('Lỗi khi gọi API:', error.message);
                    if (retries < maxRetries) {
                        retries++;
                        console.log(`Thử lại lần ${retries}/${maxRetries} sau ${retryDelay}ms...`);
                        setTimeout(fetchData, retryDelay);
                    } else {
                        setError('Không thể kết nối đến server. Sử dụng dữ liệu mẫu.');
                        setFilteredCinemas(cinemas);
                    }
                })
                .finally(() => setIsLoading(false));
        };

        fetchData();
    };

    // Lọc phim và rạp khi searchTerm thay đổi
    useEffect(() => {
        if (!allMovies.length && !cinemas.length) {
            setSearchResults([]);
            setFilteredCinemas([]);
            return;
        }

        if (!searchTerm.trim()) {
            setSearchResults(allMovies);
            setFilteredCinemas(cinemas);
            return;
        }

        const filteredMovies = allMovies.filter((movie) =>
            movie.movieName.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const filtered = cinemas.filter(
            (cinema) =>
                cinema.cinemaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cinema.cinemaLocation.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setSearchResults(filteredMovies);
        setFilteredCinemas(filtered);
    }, [searchTerm, allMovies, cinemas]);

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false); // Đóng dropdown
                setSearchResults([]);
                setFilteredCinemas([]);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInfo = () => {
        const roleName = localStorage.getItem('role') || '';
        const roles: string[] = roleName ? roleName.split(',') : [];

        if (roles.includes('Cashier') || roles.includes('TheaterManager') || roles.includes('Director') || roles.includes('MovieManager') || roles.includes('FacilitiesManager')) {
            navigate('/HomeAdmin');
        } else if (roles.includes('Customer')) {
            navigate('/info');
        }
    };

    const handleBooking = () => {
        navigate('/booking');
    };

    const handleMovieClick = (movieID: string) => {
        // Lưu movieID vào localStorage
        localStorage.setItem('movieId', movieID);

        // Đóng dropdown và xóa kết quả tìm kiếm
        setSearchTerm('');
        setSearchResults([]);
        setFilteredCinemas([]);
        setIsDropdownOpen(false);

        // Kiểm tra xem người dùng có đang ở trang /movies hay không
        if (location.pathname === '/movies') {
            // Nếu đang ở trang /movies, reload lại trang
            window.location.reload();
        } else {
            // Nếu không, chuyển hướng đến trang /movies
            navigate('/movies');
        }
    };

    return (
        <nav className="shadow-md text-white relative z-50">
            <div className="flex items-center justify-between px-4 py-2">
                <div className="flex justify-start items-start">
                    <button onClick={() => navigate("/")} className="flex items-center space-x-2">
                        <img src={logo} alt="logo" className="h-12 md:h-14 hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]" />
                    </button>

                    <div className="md:hidden flex items-center space-x-3">
                        <button onClick={() => setIsOpen(!isOpen)} className="border border-slate-700 rounded-full px-4 py-1.5 text-purple-400 font-bold bg-slate-800/50 flex items-center gap-2 shadow-inner">
                            Chọn Rạp <span className="rotate-90">▼</span>
                        </button>
                        <button onClick={() => setIsMenuOpen(true)} className="p-2 bg-slate-800 rounded-full border border-slate-700">
                            <Bars3Icon className="w-6 h-6 text-slate-300" />
                        </button>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-6">
                    <div className="flex justify-center items-center">
                        <button
                            onClick={handleBooking}
                            className="relative inline-flex items-center justify-center px-5 py-2 overflow-hidden text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg font-bold tracking-wide shadow-md hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transform hover:-translate-y-0.5 transition-all duration-300 group border border-purple-500/30"
                        >
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            <span className="relative flex items-center gap-2 uppercase text-sm">
                                <TicketIcon className="w-5 h-5" />
                                Đặt vé ngay
                            </span>
                        </button>
                    </div>
                </div>
                <div className="flex justify-center flex-row items-center gap-4">
                    <div className="relative hidden md:block" ref={searchRef}>
                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className="flex items-center bg-slate-900/60 text-slate-300 border border-slate-700/80 rounded-full px-4 py-1.5 w-[280px] focus-within:border-purple-500 focus-within:bg-slate-800 focus-within:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all duration-300 shadow-inner"
                        >
                            <input
                                type="text"
                                placeholder="Tìm phim, rạp"
                                className="w-full bg-transparent outline-none text-sm placeholder-slate-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={() => {
                                    fetchAllMovies(); // Gọi API lấy tất cả phim
                                    setIsDropdownOpen(true); // Hiển thị dropdown khi nhấp vào input
                                }}
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="ml-2"
                            >
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </form>
                        {isLoading && isDropdownOpen && (
                            <div className="absolute top-full mt-3 bg-slate-900 border border-slate-800 text-slate-400 rounded-xl shadow-2xl w-[300px] z-50 p-4 text-center text-sm flex items-center justify-center gap-3">
                                <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                Đang tìm kiếm...
                            </div>
                        )}
                        {(searchResults.length > 0 || filteredCinemas.length > 0) && !isLoading && !error && isDropdownOpen && (
                            <div className="absolute top-full mt-3 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-[300px] z-50 max-h-80 overflow-y-auto overflow-hidden hide-scrollbar">
                                {searchResults.length > 0 && (
                                    <div className="mb-2">
                                        <div className="px-4 py-2 font-bold bg-slate-800/80 text-purple-400 text-xs tracking-wider uppercase sticky top-0 z-10 backdrop-blur-sm">Phim</div>
                                        {searchResults.map((movie) => (
                                            <div
                                                key={movie.movieID}
                                                className="px-4 py-3 hover:bg-slate-800 cursor-pointer transition-colors border-b border-slate-800/50 last:border-none flex items-center gap-3 group"
                                                onClick={() => handleMovieClick(movie.movieID)} // Gọi hàm handleMovieClick
                                            >
                                                {movie.movieImage && <img src={movie.movieImage} alt="" className="w-10 h-14 object-cover rounded shadow-sm group-hover:scale-105 transition-transform" />}
                                                <div className="text-sm font-semibold text-slate-200 group-hover:text-purple-300 transition-colors line-clamp-2">{movie.movieName}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {filteredCinemas.length > 0 && (
                                    <div>
                                        <div className="px-4 py-2 font-bold bg-slate-800/80 text-sky-400 text-xs tracking-wider uppercase sticky top-0 z-10 backdrop-blur-sm">Rạp</div>
                                        {filteredCinemas.map((cinema) => (
                                            <div
                                                key={cinema.cinemaId}
                                                className="px-4 py-3 hover:bg-slate-800 cursor-pointer transition-colors border-b border-slate-800/50 last:border-none group"
                                                onClick={() => {
                                                    setSearchTerm('');
                                                    setSearchResults([]);
                                                    setFilteredCinemas([]);
                                                    setIsDropdownOpen(false);
                                                    navigate(`/cinezone/${cinema.cinemaId}`);
                                                }}
                                            >
                                                <div className="text-sm font-semibold text-slate-200 group-hover:text-sky-300 transition-colors">{cinema.cinemaName}</div>
                                                <div className="text-xs text-slate-400 mt-1 line-clamp-1">{cinema.cinemaLocation}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        {error && !isLoading && isDropdownOpen && (
                            <div className="absolute top-full mt-3 bg-slate-900 border border-slate-800 text-red-400 rounded-xl shadow-2xl w-[300px] z-50 p-4 text-center text-sm">
                                {error}
                            </div>
                        )}
                    </div>
                    {userEmail ? (
                        <div className="flex items-center gap-3 cursor-pointer group px-2 sm:px-3 py-1.5 rounded-full hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700" onClick={handleInfo}>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg">
                                <img src={user} alt="user" className="w-4 h-4 filter invert" />
                            </div>
                            <span className="text-slate-200 text-sm font-semibold group-hover:text-purple-400 transition-colors hidden sm:block">
                                {userEmail.split('@')[0]}
                            </span>
                        </div>
                    ) : (
                        <button onClick={() => navigate('/login')} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-full transition-all duration-300 border border-slate-700 hover:border-purple-500 shadow-sm">
                            <img src={user} alt="account" className="w-4 h-4 filter invert opacity-80" />
                            <span className="text-sm font-semibold hidden sm:inline">Đăng nhập</span>
                        </button>
                    )}
                </div>
            </div>

            {isMenuOpen && (
                <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl text-white p-6 z-50 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <img src={logo} alt="logo" className="h-14" />
                        <div className="flex items-center space-x-3">
                            <button onClick={() => setIsMenuOpen(false)} className="text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-full p-2 transition-colors">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto hide-scrollbar pb-20">
                        <div className="relative mb-8 mt-4">
                            <form onSubmit={(e) => { e.preventDefault(); fetchAllMovies(); setIsDropdownOpen(true); }} className="flex items-center bg-slate-900 text-slate-300 border border-slate-800 rounded-xl px-4 py-3 focus-within:border-purple-500 transition-colors">
                                <input type="text" placeholder="Tìm phim, rạp" className="w-full bg-transparent outline-none text-base placeholder-slate-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 text-slate-500"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </form>

                            {/* Search results in mobile */}
                            {(searchResults.length > 0 || filteredCinemas.length > 0) && searchTerm && (
                                <div className="mt-4 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                                    {searchResults.length > 0 && (
                                        <div>
                                            <div className="px-4 py-2 font-bold bg-slate-800/80 text-purple-400 text-xs tracking-wider uppercase">Phim</div>
                                            {searchResults.slice(0, 5).map((movie) => (
                                                <div key={movie.movieID} className="px-4 py-3 border-b border-slate-800/50 last:border-none flex items-center gap-3" onClick={() => { handleMovieClick(movie.movieID); setIsMenuOpen(false); }}>
                                                    {movie.movieImage && <img src={movie.movieImage} alt="" className="w-10 h-14 object-cover rounded shadow-sm" />}
                                                    <div className="text-sm font-semibold text-slate-200 line-clamp-2">{movie.movieName}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {filteredCinemas.length > 0 && (
                                        <div>
                                            <div className="px-4 py-2 font-bold bg-slate-800/80 text-sky-400 text-xs tracking-wider uppercase">Rạp</div>
                                            {filteredCinemas.map((cinema) => (
                                                <div key={cinema.cinemaId} className="px-4 py-3 border-b border-slate-800/50 last:border-none" onClick={() => { navigate(`/cinezone/${cinema.cinemaId}`); setIsMenuOpen(false); }}>
                                                    <div className="text-sm font-semibold text-slate-200">{cinema.cinemaName}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <ul className="space-y-2 text-lg font-semibold">
                            <li className="text-slate-400 text-sm uppercase tracking-wider mb-4 px-2">Menu chính</li>
                            <li className="text-purple-400 bg-purple-500/10 rounded-xl p-4 cursor-pointer flex items-center gap-3" onClick={() => { navigate('/'); setIsMenuOpen(false); }}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                                TRANG CHỦ
                            </li>
                            <li className="text-slate-200 hover:bg-slate-800 rounded-xl p-4 cursor-pointer flex items-center gap-3 transition-colors" onClick={() => { navigate('/booking'); setIsMenuOpen(false); }}>
                                <TicketIcon className="w-6 h-6 text-slate-400" />
                                ĐẶT VÉ
                            </li>
                            <li className="text-slate-200 hover:bg-slate-800 rounded-xl p-4 cursor-pointer flex items-center gap-3 transition-colors" onClick={() => { navigate('/info'); setIsMenuOpen(false); }}>
                                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                LỊCH CHIẾU
                            </li>
                            <li className="text-slate-200 hover:bg-slate-800 rounded-xl p-4 cursor-pointer flex items-center gap-3 transition-colors" onClick={() => { navigate('/listfilm'); setIsMenuOpen(false); }}>
                                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path></svg>
                                PHIM ĐANG CHIẾU
                            </li>
                            <li className="text-slate-200 hover:bg-slate-800 rounded-xl p-4 cursor-pointer flex items-center gap-3 transition-colors" onClick={() => { navigate('/introduce'); setIsMenuOpen(false); }}>
                                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                GIỚI THIỆU
                            </li>
                        </ul>
                    </div>
                </div>
            )}

            <div className={`md:flex justify-between items-center px-4 py-2 text-sm font-medium ${isMenuOpen ? 'hidden' : 'block'} md:block border-t border-slate-800/50 mt-1`}>
                <div className="flex flex-wrap gap-4 w-full md:w-1/2">
                    <div className="relative">
                        <span onClick={() => setIsOpen(!isOpen)} className="cursor-pointer flex items-center gap-1.5 text-slate-300 hover:text-purple-400 transition-colors duration-300 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800 hover:border-purple-500/50">
                            <MapPinIcon className="w-4 h-4 text-purple-500" />
                            Chọn rạp
                        </span>
                        {isOpen && (
                            <div className="absolute left-0 top-[40px] z-50 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-4 grid grid-cols-2 lg:grid-cols-3 gap-3 w-[400px] lg:w-[600px] animate-fade-in-up origin-top-left">
                                {cinemas.map((cinema) => (
                                    <div
                                        key={cinema.cinemaId}
                                        onClick={() => navigate(`/cinezone/${cinema.cinemaId}`)}
                                        className="text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-lg cursor-pointer transition-colors"
                                    >
                                        <span className="block font-bold text-purple-400 mb-1 text-sm">{cinema.cinemaName}</span>
                                        <span className="text-xs opacity-70 line-clamp-1">{cinema.cinemaLocation}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <span onClick={() => navigate('/listfilm')} className="cursor-pointer flex items-center gap-1.5 text-slate-300 hover:text-sky-400 transition-colors duration-300 px-3 py-1.5 rounded-full hover:bg-slate-900/50">
                        <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path></svg>
                        Chọn phim đang chiếu
                    </span>
                </div>
                <div className="w-full md:w-1/2 text-right mt-3 md:mt-0 mr-4">
                    <span onClick={() => navigate('/introduce')} className="cursor-pointer text-slate-400 hover:text-pink-400 transition-colors duration-300 uppercase tracking-wider text-xs font-bold px-3 py-2 rounded-full hover:bg-slate-900/50">
                        Giới thiệu
                    </span>
                </div>
            </div>
        </nav>
    );
}

export default Nav;