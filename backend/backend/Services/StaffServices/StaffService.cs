using backend.Data;
using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Interface.StaffInterface;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Services.StaffServices
{
    public class StaffService : IStaffService
    {
        private readonly DataContext _context;

        public StaffService(DataContext context)
        {
            _context = context;
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> GetAllStaffsAsync()
        {
            var staffs = await _context.Users
                .Include(u => u.Role)
                .Include(u => u.Cinema)
                .Where(u => u.Role.RoleName != "Customer") // Lấy tất cả trừ khách hàng
                .Select(u => new StaffResponseDTO
                {
                    UserId = u.UserId,
                    Email = u.Email,
                    FullName = u.FullName,
                    PhoneNumber = u.PhoneNumber,
                    RoleName = u.Role.RoleName,
                    CinemaId = u.CinemaId,
                    CinemaName = u.Cinema != null ? u.Cinema.Name : null,
                    IsDeleted = u.IsDeleted
                }).ToListAsync();

            return (true, "Lấy danh sách nhân viên thành công", staffs);
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> CreateStaffAsync(CreateStaffRequestDTO request)
        {
            var isExist = await _context.Users.AnyAsync(u => u.Email == request.Email);
            if (isExist) return (false, "Email này đã được sử dụng", null);

            var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == request.RoleName);
            if (role == null) return (false, "Vai trò không hợp lệ", null);

            var staff = new User
            {
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                FullName = request.FullName,
                PhoneNumber = request.PhoneNumber,
                RoleId = role.RoleId,
                CinemaId = string.IsNullOrEmpty(request.CinemaId) ? null : request.CinemaId
            };

            await _context.Users.AddAsync(staff);
            await _context.SaveChangesAsync();

            return (true, "Tạo nhân viên thành công", staff.UserId);
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> UpdateStaffAsync(string userId, UpdateStaffRequestDTO request)
        {
            var staff = await _context.Users.FindAsync(userId);
            if (staff == null) return (false, "Không tìm thấy nhân viên", null);

            if (string.IsNullOrEmpty(request.FullName) == false) staff.FullName = request.FullName;
            if (string.IsNullOrEmpty(request.PhoneNumber) == false) staff.PhoneNumber = request.PhoneNumber;
            
            if (string.IsNullOrEmpty(request.RoleName) == false)
            {
                var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == request.RoleName);
                if (role != null) staff.RoleId = role.RoleId;
            }
            
            if (request.CinemaId != null) staff.CinemaId = request.CinemaId == "" ? null : request.CinemaId;
            
            if (request.IsDeleted.HasValue) staff.IsDeleted = request.IsDeleted.Value;

            _context.Users.Update(staff);
            await _context.SaveChangesAsync();

            return (true, "Cập nhật nhân viên thành công", null);
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> DeleteStaffAsync(string userId)
        {
            var staff = await _context.Users.FindAsync(userId);
            if (staff == null) return (false, "Không tìm thấy nhân viên", null);

            staff.IsDeleted = true; // Xóa mềm để giữ lịch sử Order
            _context.Users.Update(staff);
            await _context.SaveChangesAsync();

            return (true, "Vô hiệu hóa nhân viên thành công", null);
        }
    }
}