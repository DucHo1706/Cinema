// @ts-ignore: missing type declarations for css import
import './App.css';
import Nav from './Header/nav';
import Bottom from './Footer/bottom';
import MovieSlider from './Components/MovieSlider';
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
// @ts-ignore: missing type declarations for swiper css
import 'swiper/css';
// @ts-ignore: missing type declarations for swiper navigation css
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';

interface Movie {
  movieId: string;
  movieName: string;
  movieImage: string;
  trailerUrl: string;
  isRelease: boolean;
}

function Home() {
  const navigate = useNavigate();
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch currently showing movies with isRelease: true
  useEffect(() => {
    const fetchAllMovies = async () => {
      let allMovies: Movie[] = [];
      let page = 1;
      let hasMore = true;

      try {
        while (hasMore) {
          const response = await fetch(`http://localhost:5229/api/movie/getAllMoviesPagniation/${page}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          const moviesData = data.movieRespondDTOs || data.data || data;
          if (!Array.isArray(moviesData) || moviesData.length === 0) {
            hasMore = false;
          } else {
            const formattedMovies = moviesData
              .filter((item: any) => item.isRelease === true)
              .map((item: any) => ({
                movieId: item.movieID || item.movieId || '',
                movieName: item.movieName || '',
                movieImage: item.movieImage || '',
                trailerUrl: item.movieTrailerUrl || item.trailerURL || '',
                isRelease: item.isRelease || false,
              }));
            allMovies = [...allMovies, ...formattedMovies];
            page++;
          }
        }
        setMovies(allMovies);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách phim:', error);
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllMovies();
  }, []);

  // Fetch upcoming movies
  useEffect(() => {
    setIsLoading(true);
    fetch('http://localhost:5229/api/movie/GetUnShowedMovie')
      .then((response) => response.json())
      .then((data) => {
        console.log('Dữ liệu API phim sắp chiếu:', JSON.stringify(data, null, 2));
        if (data.status === 'Success' && Array.isArray(data.data)) {
          const formattedMovies = data.data.map((item: any) => ({
            movieId: item.movieID || item.movieId || '',
            movieName: item.movieName || '',
            movieImage: item.movieImage || '',
            trailerUrl: item.movieTrailerUrl || item.trailerURL || '',
            isRelease: item.isRelease || false,
          }));
          setUpcomingMovies(formattedMovies);
        } else {
          console.error('Dữ liệu API không đúng định dạng:', data);
          setUpcomingMovies([]);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Lỗi khi lấy danh sách phim sắp chiếu:', error);
        setUpcomingMovies([]);
        setIsLoading(false);
      });
  }, []);

  const handleListfilm = () => {
    navigate('/listfilm');
  };

  const handleComingmovies = () => {
    navigate('/Comingmovies');
  };

  const handleMovies = (movieId: string) => {
    localStorage.setItem('movieId', movieId);
    navigate('/movies');
  };

  const handleMoviedetail = (movieId: string) => {
    navigate(`/moviedetail/${movieId}`);
  };

  const handleOpenTrailer = (url: string) => {
    let embedUrl = url;
    if (url.includes('watch?v=')) {
      embedUrl = url.replace('watch?v=', 'embed/');
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    setTrailerUrl(embedUrl);
    setShowTrailer(true);
  };

  const renderMovieSlide = (movie: Movie, index: number): React.ReactElement => (
    <SwiperSlide key={movie.movieId} className="py-4">
      <div className="flex flex-col items-center group cursor-pointer">
        <div className="relative overflow-hidden rounded-2xl shadow-xl transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] w-72 h-[420px]">
          <img
            src={movie.movieImage}
            alt={movie.movieName}
            onClick={() => handleMovies(movie.movieId)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5">
            <button
              onClick={(e) => { e.stopPropagation(); handleMovies(movie.movieId); }}
              className="w-full py-3 mb-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold tracking-wide transform translate-y-8 group-hover:translate-y-0 transition-all duration-300 shadow-lg"
            >
              🎟 Đặt vé ngay
            </button>
          </div>
          {/* Play button overlay */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100 z-10">
            <button
              onClick={(e) => { e.stopPropagation(); handleOpenTrailer(movie.trailerUrl); }}
              className="p-4 bg-red-600/90 rounded-full text-white hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.6)] transition-all transform hover:scale-110"
            >
              <svg
                className="w-8 h-8 ml-1"
                fill="currentColor"
                viewBox="0 0 576 512"
              >
                <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
              </svg>
            </button>
          </div>
        </div>
        <p className="text-slate-100 mt-5 font-bold text-lg text-center max-w-[280px] truncate tracking-wide group-hover:text-purple-400 transition-colors duration-300">{movie.movieName}</p>
      </div>
    </SwiperSlide>
  );

  const renderMovieSlide1 = (movie: Movie, index: number) => (
    <SwiperSlide key={movie.movieId} className="py-4">
      <div className="flex flex-col items-center group cursor-pointer">
        <div className="relative overflow-hidden rounded-2xl shadow-xl transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(56,189,248,0.4)] w-72 h-[420px]">
          <img
            src={movie.movieImage}
            alt={movie.movieName}
            onClick={() => handleMoviedetail(movie.movieId)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5">
            <button
              onClick={(e) => { e.stopPropagation(); handleMoviedetail(movie.movieId); }}
              className="w-full py-3 mb-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white rounded-xl font-bold tracking-wide transform translate-y-8 group-hover:translate-y-0 transition-all duration-300 shadow-lg"
            >
              ℹ️ Tìm hiểu thêm
            </button>
          </div>
          {/* Play button overlay */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100 z-10">
            <button
              onClick={(e) => { e.stopPropagation(); handleOpenTrailer(movie.trailerUrl); }}
              className="p-4 bg-red-600/90 rounded-full text-white hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.6)] transition-all transform hover:scale-110"
            >
              <svg
                className="w-8 h-8 ml-1"
                fill="currentColor"
                viewBox="0 0 576 512"
              >
                <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
              </svg>
            </button>
          </div>
        </div>
        <p className="text-slate-100 mt-5 font-bold text-lg text-center max-w-[280px] truncate tracking-wide group-hover:text-sky-400 transition-colors duration-300">{movie.movieName}</p>
      </div>
    </SwiperSlide>
  );

  return (
    <div className="relative min-h-screen w-full bg-slate-950 font-sans selection:bg-purple-500/30">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images8.alphacoders.com/136/thumb-1920-1368754.jpeg')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/80 to-slate-950"></div>
      </div>

      <div className="relative z-10">
        <div className="sticky top-0 z-50 bg-slate-950 shadow-md">
          <header>
            <div className="content-wrapper max-w-screen-xl text-base mx-auto px-8">
              <Nav />
            </div>
          </header>
        </div>

        <div className="content-wrapper max-w-screen-xl text-base mx-auto px-8 min-h-screen top-0">
          <main className="flex flex-col gap-6 p-4">
            <MovieSlider />
            <section className="mt-12">
              <div className="flex items-center justify-between mb-8 px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 font-extrabold uppercase tracking-wider relative inline-block">
                  Phim Đang Chiếu
                  <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-purple-400 to-transparent rounded-full"></span>
                </h2>
                <button onClick={handleListfilm} className="text-slate-400 hover:text-white font-medium flex items-center gap-2 group transition-colors duration-300">
                  <span className="hidden sm:inline">Xem tất cả</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </button>
              </div>
              <div className="px-4 sm:px-6 lg:px-8">
                {isLoading ? (
                  <p className="text-white text-center">Đang tải...</p>
                ) : (
                  <Swiper
                    breakpoints={{
                      320: { slidesPerView: 1, spaceBetween: 10 },
                      640: { slidesPerView: 2, spaceBetween: 20 },
                      1024: { slidesPerView: 3, spaceBetween: 30 },
                      1280: { slidesPerView: 4, spaceBetween: 30 },
                    }}
                    navigation
                    modules={[Navigation]}
                    className="mySwiper"
                  >
                    {movies?.length > 0 ? (
                      movies.map(renderMovieSlide)
                    ) : (
                      <p className="text-white text-center">Không có phim nào để hiển thị</p>
                    )}
                  </Swiper>
                )}
              </div>
            </section>

            <section className="mt-16">
              <div className="flex items-center justify-between mb-8 px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600 font-extrabold uppercase tracking-wider relative inline-block">
                  Phim Sắp Chiếu
                  <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-sky-400 to-transparent rounded-full"></span>
                </h2>
                <button onClick={handleComingmovies} className="text-slate-400 hover:text-white font-medium flex items-center gap-2 group transition-colors duration-300">
                  <span className="hidden sm:inline">Xem tất cả</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </button>
              </div>
              <div className="px-4 sm:px-6 lg:px-8">
                {isLoading ? (
                  <p className="text-white text-center">Đang tải...</p>
                ) : (
                  <Swiper
                    breakpoints={{
                      320: { slidesPerView: 1, spaceBetween: 10 },
                      640: { slidesPerView: 2, spaceBetween: 20 },
                      1024: { slidesPerView: 3, spaceBetween: 30 },
                      1280: { slidesPerView: 4, spaceBetween: 30 },
                    }}
                    navigation
                    modules={[Navigation]}
                    className="mySwiper"
                  >
                    {upcomingMovies?.length > 0 ? (
                      upcomingMovies.map(renderMovieSlide1)
                    ) : (
                      <p className="text-white text-center">Không có phim nào để hiển thị</p>
                    )}
                  </Swiper>
                )}
              </div>
            </section>

            {showTrailer && (
              <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 p-4">
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
          </main>
        </div>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all border cursor-pointer"
        >
          ↑
        </button>
        <footer className="pt-32">
          <Bottom />
        </footer>
      </div>
    </div>
  );
}

export default Home;