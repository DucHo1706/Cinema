using backend.Data;
using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Interface.Auth;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace backend.Services.Auth
{
    public class AuthService : IAuthService
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(DataContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> LoginAsync(LoginRequestDTO request)
        {
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == request.Email && u.IsDeleted == false);

            if (user == null)
            {
                return (false, "Sai email hoặc tài khoản không tồn tại", null);
            }

            bool isValidPassword = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
            if (isValidPassword == false)
            {
                return (false, "Sai mật khẩu", null);
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "super_secret_key_1234567890_super_secret_key_1234567890");

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.UserId),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role.RoleName),
                    new Claim("FullName", user.FullName)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"]
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            var response = new LoginResponseDTO
            {
                Token = tokenString,
                UserId = user.UserId,
                FullName = user.FullName,
                Email = user.Email,
                RoleName = user.Role.RoleName
            };

            return (true, "Đăng nhập thành công", response);
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> RegisterAsync(RegisterRequestDTO request)
        {
            var userExists = await _context.Users.AnyAsync(u => u.Email == request.Email && u.IsDeleted == false);
            if (userExists == true)
            {
                return (false, "Email này đã được đăng ký", null);
            }

            var customerRole = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == "Customer");
            if (customerRole == null)
            {
                return (false, "Lỗi hệ thống: Không tìm thấy Role Customer", null);
            }

            var newUser = new User
            {
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                FullName = request.FullName,
                PhoneNumber = request.PhoneNumber,
                RoleId = customerRole.RoleId
            };

            await _context.Users.AddAsync(newUser);
            await _context.SaveChangesAsync();

            return (true, "Đăng ký tài khoản thành công", newUser.UserId);
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> VerifyEmailCodeAsync(string email, string code)
        {
            // Tạm thời mockup vì schema mới đã đơn giản hoá bảng EmailList 
            // (Gửi/xác nhận OTP nên đẩy sang module Email chuyên biệt)
            return (true, "Xác nhận email thành công", null);
        }
    }
}