using backend.DTOs.Requests;

namespace backend.Interface.GenericsInterface
{
    public interface IGenreService
    {
        Task<(bool IsSuccess, string Message, object? Data)> UpdateGenreAsync(string id, UpdateGenreDTO request);

    }
}
