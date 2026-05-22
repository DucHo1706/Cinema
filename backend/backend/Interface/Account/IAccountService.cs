using backend.DTOs.Requests;
using System.Threading.Tasks;

namespace backend.Interface.Account
{
    public interface IAccountService
    {
        Task<(bool IsSuccess, string Message, object? Data)> GetAccountInfoAsync(string userId);
        Task<(bool IsSuccess, string Message, object? Data)> ChangePasswordAsync(string userId, ChangePasswordRequestDTO request);
        Task<(bool IsSuccess, string Message, object? Data)> UpdateProfileAsync(string userId, UpdateProfileRequestDTO request);
        Task<(bool IsSuccess, string Message, object? Data)> ResetPasswordAsync(ResetPasswordRequestDTO request);
    }
}