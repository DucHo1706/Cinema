using backend.DTOs.Requests;
using System.Threading.Tasks;

namespace backend.Interface.FoodInterface
{
    public interface IFoodService
    {
        Task<(bool IsSuccess, string Message, object? Data)> GetAllFoodsAsync();
        Task<(bool IsSuccess, string Message, object? Data)> CreateFoodAsync(CreateFoodRequestDTO request);
        Task<(bool IsSuccess, string Message, object? Data)> UpdateFoodAsync(string foodId, UpdateFoodRequestDTO request);
        Task<(bool IsSuccess, string Message, object? Data)> DeleteFoodAsync(string foodId);
    }
}