using backend.DTOs.Requests;
using backend.DTOs.Responses;
using System.Threading.Tasks;

namespace backend.Interface.RoomInterface
{
    // Đã khôi phục lại Interface cho Room
    public interface IRoomService
    {
        Task<(bool IsSuccess, string Message, object? Data)> CreateRoomAsync(CreateRoomRequestDTO request);
        Task<(bool IsSuccess, string Message, object? Data)> UpdateRoomAsync(string roomId, UpdateRoomRequestDTO request);
        Task<(bool IsSuccess, string Message, object? Data)> DeleteRoomAsync(string roomId);
        Task<(bool IsSuccess, string Message, object? Data)> GetRoomListAsync();
        Task<(bool IsSuccess, string Message, object? Data)> SearchRoomByCinemaIdAsync(string cinemaId);
        Task<(bool IsSuccess, string Message, object? Data)> GetRoomDetailAsync(string roomId);
    }
}