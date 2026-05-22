using System.Threading.Tasks;

namespace backend.Interface.EmailInterface
{
    public interface IEmailService
    {
        Task<(bool IsSuccess, string Message, object? Data)> SendOtpAsync(string email);
    }
}