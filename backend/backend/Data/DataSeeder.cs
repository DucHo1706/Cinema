using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace backend.Data
{
    public static class DataSeeder
    {
        public static async Task SeedDataAsync(DataContext context)
        {
            // 1. Tạo các Role mặc định nếu chưa có trong Database
            var roleNames = new[] 
            { 
                RoleConstants.Customer, 
                RoleConstants.Director, 
                RoleConstants.Cashier, 
                RoleConstants.MovieManager, 
                RoleConstants.TheaterManager, 
                RoleConstants.FacilitiesManager 
            };
            
            foreach (var roleName in roleNames)
            {
                if (!await context.Roles.AnyAsync(r => r.RoleName == roleName))
                {
                    context.Roles.Add(new Role { RoleName = roleName });
                }
            }
            await context.SaveChangesAsync();

            // 2. Tạo tài khoản Admin (Giám đốc) mặc định
            var directorRole = await context.Roles.FirstOrDefaultAsync(r => r.RoleName == RoleConstants.Director);
            
            if (directorRole != null && !await context.Users.AnyAsync(u => u.Email == "admin@cinema.com"))
            {
                var adminUser = new User
                {
                    Email = "admin@cinema.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    FullName = "Quản Trị Viên",
                    PhoneNumber = "0999999999",
                    RoleId = directorRole.RoleId,
                    IsDeleted = false
                };
                context.Users.Add(adminUser);
                await context.SaveChangesAsync();
            }

            // 3. Tạo dữ liệu mẫu cho Thể loại phim (Genres)
            var genres = new[] { "Hành Động", "Tâm Lý", "Kinh Dị", "Hài Hước", "Hoạt Hình", "Viễn Tưởng", "Lãng Mạn", "Kịch Tính" };
            foreach (var genreName in genres)
            {
                if (!await context.Genres.AnyAsync(g => g.Name == genreName))
                {
                    context.Genres.Add(new Genre { Name = genreName });
                }
            }
            await context.SaveChangesAsync();
        }
    }
}