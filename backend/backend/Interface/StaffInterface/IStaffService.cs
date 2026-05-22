using backend.DTOs.Requests;
using System.Threading.Tasks;

namespace backend.Interface.StaffInterface
{
    public interface IStaffService
    {
        Task<(bool IsSuccess, string Message, object? Data)> GetAllStaffsAsync();
        Task<(bool IsSuccess, string Message, object? Data)> CreateStaffAsync(CreateStaffRequestDTO request);
        Task<(bool IsSuccess, string Message, object? Data)> UpdateStaffAsync(string userId, UpdateStaffRequestDTO request);
        Task<(bool IsSuccess, string Message, object? Data)> DeleteStaffAsync(string userId);
    }
}