﻿﻿﻿using backend.Data;
using backend.Interface.Schedule;
using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Services.Schedule
{
    public class ScheduleServices : IScheduleServices
    {
        private readonly DataContext _dataContext;

        public ScheduleServices(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> AddShowtimeAsync(CreateShowtimeDTO request)
        {
            if (string.IsNullOrEmpty(request.MovieId) == true)
            {
                return (false, "Chưa nhập ID của phim", null);
            }

            if (string.IsNullOrEmpty(request.RoomId) == true)
            {
                return (false, "Chưa nhập ID của phòng chiếu", null);
            }

            // Kiểm tra phim có tồn tại không
            var movie = await _dataContext.Movies.FindAsync(request.MovieId);
            if (movie == null)
            {
                return (false, "Phim không tồn tại", null);
            }

            // Kiểm tra phòng có tồn tại không
            var room = await _dataContext.Rooms.FindAsync(request.RoomId);
            if (room == null)
            {
                return (false, "Phòng chiếu không tồn tại", null);
            }

            // Kiểm tra thời gian
            if (request.StartTime >= request.EndTime)
            {
                return (false, "Thời gian kết thúc phải lớn hơn thời gian bắt đầu", null);
            }
            
            // Lấy danh sách lịch chiếu của phòng này trong ngày để kiểm tra trùng lịch
            var existingShowtimesInRoom = await _dataContext.Showtimes
                .Where(s => s.RoomId == request.RoomId && s.IsDeleted == false)
                .ToListAsync();

            bool isConflict = false;
            foreach (var showtime in existingShowtimesInRoom)
            {
                // Kiểm tra xem thời gian chiếu có bị đè lên nhau không
                if (request.StartTime < showtime.EndTime && request.EndTime > showtime.StartTime)
                {
                    isConflict = true;
                    break;
                }
            }

            if (isConflict == true)
            {
                return (false, "Phòng chiếu này đã có lịch chiếu bị trùng thời gian.", null);
        }

            var newShowtime = new Showtime();
            newShowtime.MovieId = request.MovieId;
            newShowtime.RoomId = request.RoomId;
            newShowtime.StartTime = request.StartTime;
            newShowtime.EndTime = request.EndTime;
            newShowtime.VisualFormat = request.VisualFormat;
            newShowtime.BaseTicketPrice = request.BaseTicketPrice;

            await _dataContext.Showtimes.AddAsync(newShowtime);
            await _dataContext.SaveChangesAsync();

            return (true, "Đã thêm lịch chiếu thành công", newShowtime.ShowtimeId);
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> EditShowtimeAsync(string showtimeId, EditShowtimeDTO request)
        {
            if (string.IsNullOrEmpty(showtimeId) == true)
            {
                return (false, "Bạn chưa truyền ID suất chiếu", null);
            }

            var showtime = await _dataContext.Showtimes.FindAsync(showtimeId);
            if (showtime == null)
            {
                return (false, "Không tìm thấy lịch chiếu", null);
            }

            // Kiểm tra xem đã có người đặt vé chưa (Ticket)
            var existingTickets = await _dataContext.Tickets
                .Where(t => t.ShowtimeId == showtimeId)
                .ToListAsync();

            if (existingTickets.Count > 0)
            {
                return (false, "Không thể chỉnh sửa do đã có vé được bán cho suất chiếu này", null);
            }

            // Cập nhật thông tin bằng if (tránh toán tử ba ngôi)
            if (string.IsNullOrEmpty(request.MovieId) == false)
            {
                showtime.MovieId = request.MovieId;
            }

            if (string.IsNullOrEmpty(request.RoomId) == false)
            {
                showtime.RoomId = request.RoomId;
            }

            if (request.StartTime.HasValue == true)
            {
                showtime.StartTime = request.StartTime.Value;
            }

            if (request.EndTime.HasValue == true)
            {
                showtime.EndTime = request.EndTime.Value;
            }

            if (string.IsNullOrEmpty(request.VisualFormat) == false)
            {
                showtime.VisualFormat = request.VisualFormat;
            }

            if (request.BaseTicketPrice.HasValue == true)
            {
                showtime.BaseTicketPrice = request.BaseTicketPrice.Value;
            }

            await _dataContext.SaveChangesAsync();

            return (true, "Chỉnh sửa thành công", null);
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> DeleteShowtimeAsync(string showtimeId)
        {
            if (string.IsNullOrEmpty(showtimeId) == true)
            {
                return (false, "Chưa truyền ID", null);
            }

            var showtime = await _dataContext.Showtimes.FindAsync(showtimeId);
            if (showtime == null)
            {
                return (false, "Lịch chiếu không tồn tại.", null);
            }

            var existingTickets = await _dataContext.Tickets
                .Where(t => t.ShowtimeId == showtimeId)
                .ToListAsync();

            if (existingTickets.Count > 0)
            {
                return (false, "Không thể xóa do đã có người mua vé.", null);
            }

            _dataContext.Showtimes.Remove(showtime);
            await _dataContext.SaveChangesAsync();

            return (true, "Đã xóa lịch chiếu thành công.", null);
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> GetShowtimesByMovieNameAsync(string movieName)
        {
            if (string.IsNullOrEmpty(movieName) == true)
            {
                return (false, "Chưa nhập tên phim", null);
            }

            // Tách các bước LINQ cho dễ hiểu
            var movies = await _dataContext.Movies
                .Where(m => m.Title.Contains(movieName) && m.IsDeleted == false)
                .ToListAsync();

            if (movies.Count == 0)
            {
                return (false, "Không tìm thấy phim có tên này", null);
            }

            var movieIds = new List<string>();
            foreach (var m in movies)
            {
                movieIds.Add(m.MovieId);
            }

            var showtimes = await _dataContext.Showtimes
                .Include(s => s.Movie)
                .Include(s => s.Room)
                .ThenInclude(r => r.Cinema)
                .Where(s => movieIds.Contains(s.MovieId) && s.IsDeleted == false)
                .ToListAsync();

            var responseList = new List<ShowtimeResponseDTO>();

            foreach (var item in showtimes)
            {
                var dto = new ShowtimeResponseDTO();
                dto.ShowtimeId = item.ShowtimeId;
                dto.MovieId = item.MovieId;
                dto.MovieName = item.Movie.Title;
                dto.RoomId = item.RoomId;
                dto.RoomName = item.Room.RoomName;
                dto.CinemaName = item.Room.Cinema.Name;
                dto.StartTime = item.StartTime;
                dto.EndTime = item.EndTime;
                dto.VisualFormat = item.VisualFormat;
                dto.BaseTicketPrice = item.BaseTicketPrice;

                responseList.Add(dto);
            }

            return (true, "Tìm kiếm thành công", responseList);
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> GetShowtimeIdAsync(string roomId, DateTime startTime, string movieId)
        {
            var showtimes = await _dataContext.Showtimes
                .Where(s => s.RoomId == roomId && s.MovieId == movieId && s.IsDeleted == false)
                .ToListAsync();

            Showtime targetShowtime = null;

            foreach (var item in showtimes)
            {
                if (item.StartTime == startTime)
                {
                    targetShowtime = item;
                    break;
                }
            }

            if (targetShowtime != null)
            {
                return (true, "Lấy data thành công", targetShowtime.ShowtimeId);
            }
            else
            {
                return (false, "Lấy data thất bại, không có lịch chiếu phù hợp", null);
            }
        }
    }
}
