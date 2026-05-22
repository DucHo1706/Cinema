using System;
using System.Threading.Tasks;

namespace backend.Interface.RevenueInterface
{
    public interface IRevenueService
    {
        Task<(bool IsSuccess, string Message, object? Data)> GetRevenueByMovieAsync(DateTime? fromDate, DateTime? toDate);
        Task<(bool IsSuccess, string Message, object? Data)> GetRevenueByCinemaAsync(DateTime? fromDate, DateTime? toDate);
    }
}