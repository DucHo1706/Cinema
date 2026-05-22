using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Requests
{
    public class CreateStaffRequestDTO
    {
        [Required] [EmailAddress] public string Email { get; set; }
        [Required] public string Password { get; set; }
        [Required] public string FullName { get; set; }
        public string? PhoneNumber { get; set; }
        
        [Required] public string RoleName { get; set; } // Ví dụ: TheaterManager, Cashier...
        public string? CinemaId { get; set; } // Thuộc rạp nào
    }

    public class UpdateStaffRequestDTO
    {
        public string? FullName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? RoleName { get; set; }
        public string? CinemaId { get; set; }
        public bool? IsDeleted { get; set; }
    }
}