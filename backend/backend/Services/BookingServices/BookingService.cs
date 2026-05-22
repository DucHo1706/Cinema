using backend.Data;
using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Interface.BookingInterface;
using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Services.BookingServices
{
    public class BookingService : IBookingService
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;

        public BookingService(DataContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> CreateBookingAsync(string userId, BookingRequestDTO request, HttpContext httpContext)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var showtime = await _context.Showtimes
                    .FirstOrDefaultAsync(s => s.ShowtimeId == request.ShowtimeId && s.IsDeleted == false);

                if (showtime == null) return (false, "Suất chiếu không hợp lệ.", null);
                if (showtime.StartTime <= DateTime.Now) return (false, "Suất chiếu đã bắt đầu, không thể đặt vé.", null);

                var requestedSeats = await _context.Seats
                    .Where(s => request.SeatIds.Contains(s.SeatId) && s.RoomId == showtime.RoomId && s.IsDeleted == false)
                    .ToListAsync();

                if (requestedSeats.Count != request.SeatIds.Count)
                {
                    return (false, "Một hoặc nhiều ghế không hợp lệ hoặc không thuộc phòng chiếu này.", null);
                }

                var alreadyBookedSeatIds = await _context.Tickets
                    .Where(t => t.ShowtimeId == request.ShowtimeId && request.SeatIds.Contains(t.SeatId))
                    .Select(t => t.Seat.SeatName)
                    .ToListAsync();

                if (alreadyBookedSeatIds.Any())
                {
                    return (false, $"Các ghế sau đã có người đặt: {string.Join(", ", alreadyBookedSeatIds)}", null);
                }

                decimal totalFoodPrice = 0;
                var foodEntities = new List<Food>();
                if (request.FoodItems.Any())
                {
                    var foodIds = request.FoodItems.Select(f => f.FoodId).ToList();
                    foodEntities = await _context.Foods.Where(f => foodIds.Contains(f.FoodId) && f.IsDeleted == false).ToListAsync();

                    if (foodEntities.Count != foodIds.Count) return (false, "Một hoặc nhiều sản phẩm không hợp lệ.", null);

                    foreach (var item in request.FoodItems)
                    {
                        var food = foodEntities.First(f => f.FoodId == item.FoodId);
                        totalFoodPrice += food.Price * item.Quantity;
                    }
                }

                decimal totalTicketPrice = showtime.BaseTicketPrice * request.SeatIds.Count;
                decimal totalPrice = totalTicketPrice + totalFoodPrice;

                var newOrder = new Order
                {
                    UserId = userId,
                    TotalPrice = totalPrice,
                    PaymentMethod = request.PaymentMethod,
                    PaymentStatus = "Pending",
                    CreatedAt = DateTime.Now
                };
                await _context.Orders.AddAsync(newOrder);
                await _context.SaveChangesAsync();

                var tickets = request.SeatIds.Select(seatId => new Ticket
                {
                    OrderId = newOrder.OrderId,
                    ShowtimeId = request.ShowtimeId,
                    SeatId = seatId,
                    Price = showtime.BaseTicketPrice
                }).ToList();
                await _context.Tickets.AddRangeAsync(tickets);

                if (request.FoodItems.Any())
                {
                    var orderFoods = request.FoodItems.Select(item => new OrderFood
                    {
                        OrderId = newOrder.OrderId,
                        FoodId = item.FoodId,
                        Quantity = item.Quantity,
                        PriceEach = foodEntities.First(f => f.FoodId == item.FoodId).Price
                    }).ToList();
                    await _context.OrderFoods.AddRangeAsync(orderFoods);
                }

                await _context.SaveChangesAsync();

                string? paymentUrl = null;
                if (request.PaymentMethod == "VNPAY")
                {
                    // Tạm thời comment logic VNPAY để Build thành công (Do chưa cài thư viện VNPAY.NET)
                    // Khi nào cần chạy thật, bạn hãy mở Terminal và gõ: dotnet add package VNPAY.NET
                    
                    paymentUrl = $"https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_TxnRef={newOrder.OrderId}"; 
                }

                await transaction.CommitAsync();

                var response = new BookingResponseDTO { OrderId = newOrder.OrderId, PaymentUrl = paymentUrl, TotalPrice = totalPrice };
                return (true, "Tạo đơn hàng thành công. Vui lòng tiến hành thanh toán.", response);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                if (ex.InnerException != null && ex.InnerException.Message.Contains("UQ_Showtime_Seat"))
                {
                    return (false, "Rất tiếc, một trong các ghế bạn chọn đã được người khác đặt trong lúc bạn thao tác. Vui lòng chọn lại.", null);
                }
                return (false, $"Lỗi hệ thống: {ex.Message}", null);
            }
        }
    }
}