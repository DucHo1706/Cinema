using System.Threading.Tasks;

namespace backend.Interface.BookingInterface
{
    public interface IBookingHistoryService
    {
        Task<(bool IsSuccess, string Message, object? Data)> GetBookingHistoryAsync(string userId);
        Task<(bool IsSuccess, string Message, object? Data)> GetBookingHistoryDetailAsync(string orderId);
    }
}