using Microsoft.EntityFrameworkCore;
using backend.Models; // Đảm bảo using namespace chứa các Models của bạn

namespace backend.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        // 1. Quản lý Người dùng
        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }

        // 2. Quản lý Rạp
        public DbSet<Cinema> Cinemas { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Seat> Seats { get; set; }

        // 3. Quản lý Phim & Lịch chiếu
        public DbSet<Movie> Movies { get; set; }
        public DbSet<Genre> Genres { get; set; }
        public DbSet<MovieGenre> MovieGenres { get; set; }
        public DbSet<Showtime> Showtimes { get; set; }

        // 4. Quản lý Bán hàng
        public DbSet<Food> Foods { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<OrderFood> OrderFoods { get; set; }
        public DbSet<Comment> Comments { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Cấu hình Khóa chính tổng hợp (Composite Keys)
            modelBuilder.Entity<MovieGenre>().HasKey(mg => new { mg.MovieId, mg.GenreId });
            modelBuilder.Entity<OrderFood>().HasKey(of => new { of.OrderId, of.FoodId });

            // Unique Constraint: Một ghế trong một suất chiếu chỉ được tạo duy nhất một vé
            modelBuilder.Entity<Ticket>()
                .HasIndex(t => new { t.ShowtimeId, t.SeatId })
                .IsUnique();

            // Cấu hình Restrict Delete cho Ticket để tránh lỗi Multiple Cascade Paths trong SQL Server
            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.Showtime)
                .WithMany(s => s.Tickets)
                .HasForeignKey(t => t.ShowtimeId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.Seat)
                .WithMany()
                .HasForeignKey(t => t.SeatId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
