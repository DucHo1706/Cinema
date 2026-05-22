using backend.DTOs.Requests;
using backend.DTOs.Responses;
using System;
using System.Threading.Tasks;

namespace backend.Interface.CinemaInterface
{
    public interface ICinemaService
    {
        Task<(bool IsSuccess, string Message, object? Data)> GetCinemasForBookingAsync(string movieId, string visualFormat);
        Task<(bool IsSuccess, string Message, object? Data)> AddCinemaAsync(CreateCinemaRequestDTO request);
        Task<(bool IsSuccess, string Message, object? Data)> EditCinemaAsync(string cinemaId, UpdateCinemaRequestDTO request);
        Task<(bool IsSuccess, string Message, object? Data)> DeleteCinemaAsync(string cinemaId);
        Task<(bool IsSuccess, string Message, object? Data)> GetCinemaListAsync();
        Task<(bool IsSuccess, string Message, object? Data)> GetCinemaDetailAsync(string cinemaId);
    }
}