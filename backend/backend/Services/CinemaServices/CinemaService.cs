using backend.Data;
using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Interface.CinemaInterface;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Services.CinemaServices
{
    public class CinemaService : ICinemaService
    {
        private readonly DataContext _context;

        public CinemaService(DataContext context)
        {
            _context = context;
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> AddCinemaAsync(CreateCinemaRequestDTO request)
        {
            var existingCinema = await _context.Cinemas.FirstOrDefaultAsync(c => c.Name.ToLower() == request.Name.ToLower() && c.IsDeleted == false);
            if (existingCinema != null)
            {
                return (false, "Rạp với tên này đã tồn tại.", null);
            }

            var newCinema = new Cinema
            {
                Name = request.Name,
                Location = request.Location,
                Hotline = request.Hotline,
                Description = request.Description
            };

            await _context.Cinemas.AddAsync(newCinema);
            await _context.SaveChangesAsync();

            return (true, "Thêm rạp thành công.", newCinema.CinemaId);
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> EditCinemaAsync(string cinemaId, UpdateCinemaRequestDTO request)
        {
            var cinema = await _context.Cinemas.FindAsync(cinemaId);
            if (cinema == null || cinema.IsDeleted == true)
            {
                return (false, "Không tìm thấy rạp.", null);
            }

            if (string.IsNullOrEmpty(request.Name) == false)
            {
                var existingCinema = await _context.Cinemas.FirstOrDefaultAsync(c => c.Name.ToLower() == request.Name.ToLower() && c.CinemaId != cinemaId && c.IsDeleted == false);
                if (existingCinema != null)
                {
                    return (false, "Tên rạp này đã được sử dụng bởi một rạp khác.", null);
                }
                cinema.Name = request.Name;
            }

            if (string.IsNullOrEmpty(request.Location) == false)
            {
                cinema.Location = request.Location;
            }

            if (request.Hotline != null)
            {
                cinema.Hotline = request.Hotline;
            }

            if (request.Description != null)
            {
                cinema.Description = request.Description;
            }

            _context.Cinemas.Update(cinema);
            await _context.SaveChangesAsync();

            return (true, "Cập nhật thông tin rạp thành công.", null);
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> DeleteCinemaAsync(string cinemaId)
        {
            var cinema = await _context.Cinemas.FindAsync(cinemaId);
            if (cinema == null || cinema.IsDeleted == true)
            {
                return (false, "Không tìm thấy rạp.", null);
            }

            var hasActiveShowtimes = await _context.Showtimes
                .Include(s => s.Room)
                .AnyAsync(s => s.Room.CinemaId == cinemaId && s.EndTime > DateTime.Now && s.IsDeleted == false);

            if (hasActiveShowtimes)
            {
                return (false, "Không thể xóa rạp vì vẫn còn suất chiếu đang hoạt động.", null);
            }

            cinema.IsDeleted = true;
            _context.Cinemas.Update(cinema);
            await _context.SaveChangesAsync();

            return (true, "Xóa rạp thành công.", null);
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> GetCinemaListAsync()
        {
            var cinemas = await _context.Cinemas
                .Where(c => c.IsDeleted == false)
                .Select(c => new CinemaBasicResponseDTO
                {
                    CinemaId = c.CinemaId,
                    Name = c.Name,
                    Location = c.Location
                })
                .ToListAsync();

            return (true, "Lấy danh sách rạp thành công.", cinemas);
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> GetCinemaDetailAsync(string cinemaId)
        {
            var cinema = await _context.Cinemas
                .Where(c => c.CinemaId == cinemaId && c.IsDeleted == false)
                .Select(c => new CinemaResponseDTO
                {
                    CinemaId = c.CinemaId,
                    Name = c.Name,
                    Location = c.Location,
                    Hotline = c.Hotline,
                    Description = c.Description,
                })
                .FirstOrDefaultAsync();

            if (cinema == null)
            {
                return (false, "Không tìm thấy rạp.", null);
            }

            return (true, "Lấy chi tiết rạp thành công.", cinema);
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> GetCinemasForBookingAsync(string movieId, string visualFormat)
        {
            var showtimesQuery = _context.Showtimes
                .Where(s => s.MovieId == movieId && s.IsDeleted == false && s.StartTime > DateTime.Now);
            
            if(string.IsNullOrEmpty(visualFormat) == false)
            {
                showtimesQuery = showtimesQuery.Where(s => s.VisualFormat == visualFormat);
            }

            var showtimes = await showtimesQuery
                .Include(s => s.Room)
                .ThenInclude(r => r.Cinema)
                .ToListAsync();

            var cinemas = showtimes
                .Select(s => s.Room.Cinema)
                .Where(c => c.IsDeleted == false)
                .Distinct()
                .Select(c => new CinemaBasicResponseDTO
                {
                    CinemaId = c.CinemaId,
                    Name = c.Name,
                    Location = c.Location
                })
                .ToList();

            if (cinemas.Count == 0)
            {
                return (false, "Không tìm thấy rạp nào chiếu phim này với định dạng đã chọn.", null);
            }

            return (true, "Lấy danh sách rạp thành công.", cinemas);
        }
    }
}