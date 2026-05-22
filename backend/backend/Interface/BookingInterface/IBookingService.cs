using backend.DTOs.Requests;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace backend.Interface.BookingInterface
{
    public interface IBookingService
    {
        Task<(bool IsSuccess, string Message, object? Data)> CreateBookingAsync(string userId, BookingRequestDTO request, HttpContext httpContext);
    }
}