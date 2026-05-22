using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Requests
{
    public class CreateRoomRequestDTO
    {
        [Required]
        public string CinemaId { get; set; }
        [Required]
        public string RoomName { get; set; }
    }

    public class UpdateRoomRequestDTO
    {
        [Required]
        public string RoomName { get; set; }
    }
}