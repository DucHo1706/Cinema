using backend.DTOs.Requests;
using System.Threading.Tasks;

namespace backend.Interface.GenreInterface
{
    public interface IGenreService
    {
        Task<(bool IsSuccess, string Message, object? Data)> GetAllGenresAsync();
        Task<(bool IsSuccess, string Message, object? Data)> CreateGenreAsync(CreateGenreRequestDTO request);
        Task<(bool IsSuccess, string Message, object? Data)> UpdateGenreAsync(string genreId, UpdateGenreRequestDTO request);
        Task<(bool IsSuccess, string Message, object? Data)> DeleteGenreAsync(string genreId);
    }
}