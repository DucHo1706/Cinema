using backend.Data;
using backend.DTOs.Requests;

namespace backend.Services.Genre
{
    public class GenreService
    {
        private readonly DataContext _dataContext;
        public async Task<(bool IsSuccess, string Message, object? Data)> UpdateGenreAsync(string id, UpdateGenreDTO request)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                return (false, "ID thể loại không hợp lệ", null);
            }

            // Tìm kiếm Thể loại theo Id
            var genre = await _dataContext.Genres.FindAsync(id);
            if (genre == null)
            {
                return (false, "Không tìm thấy thể loại này", null);
            }

            // Cập nhật thông tin
            genre.Name = request.Name;

            if (request.Description != null)
            {
                genre.Description = request.Description;
            }

            // Không dùng _dataContext.Update(genre) vì entity đang được track bởi EF Core
            await _dataContext.SaveChangesAsync();

            return (true, "Cập nhật thể loại thành công", genre);
        }

    }
}
