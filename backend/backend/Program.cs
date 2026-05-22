using backend.Data;
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

builder.Services.AddAuthorization(
    options =>
    {
        options.AddPolicy("Customer", policy =>
        {
            policy.RequireRole("Customer");
        });
    });

builder.Services.AddAuthorization
(options => 
options.AddPolicy
("Director", policy => policy.RequireRole("Director")));

builder.Services.AddAuthorization
    (options =>
    options.AddPolicy("Cashier", policy =>
    policy.RequireRole("Cashier")));

builder.Services.AddAuthorization
    (options =>
    options.AddPolicy("MovieManager", policy =>
    policy.RequireRole("MovieManager")));

builder.Services.AddAuthorization
    (options =>
    options.AddPolicy("TheaterManager", policy =>
    policy.RequireRole("TheaterManager")));


builder.Services.AddAuthorization
    (options =>
    options.AddPolicy("FacilitiesManager", policy =>
    policy.RequireRole("FacilitiesManager")));

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



