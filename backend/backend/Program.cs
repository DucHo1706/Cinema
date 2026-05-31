﻿﻿﻿using backend.Data;
using backend.Interface.Auth;
using backend.Services.Auth;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json.Serialization;
using backend.Services.MovieServices;
using backend;
using backend.Helper;
using backend.Hosted;
using backend.Interface.Account;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using backend.Interface.MovieInterface;
using backend.Interface.Schedule;
using backend.Services.Schedule;
using backend.Interface.BookingInterface;
using backend.Interface.CinemaInterface;
using backend.Services.BookingServices;
using backend.Interface.CommentInterface;
using backend.Interface.CloudinaryInterface;
using backend.Interface.EmailInterface;
using backend.Interface.FoodInterface;
using backend.Interface.StaffInterface;
using backend.Services.CloudinaryServices;
using backend.Interface.VnpayInterface;
using backend.Services.VnpayServices;
using backend.Services.AccountServices;
using backend.Services.BookingHistoryServices;
using backend.Services.CinemaServices;
using backend.Services.EmailServices;
using backend.Services.FoodServices;
using backend.Services.RevenueServices;
using backend.Services.RoomServices;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.Identity.Client;
using backend.Interface.GenreInterface;
using backend.Interface.RoomInterface;
using backend.Services.CommentService;
using backend.Services.GenreServices;
using backend.Services.StaffServices;
using backend.Interface.CloudinaryInterface;
using backend.Services.CloudinaryServices;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRequestTimeouts();


builder.Services.AddControllers().AddJsonOptions(x =>
                x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlServerOptionsAction: sqlOptions =>
        {
            // Bật tính năng tự động thử lại khi rớt mạng
            sqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5, // Thử lại tối đa 5 lần
                maxRetryDelay: TimeSpan.FromSeconds(30), // Thời gian chờ tối đa giữa các lần thử
                errorNumbersToAdd: null);
        }));

// Add thêm Policy

builder.Services.AddAuthorization(options =>
{
    // Đăng ký các Policy phân quyền dựa trên RoleConstants
    options.AddPolicy(RoleConstants.Customer, policy => policy.RequireRole(RoleConstants.Customer));
    options.AddPolicy(RoleConstants.Director, policy => policy.RequireRole(RoleConstants.Director));
    options.AddPolicy(RoleConstants.Cashier, policy => policy.RequireRole(RoleConstants.Cashier));
    options.AddPolicy(RoleConstants.MovieManager, policy => policy.RequireRole(RoleConstants.MovieManager));
    options.AddPolicy(RoleConstants.TheaterManager, policy => policy.RequireRole(RoleConstants.TheaterManager));
    options.AddPolicy(RoleConstants.FacilitiesManager, policy => policy.RequireRole(RoleConstants.FacilitiesManager));
});

// Add thêm JWT services

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters()
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Iss"],
            ValidAudience = builder.Configuration["Jwt:Aud"],
            IssuerSigningKey = new SymmetricSecurityKey(UTF8Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

// DI cua Price

// DI cua DIDataProtector

builder.Services.AddDataProtection()
    .SetApplicationName("MyCitizenIdApp"); // Rất khuyến nghị sử dụng

// Bước 2: Đăng ký một IDataProtector cụ thể với một purpose string
// Sử dụng AddSingleton vì IDataProtector thường an toàn cho thread và không cần tạo lại cho mỗi yêu cầu.
builder.Services.AddSingleton<IDataProtector>(serviceProvider => {
    // Lấy IDataProtectionProvider từ serviceProvider (đã được AddDataProtection() đăng ký)
    var dataProtectionProvider = serviceProvider.GetRequiredService<IDataProtectionProvider>();

    // Tạo IDataProtector với chuỗi mục đích cụ thể.
    // Chuỗi này PHẢI DUY NHẤT cho mục đích mã hóa này trong ứng dụng của bạn.
    return dataProtectionProvider.CreateProtector("CitizenIdEncryptionPurpose");
});
// Đăng ký toàn bộ Service theo chuẩn Database mới
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<IBookingHistoryService, BookingHistoryService>();
builder.Services.AddScoped<ICinemaService, CinemaService>();
builder.Services.AddScoped<ICommentService, CommentService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IFoodService, FoodService>();
builder.Services.AddScoped<IGenreService, GenreService>();
builder.Services.AddScoped<IMovieService, MovieService>();
builder.Services.AddScoped<IRoomService, RoomService>();
builder.Services.AddScoped<IScheduleServices, ScheduleServices>();
builder.Services.AddScoped<IStaffService, StaffService>();
builder.Services.AddScoped<ICloudinaryServices, CloudinaryService>();

// Cấu hình CORS để cho phép Frontend React gọi API mà không bị trình duyệt chặn
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

Console.WriteLine(builder.Configuration.GetConnectionString("DefaultConnection"));

var app = builder.Build();
app.UseCors("AllowAll");
using (var scoped = app.Services.CreateScope())
{
    var services = scoped.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<DataContext>();
        context.Database.Migrate();
        
        // Tự động nạp dữ liệu mẫu (Roles, Admin User)
        backend.Data.DataSeeder.SeedDataAsync(context).Wait();
    }
    catch (Exception ex) 
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating the database.");
    }
}
app.UseSwagger();
app.UseSwaggerUI();

app.UseAuthorization();

app.MapControllers();

app.Run();

namespace backend
{
    public static class RoleConstants
    {
        // Danh sách các Role trong hệ thống rạp phim
        public const string Customer = "Customer";
        public const string Director = "Director";
        public const string Cashier = "Cashier";
        public const string MovieManager = "MovieManager";
        public const string TheaterManager = "TheaterManager";
        public const string FacilitiesManager = "FacilitiesManager";
    }
}
