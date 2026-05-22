using System;

namespace backend.DTOs.Responses
{
    public class ShowtimeResponseDTO
    {
        public string ShowtimeId { get; set; }
        public string MovieId { get; set; }
        public string MovieName { get; set; }
        public string RoomId { get; set; }
        public string RoomName { get; set; }
        public string CinemaName { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string VisualFormat { get; set; }
        public decimal BaseTicketPrice { get; set; }
    }
}