using backend.Data;
using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Interface.CloudinaryInterface;
using backend.Interface.MovieInterface;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Services.MovieServices
{
    public class MovieService : IMovieService
    {
        private readonly DataContext _context;
        private readonly ICloudinaryServices _cloudinary;

        public MovieService(DataContext context, ICloudinaryServices cloudinary)
        {
            _context = context;
            _cloudinary = cloudinary;
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> CreateMovieAsync(CreateMovieRequestDTO request)
        {
            var isExist = await _context.Movies.AnyAsync(m => m.Title.ToLower() == request.Title.ToLower() && m.IsDeleted == false);
            if (isExist == true)
            {
                return (false, "Tên phim đã tồn tại", null);
            }

            string posterUrl = "";
            if (request.PosterFile != null)
            {
                posterUrl = await _cloudinary.uploadFileToCloudinary(request.PosterFile);
            }

            var movie = new Movie
            {
                Title = request.Title,
                Description = request.Description,
                Director = request.Director,
                Cast = request.Cast,
                DurationMinutes = request.DurationMinutes,
                ReleaseDate = request.ReleaseDate,
                TrailerUrl = request.TrailerUrl,
                Language = request.Language,
                AgeRating = request.AgeRating,
                PosterUrl = posterUrl
            };

            await _context.Movies.AddAsync(movie);

            if (request.GenreIds != null && request.GenreIds.Count > 0)
            {
                foreach (var genreId in request.GenreIds)
                {
                    await _context.MovieGenres.AddAsync(new MovieGenre { MovieId = movie.MovieId, GenreId = genreId });
                }
            }

            await _context.SaveChangesAsync();
            return (true, "Thêm phim thành công", movie.MovieId);
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> UpdateMovieAsync(string movieId, UpdateMovieRequestDTO request)
        {
            var movie = await _context.Movies.Include(m => m.MovieGenres).FirstOrDefaultAsync(m => m.MovieId == movieId && m.IsDeleted == false);
            if (movie == null)
            {
                return (false, "Không tìm thấy phim", null);
            }

            if (string.IsNullOrEmpty(request.Title) == false)
            {
                var titleExists = await _context.Movies.AnyAsync(m => m.Title.ToLower() == request.Title.ToLower() && m.MovieId != movieId && m.IsDeleted == false);
                if (titleExists)
                {
                    return (false, "Tên phim này đã được sử dụng", null);
                }
                movie.Title = request.Title;
            }

            if (request.PosterFile != null)
            {
                movie.PosterUrl = await _cloudinary.uploadFileToCloudinary(request.PosterFile);
            }

            if (string.IsNullOrEmpty(request.Description) == false) movie.Description = request.Description;
            if (string.IsNullOrEmpty(request.Director) == false) movie.Director = request.Director;
            if (string.IsNullOrEmpty(request.Cast) == false) movie.Cast = request.Cast;
            if (request.DurationMinutes.HasValue) movie.DurationMinutes = request.DurationMinutes.Value;
            if (request.ReleaseDate.HasValue) movie.ReleaseDate = request.ReleaseDate.Value;
            if (string.IsNullOrEmpty(request.TrailerUrl) == false) movie.TrailerUrl = request.TrailerUrl;
            if (string.IsNullOrEmpty(request.Language) == false) movie.Language = request.Language;
            if (string.IsNullOrEmpty(request.AgeRating) == false) movie.AgeRating = request.AgeRating;

            if (request.GenreIds != null && request.GenreIds.Count > 0)
            {
                _context.MovieGenres.RemoveRange(movie.MovieGenres);
                foreach (var genreId in request.GenreIds)
                {
                    await _context.MovieGenres.AddAsync(new MovieGenre { MovieId = movie.MovieId, GenreId = genreId });
                }
            }

            _context.Movies.Update(movie);
            await _context.SaveChangesAsync();

            return (true, "Sửa thông tin phim thành công", null);
        }

        // Chỉ việc kiểm tra nếu có ai mua vé, thì xóa mềm. Nếu chưa ai mua, xóa cứng!
        public async Task<(bool IsSuccess, string Message, object? Data)> DeleteMovieAsync(string movieId)
        {
            var movie = await _context.Movies.FindAsync(movieId);
            if (movie == null || movie.IsDeleted)
            {
                return (false, "Không tìm thấy phim", null);
            }

            bool hasTickets = await _context.Tickets.AnyAsync(t => t.Showtime.MovieId == movieId);
            
            if (hasTickets == true)
            {
                movie.IsDeleted = true;
                _context.Movies.Update(movie);
            }
            else
            {
                _context.Movies.Remove(movie);
            }

            await _context.SaveChangesAsync();
            return (true, "Xóa phim thành công", null);
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> GetMovieDetailAsync(string movieId)
        {
            var movie = await _context.Movies
                .Include(m => m.MovieGenres)
                .ThenInclude(mg => mg.Genre)
                .FirstOrDefaultAsync(m => m.MovieId == movieId && m.IsDeleted == false);
                
            if (movie == null)
            {
                return (false, "Không tìm thấy phim", null);
            }

            var dto = new MovieResponseDTO
            {
                MovieId = movie.MovieId,
                Title = movie.Title,
                Description = movie.Description,
                Director = movie.Director,
                Cast = movie.Cast,
                DurationMinutes = movie.DurationMinutes,
                ReleaseDate = movie.ReleaseDate,
                PosterUrl = movie.PosterUrl,
                TrailerUrl = movie.TrailerUrl,
                Language = movie.Language,
                AgeRating = movie.AgeRating,
                Genres = movie.MovieGenres.Select(mg => mg.Genre.Name).ToList()
            };

            return (true, "Lấy thông tin phim thành công", dto);
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> GetMoviesPaginationAsync(int page, int pageSize = 9)
        {
            var totalCount = await _context.Movies.CountAsync(m => m.IsDeleted == false);
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var movies = await _context.Movies
                .Include(m => m.MovieGenres).ThenInclude(mg => mg.Genre)
                .Where(m => m.IsDeleted == false)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(m => new MovieResponseDTO
                {
                    MovieId = m.MovieId,
                    Title = m.Title,
                    PosterUrl = m.PosterUrl,
                    DurationMinutes = m.DurationMinutes,
                    ReleaseDate = m.ReleaseDate,
                    TrailerUrl = m.TrailerUrl,
                    Language = m.Language,
                    Genres = m.MovieGenres.Select(mg => mg.Genre.Name).ToList()
                })
                .ToListAsync();

            var response = new PaginationResponseDTO<MovieResponseDTO>
            {
                Items = movies,
                CurrentPage = page,
                TotalPages = totalPages,
                TotalCount = totalCount
            };

            return (true, "Lấy danh sách thành công", response);
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> SearchMoviesPaginationAsync(string keyword, int page, int pageSize = 9)
        {
            var query = _context.Movies.Where(m => m.Title.Contains(keyword) && m.IsDeleted == false);
            
            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var movies = await query
                .Include(m => m.MovieGenres).ThenInclude(mg => mg.Genre)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(m => new MovieResponseDTO
                {
                    MovieId = m.MovieId,
                    Title = m.Title,
                    PosterUrl = m.PosterUrl,
                    DurationMinutes = m.DurationMinutes,
                    ReleaseDate = m.ReleaseDate,
                    TrailerUrl = m.TrailerUrl,
                    Language = m.Language,
                    Genres = m.MovieGenres.Select(mg => mg.Genre.Name).ToList()
                })
                .ToListAsync();

            var response = new PaginationResponseDTO<MovieResponseDTO>
            {
                Items = movies,
                CurrentPage = page,
                TotalPages = totalPages,
                TotalCount = totalCount
            };
            
            return (true, "Tìm kiếm thành công", response);
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> GetShowingMoviesTake5Async()
        {
            var movies = await _context.Movies
                .Where(m => m.IsDeleted == false && m.ReleaseDate <= DateTime.Now)
                .Take(5)
                .Select(m => new MovieResponseDTO { MovieId = m.MovieId, Title = m.Title, PosterUrl = m.PosterUrl, TrailerUrl = m.TrailerUrl })
                .ToListAsync();
                
            return (true, "Lấy data thành công", movies);
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> GetUpcomingMoviesTake5Async()
        {
            var movies = await _context.Movies
                .Where(m => m.IsDeleted == false && m.ReleaseDate > DateTime.Now)
                .Take(5)
                .Select(m => new MovieResponseDTO { MovieId = m.MovieId, Title = m.Title, PosterUrl = m.PosterUrl, TrailerUrl = m.TrailerUrl })
                .ToListAsync();
                
            return (true, "Lấy data thành công", movies);
        }
    }
}
