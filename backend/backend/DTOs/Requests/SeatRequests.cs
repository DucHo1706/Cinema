using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Requests
{
    public class CreateSeatRequestDTO
    {
        [Required]
        public string RoomId { get; set; }
        [Required]
        public string SeatName { get; set; } 
        public string SeatType { get; set; } = "Standard"; 
    }

    public class UpdateSeatRequestDTO
    {
        public string? SeatName { get; set; }
        public string? SeatType { get; set; }
    }
}