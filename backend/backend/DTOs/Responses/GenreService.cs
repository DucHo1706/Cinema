using backend.Data;
using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Interface.GenreInterface;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Services.GenreServices
{
    public class GenreService : IGenreService
    {
        private readonly DataContext _context;

        public GenreService(DataContext context)
        {
            _context = context;
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> GetAllGenresAsync()
        {
            var genres = await _context.Genres
                .Select(g => new GenreResponseDTO
                {
                    GenreId = g.GenreId,
                    Name = g.Name
                })
                .ToListAsync();

            return (true, "Lấy danh sách thể loại thành công", genres);
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> CreateGenreAsync(CreateGenreRequestDTO request)
        {
            var isExist = await _context.Genres.AnyAsync(g => g.Name.ToLower() == request.Name.ToLower());
            if (isExist) return (false, "Tên thể loại đã tồn tại", null);

            var genre = new Genre { Name = request.Name };
            await _context.Genres.AddAsync(genre);
            await _context.SaveChangesAsync();

            return (true, "Thêm thể loại thành công", genre.GenreId);
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> UpdateGenreAsync(string genreId, UpdateGenreRequestDTO request)
        {
            var genre = await _context.Genres.FindAsync(genreId);
            if (genre == null) return (false, "Không tìm thấy thể loại", null);

            var isExist = await _context.Genres.AnyAsync(g => g.Name.ToLower() == request.Name.ToLower() && g.GenreId != genreId);
            if (isExist) return (false, "Tên thể loại đã tồn tại", null);

            genre.Name = request.Name;
            _context.Genres.Update(genre);
            await _context.SaveChangesAsync();

            return (true, "Cập nhật thể loại thành công", null);
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> DeleteGenreAsync(string genreId)
        {
            var genre = await _context.Genres.FindAsync(genreId);
            if (genre == null) return (false, "Không tìm thấy thể loại", null);

            _context.Genres.Remove(genre);
            await _context.SaveChangesAsync();

            return (true, "Xóa thể loại thành công", null);
        }
    }
}