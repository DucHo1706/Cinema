using backend.Interface.EmailInterface;
using System.Threading.Tasks;

namespace backend.Services.EmailServices
{
    public class EmailService : IEmailService
    {
        public async Task<(bool IsSuccess, string Message, object? Data)> SendOtpAsync(string email)
        {
            // Tạm thời mock logic gửi Email.
            // Bạn có thể triển khai SMTP (như MailKit, SendGrid) vào đây sau.
            return (true, $"Đã gửi mã OTP đến email {email} thành công.", null);
        }
    }
}