using System;
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Requests
{
    public class CreateShowtimeDTO
    {
        [Required] public string MovieId { get; set; }
        [Required] public string RoomId { get; set; }
        [Required] public DateTime StartTime { get; set; }
        [Required] public DateTime EndTime { get; set; }
        [Required] public string VisualFormat { get; set; }
        [Required] public decimal BaseTicketPrice { get; set; }
    }

    public class EditShowtimeDTO
    {
        public string? MovieId { get; set; }
        public string? RoomId { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public string? VisualFormat { get; set; }
        public decimal? BaseTicketPrice { get; set; }
    }
}