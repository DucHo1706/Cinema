using backend.DTOs.Requests;
using System.Threading.Tasks;

namespace backend.Interface.Auth
{
    public interface IAuthService
    {
        Task<(bool IsSuccess, string Message, object? Data)> LoginAsync(LoginRequestDTO request);
        Task<(bool IsSuccess, string Message, object? Data)> RegisterAsync(RegisterRequestDTO request);
        Task<(bool IsSuccess, string Message, object? Data)> VerifyEmailCodeAsync(string email, string code);
    }
}