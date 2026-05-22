using backend.Data;
using backend.DTOs.Responses;
using backend.Interface.BookingInterface;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Services.BookingHistoryServices
{
    public class BookingHistoryService : IBookingHistoryService
    {
        private readonly DataContext _context;

        public BookingHistoryService(DataContext context)
        {
            _context = context;
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> GetBookingHistoryAsync(string userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return (false, "Lỗi: Không tìm thấy thông tin khách hàng", null);
            }

            var orders = await _context.Orders
                .Where(o => o.UserId == userId && o.PaymentStatus == "Success")
                .Include(o => o.Tickets).ThenInclude(t => t.Showtime).ThenInclude(s => s.Movie)
                .Include(o => o.Tickets).ThenInclude(t => t.Showtime).ThenInclude(s => s.Room).ThenInclude(r => r.Cinema)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            var responseList = new List<BookingHistoryResponseDTO>();

            foreach (var order in orders)
            {
                var firstTicket = order.Tickets.FirstOrDefault();
                if (firstTicket == null) continue;

                var showtime = firstTicket.Showtime;

                var dto = new BookingHistoryResponseDTO
                {
                    OrderId = order.OrderId,
                    CinemaName = showtime.Room.Cinema.Name,
                    RoomName = showtime.Room.RoomName,
                    MovieName = showtime.Movie.Title,
                    StartTime = showtime.StartTime,
                    Status = showtime.StartTime > DateTime.Now ? "Chưa chiếu" : "Đã chiếu",
                    TotalPrice = order.TotalPrice,
                    CreatedAt = order.CreatedAt
                };

                responseList.Add(dto);
            }

            return (true, "Lấy lịch sử đặt vé thành công", responseList);
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> GetBookingHistoryDetailAsync(string orderId)
        {
            var order = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderFoods).ThenInclude(of => of.Food)
                .Include(o => o.Tickets).ThenInclude(t => t.Showtime).ThenInclude(s => s.Movie)
                .Include(o => o.Tickets).ThenInclude(t => t.Showtime).ThenInclude(s => s.Room).ThenInclude(r => r.Cinema)
                .Include(o => o.Tickets).ThenInclude(t => t.Seat)
                .FirstOrDefaultAsync(o => o.OrderId == orderId);

            if (order == null)
            {
                return (false, "Không tìm thấy thông tin đơn hàng", null);
            }

            var firstTicket = order.Tickets.FirstOrDefault();
            if (firstTicket == null)
            {
                 return (false, "Đơn hàng không chứa vé nào", null);
            }

            var showtime = firstTicket.Showtime;
            var seatNames = order.Tickets.Select(t => t.Seat.SeatName).ToList();

            var productList = new Dictionary<string, int>();
            foreach (var item in order.OrderFoods)
            {
                productList.Add(item.Food.Name, item.Quantity);
            }

            var dto = new BookingHistoryDetailResponseDTO
            {
                OrderId = order.OrderId,
                CustomerName = order.User?.FullName ?? "Khách vãng lai",
                PhoneNumber = order.User?.PhoneNumber ?? "",
                CustomerEmail = order.User?.Email ?? order.CustomerEmail ?? "",
                CinemaName = showtime.Room.Cinema.Name,
                RoomName = showtime.Room.RoomName,
                MovieName = showtime.Movie.Title,
                StartTime = showtime.StartTime,
                Status = showtime.StartTime > DateTime.Now ? "Chưa chiếu" : "Đã chiếu",
                SeatList = string.Join(", ", seatNames),
                TotalPrice = order.TotalPrice,
                CreatedAt = order.CreatedAt,
                ProductList = productList
            };

            return (true, "Lấy chi tiết đơn hàng thành công", dto);
        }
    }
}