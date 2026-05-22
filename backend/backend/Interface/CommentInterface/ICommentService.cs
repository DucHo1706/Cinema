using backend.DTOs.Requests;
using System.Threading.Tasks;

namespace backend.Interface.CommentInterface
{
    public interface ICommentService
    {
        Task<(bool IsSuccess, string Message, object? Data)> GetCommentsByMovieAsync(string movieId);
        Task<(bool IsSuccess, string Message, object? Data)> AddCommentAsync(string userId, CreateCommentRequestDTO request);
        Task<(bool IsSuccess, string Message, object? Data)> UpdateCommentAsync(string userId, string commentId, UpdateCommentRequestDTO request);
        Task<(bool IsSuccess, string Message, object? Data)> DeleteCommentAsync(string userId, string commentId);
    }
}