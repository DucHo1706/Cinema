using backend.DTOs.Requests;
using backend.DTOs.Responses;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Interface.MovieInterface
{
    public interface IMovieService
    {
        Task<(bool IsSuccess, string Message, object? Data)> CreateMovieAsync(CreateMovieRequestDTO request);
        Task<(bool IsSuccess, string Message, object? Data)> UpdateMovieAsync(string movieId, UpdateMovieRequestDTO request);
        Task<(bool IsSuccess, string Message, object? Data)> DeleteMovieAsync(string movieId);
        Task<(bool IsSuccess, string Message, object? Data)> GetMovieDetailAsync(string movieId);
        Task<(bool IsSuccess, string Message, object? Data)> GetMoviesPaginationAsync(int page, int pageSize = 9);
        Task<(bool IsSuccess, string Message, object? Data)> SearchMoviesPaginationAsync(string keyword, int page, int pageSize = 9);
        Task<(bool IsSuccess, string Message, object? Data)> GetShowingMoviesTake5Async();
        Task<(bool IsSuccess, string Message, object? Data)> GetUpcomingMoviesTake5Async();
    }
}