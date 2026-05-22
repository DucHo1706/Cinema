using backend.Data;
using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Interface.Account;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace backend.Services.AccountServices
{
    public class AccountService : IAccountService
    {
        private readonly DataContext _context;

        public AccountService(DataContext context)
        {
            _context = context;
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> GetAccountInfoAsync(string userId)
        {
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserId == userId && u.IsDeleted == false);

            if (user == null)
            {
                return (false, "Không tìm thấy thông tin người dùng", null);
            }

            var response = new AccountProfileResponseDTO
            {
                UserId = user.UserId,
                Email = user.Email,
                FullName = user.FullName,
                PhoneNumber = user.PhoneNumber,
                DateOfBirth = user.DateOfBirth,
                RoleName = user.Role.RoleName
            };

            return (true, "Lấy thông tin tài khoản thành công", response);
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> ChangePasswordAsync(string userId, ChangePasswordRequestDTO request)
        {
            if (request.NewPassword != request.ConfirmPassword)
            {
                return (false, "Mật khẩu mới và mật khẩu xác nhận không khớp", null);
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null || user.IsDeleted == true)
            {
                 return (false, "Không tìm thấy thông tin người dùng", null);
            }

            bool isOldPasswordValid = BCrypt.Net.BCrypt.Verify(request.OldPassword, user.PasswordHash);
            if (isOldPasswordValid == false)
            {
                return (false, "Mật khẩu cũ không chính xác", null);
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return (true, "Thay đổi mật khẩu thành công", null);
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> UpdateProfileAsync(string userId, UpdateProfileRequestDTO request)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null || user.IsDeleted == true)
            {
                return (false, "Không tìm thấy thông tin người dùng", null);
            }

            if (string.IsNullOrEmpty(request.FullName) == false) user.FullName = request.FullName;
            if (string.IsNullOrEmpty(request.PhoneNumber) == false) user.PhoneNumber = request.PhoneNumber;
            if (request.DateOfBirth.HasValue == true) user.DateOfBirth = request.DateOfBirth.Value;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return (true, "Cập nhật thông tin tài khoản thành công", null);
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> ResetPasswordAsync(ResetPasswordRequestDTO request)
        {
            if (request.NewPassword != request.ReNewPassword)
            {
                return (false, "Mật khẩu mới và mật khẩu xác nhận không khớp", null);
            }

            // Ở đây sau khi OTP được gửi, token thường là JWT mã hoá email. 
            // Tạm thời mock logic này vì phần Gửi Email/Quên Mật Khẩu đã được đơn giản hóa trong Schema mới.
            return (true, "Mật khẩu đã được đặt lại thành công", null);
        }
    }
}