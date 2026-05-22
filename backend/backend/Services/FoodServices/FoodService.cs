using backend.Data;
using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Interface.FoodInterface;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Services.FoodServices
{
    public class FoodService : IFoodService
    {
        private readonly DataContext _context;

        public FoodService(DataContext context)
        {
            _context = context;
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> GetAllFoodsAsync()
        {
            var foods = await _context.Foods
                .Where(f => f.IsDeleted == false)
                .Select(f => new FoodResponseDTO
                {
                    FoodId = f.FoodId,
                    Name = f.Name,
                    ImageUrl = f.ImageUrl,
                    Price = f.Price
                }).ToListAsync();

            return (true, "Lấy danh sách đồ ăn thành công", foods);
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> CreateFoodAsync(CreateFoodRequestDTO request)
        {
            var food = new Food
            {
                Name = request.Name,
                ImageUrl = request.ImageUrl,
                Price = request.Price
            };

            await _context.Foods.AddAsync(food);
            await _context.SaveChangesAsync();

            return (true, "Thêm đồ ăn thành công", food.FoodId);
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> UpdateFoodAsync(string foodId, UpdateFoodRequestDTO request)
        {
            var food = await _context.Foods.FindAsync(foodId);
            if (food == null || food.IsDeleted) return (false, "Không tìm thấy đồ ăn", null);

            if (string.IsNullOrEmpty(request.Name) == false) food.Name = request.Name;
            if (string.IsNullOrEmpty(request.ImageUrl) == false) food.ImageUrl = request.ImageUrl;
            if (request.Price.HasValue) food.Price = request.Price.Value;

            _context.Foods.Update(food);
            await _context.SaveChangesAsync();

            return (true, "Cập nhật đồ ăn thành công", null);
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> DeleteFoodAsync(string foodId)
        {
            var food = await _context.Foods.FindAsync(foodId);
            if (food == null || food.IsDeleted) return (false, "Không tìm thấy đồ ăn", null);

            food.IsDeleted = true;
            _context.Foods.Update(food);
            await _context.SaveChangesAsync();

            return (true, "Xóa đồ ăn thành công", null);
        }
    }
}