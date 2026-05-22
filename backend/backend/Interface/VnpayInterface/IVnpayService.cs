using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace backend.Interface.VnpayInterface
{
    public interface IVnpayService
    {
        Task<(bool IsSuccess, string Message, object? Data)> PaymentCallbackAsync(IQueryCollection collections);
    }
}