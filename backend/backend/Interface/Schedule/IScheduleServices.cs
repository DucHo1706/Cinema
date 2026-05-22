using System;
using System.Threading.Tasks;
using backend.DTOs.Requests;
using backend.DTOs.Responses;

namespace backend.Interface.Schedule
{
    public interface IScheduleServices
    {
        Task<(bool IsSuccess, string Message, object? Data)> AddShowtimeAsync(CreateShowtimeDTO request);
        Task<(bool IsSuccess, string Message, object? Data)> EditShowtimeAsync(string showtimeId, EditShowtimeDTO request);
        Task<(bool IsSuccess, string Message, object? Data)> DeleteShowtimeAsync(string showtimeId);
        Task<(bool IsSuccess, string Message, object? Data)> GetShowtimesByMovieNameAsync(string movieName);
        Task<(bool IsSuccess, string Message, object? Data)> GetShowtimeIdAsync(string roomId, DateTime startTime, string movieId);
    }
}