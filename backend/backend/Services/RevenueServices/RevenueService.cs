using backend.Data;
using backend.DTOs.Responses;
using backend.Interface.RevenueInterface;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Services.RevenueServices
{
    public class RevenueService : IRevenueService
    {
        private readonly DataContext _context;

        public RevenueService(DataContext context)
        {
            _context = context;
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> GetRevenueByMovieAsync(DateTime? fromDate, DateTime? toDate)
        {
            var query = _context.Tickets
                .Include(t => t.Order)
                .Include(t => t.Showtime)
                .ThenInclude(s => s.Movie)
                .Where(t => t.Order.PaymentStatus == "Success");

            if (fromDate.HasValue) query = query.Where(t => t.Order.CreatedAt >= fromDate.Value);
            if (toDate.HasValue) query = query.Where(t => t.Order.CreatedAt <= toDate.Value);

            var revenueData = await query
                .GroupBy(t => new { t.Showtime.MovieId, t.Showtime.Movie.Title })
                .Select(g => new RevenueByMovieResponseDTO
                {
                    MovieId = g.Key.MovieId,
                    MovieTitle = g.Key.Title,
                    TotalRevenue = g.Sum(t => t.Price), 
                    TotalTicketsSold = g.Count()
                })
                .OrderByDescending(r => r.TotalRevenue)
                .ToListAsync();

            return (true, "Lấy báo cáo doanh thu theo phim thành công", revenueData);
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> GetRevenueByCinemaAsync(DateTime? fromDate, DateTime? toDate)
        {
            var query = _context.Tickets
                .Include(t => t.Order)
                .Include(t => t.Showtime)
                .ThenInclude(s => s.Room)
                .ThenInclude(r => r.Cinema)
                .Where(t => t.Order.PaymentStatus == "Success");

            if (fromDate.HasValue) query = query.Where(t => t.Order.CreatedAt >= fromDate.Value);
            if (toDate.HasValue) query = query.Where(t => t.Order.CreatedAt <= toDate.Value);

            var revenueData = await query
                .GroupBy(t => new { t.Showtime.Room.CinemaId, t.Showtime.Room.Cinema.Name })
                .Select(g => new RevenueByCinemaResponseDTO
                {
                    CinemaId = g.Key.CinemaId,
                    CinemaName = g.Key.Name,
                    TotalRevenue = g.Sum(t => t.Price),
                    TotalTicketsSold = g.Count()
                })
                .OrderByDescending(r => r.TotalRevenue)
                .ToListAsync();

            return (true, "Lấy báo cáo doanh thu theo cụm rạp thành công", revenueData);
        }
    }
}