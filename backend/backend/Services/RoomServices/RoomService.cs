using backend.Data;
using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Interface.RoomInterface;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Services.RoomServices
{
    public class RoomService : IRoomService
    {
        private readonly DataContext _context;

        public RoomService(DataContext context)
        {
            _context = context;
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> CreateRoomAsync(CreateRoomRequestDTO request)
        {
            var cinema = await _context.Cinemas.FindAsync(request.CinemaId);
            if (cinema == null || cinema.IsDeleted == true)
            {
                return (false, "Rạp phim không tồn tại.", null);
            }

            var existingRoom = await _context.Rooms
                .FirstOrDefaultAsync(r => r.CinemaId == request.CinemaId && r.RoomName.ToLower() == request.RoomName.ToLower() && r.IsDeleted == false);
            
            if (existingRoom != null)
            {
                return (false, "Tên phòng chiếu này đã tồn tại trong rạp.", null);
            }

            var newRoom = new Room
            {
                CinemaId = request.CinemaId,
                RoomName = request.RoomName
            };

            await _context.Rooms.AddAsync(newRoom);
            await _context.SaveChangesAsync();

            return (true, "Tạo phòng chiếu thành công.", newRoom.RoomId);
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> UpdateRoomAsync(string roomId, UpdateRoomRequestDTO request)
        {
            var room = await _context.Rooms.FindAsync(roomId);
            if (room == null || room.IsDeleted == true)
            {
                return (false, "Không tìm thấy phòng chiếu.", null);
            }

            if (string.IsNullOrEmpty(request.RoomName) == false)
            {
                var existingRoom = await _context.Rooms
                    .FirstOrDefaultAsync(r => r.CinemaId == room.CinemaId && r.RoomName.ToLower() == request.RoomName.ToLower() && r.RoomId != roomId && r.IsDeleted == false);
                
                if (existingRoom != null)
                {
                    return (false, "Tên phòng chiếu này đã tồn tại trong rạp.", null);
                }
                room.RoomName = request.RoomName;
            }

            _context.Rooms.Update(room);
            await _context.SaveChangesAsync();

            return (true, "Cập nhật phòng chiếu thành công.", null);
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> DeleteRoomAsync(string roomId)
        {
            var room = await _context.Rooms.FindAsync(roomId);
            if (room == null || room.IsDeleted == true)
            {
                return (false, "Không tìm thấy phòng chiếu.", null);
            }

            var hasActiveShowtimes = await _context.Showtimes
                .AnyAsync(s => s.RoomId == roomId && s.IsDeleted == false);

            if (hasActiveShowtimes == true)
            {
                return (false, "Không thể xóa phòng chiếu vì đang có suất chiếu được lên lịch.", null);
            }

            room.IsDeleted = true;
            _context.Rooms.Update(room);
            await _context.SaveChangesAsync();

            return (true, "Xóa phòng chiếu thành công.", null);
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> GetRoomListAsync()
        {
            var rooms = await _context.Rooms
                .Include(r => r.Cinema)
                .Where(r => r.IsDeleted == false)
                .Select(r => new RoomResponseDTO
                {
                    RoomId = r.RoomId,
                    CinemaId = r.CinemaId,
                    CinemaName = r.Cinema.Name,
                    RoomName = r.RoomName
                })
                .ToListAsync();

            return (true, "Lấy danh sách phòng thành công.", rooms);
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> SearchRoomByCinemaIdAsync(string cinemaId)
        {
            if (string.IsNullOrEmpty(cinemaId) == true)
            {
                 return (false, "ID rạp không được để trống.", null);
            }

            var rooms = await _context.Rooms
                .Include(r => r.Cinema)
                .Where(r => r.CinemaId == cinemaId && r.IsDeleted == false)
                .Select(r => new RoomResponseDTO
                {
                    RoomId = r.RoomId,
                    CinemaId = r.CinemaId,
                    CinemaName = r.Cinema.Name,
                    RoomName = r.RoomName
                })
                .ToListAsync();

            return (true, "Tìm kiếm thành công.", rooms);
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> GetRoomDetailAsync(string roomId)
        {
            var room = await _context.Rooms
                .Include(r => r.Cinema)
                .Where(r => r.RoomId == roomId && r.IsDeleted == false)
                .Select(r => new RoomResponseDTO
                {
                    RoomId = r.RoomId,
                    CinemaId = r.CinemaId,
                    CinemaName = r.Cinema.Name,
                    RoomName = r.RoomName
                })
                .FirstOrDefaultAsync();

            if (room == null)
            {
                return (false, "Không tìm thấy phòng chiếu.", null);
            }

            return (true, "Lấy thông tin phòng thành công.", room);
        }
    }
}