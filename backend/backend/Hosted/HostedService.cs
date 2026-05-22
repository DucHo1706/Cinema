using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection; // Cần thiết cho IServiceProvider và CreateScope
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using backend.Enum; // Cần thiết cho các phương thức LINQ như ToList()

namespace backend.Hosted;

// Đổi tên HostedService thành MovieScheduleCleanupService cho rõ ràng
// Lưu ý: MyTimedHostedService trong ILogger và tên lớp là khác nhau,
// tôi sẽ giữ lại theo tên lớp là MovieScheduleCleanupService cho nhất quán.
public class HostedService : BackgroundService
{
    private readonly ILogger<HostedService> _logger;
    private readonly IServiceProvider _serviceProvider; // Thêm IServiceProvider
    private Timer? _timer = null; // Sử dụng nullable reference type cho _timer

    // Constructor: Thay DataContext bằng IServiceProvider
    public HostedService(ILogger<HostedService> logger, IServiceProvider serviceProvider)
    {
        _logger = logger;
        _serviceProvider = serviceProvider; // Lưu trữ service provider
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("MovieScheduleCleanupService đang chạy.");

        // Khởi tạo Timer để chạy mỗi 1 phút (60000 ms)
        // state: đối tượng được truyền vào callback (null vì không dùng)
        // dueTime: thời gian chờ trước khi chạy lần đầu (TimeSpan.Zero để chạy ngay lập tức)
        // period: khoảng thời gian giữa các lần chạy (TimeSpan.FromMinutes(1) = 1 phút)
        _timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromMinutes(1));

        return Task.CompletedTask;
    }

    private void DoWork(object? state) // Sử dụng nullable object cho state
    {
        _logger.LogInformation($"MovieScheduleCleanupService đang thực hiện kiểm tra tại: {DateTimeOffset.Now}");

        _ = Task.Run(async () =>
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var _context = scope.ServiceProvider.GetRequiredService<DataContext>();

                using (var transaction = await _context.Database.BeginTransactionAsync())
                {
                    try
                    {
                        // 1. Hủy các đơn hàng (Order) Pending quá hạn 5 phút
                        var pendingOrders = await _context.Set<Order>()
                            .Where(x => x.PaymentStatus == "Pending")
                            .ToListAsync();

                        bool hasOrderChanges = false;
                        foreach (var order in pendingOrders)
                        {
                            if ((DateTime.Now - order.CreatedAt).TotalMinutes >= 5)
                            {
                                order.PaymentStatus = "Failed";
                                hasOrderChanges = true;
                                _logger.LogInformation($"Đơn hàng {order.OrderId} đã bị hủy do quá hạn thanh toán.");
                            }
                        }
                        
                        if (hasOrderChanges)
                        {
                            _context.Set<Order>().UpdateRange(pendingOrders);
                        }

                        // 2. Đánh dấu các suất chiếu (Showtime) đã kết thúc
                        // VỚI DB MỚI: KHÔNG CẦN CHẠY VÒNG LẶP RESET isTaken = false cho ghế nữa! 
                        // (Vì ghế trống được tính tự động bằng cách trừ đi các vé - Ticket đã bán trong suất chiếu)
                        var expiredShowtimes = await _context.Set<Showtime>()
                            .Where(x => !x.IsDeleted && x.EndTime < DateTime.Now)
                            .ToListAsync();
                            
                        if (expiredShowtimes.Any())
                        {
                            foreach(var showtime in expiredShowtimes)
                            {
                                showtime.IsDeleted = true;
                                _logger.LogInformation($"Suất chiếu {showtime.ShowtimeId} đã kết thúc.");
                            }
                            _context.Set<Showtime>().UpdateRange(expiredShowtimes);
                        }

                        await _context.SaveChangesAsync(); 
                        await transaction.CommitAsync(); 
                        _logger.LogInformation("Hoàn tất dọn dẹp hệ thống với Database Schema mới.");
                    }
                    catch (Exception ex)
                    {
                        await transaction.RollbackAsync(); // Rollback transaction nếu có lỗi
                        _logger.LogError(ex, "Lỗi trong quá trình xử lý lịch chiếu kết thúc: {Message}", ex.Message);
                    }
                }
            }
        }).ConfigureAwait(false); // Thêm ConfigureAwait(false) để tránh deadlocks và tối ưu hiệu suất
    }

    public override Task StopAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("MovieScheduleCleanupService đang dừng.");

        _timer?.Change(Timeout.Infinite, 0); // Ngừng timer
        return base.StopAsync(stoppingToken);
    }

    public override void Dispose()
    {
        _timer?.Dispose(); // Giải phóng tài nguyên của timer
        base.Dispose();
    }
}