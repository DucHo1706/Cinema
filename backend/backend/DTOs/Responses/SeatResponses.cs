namespace backend.DTOs.Responses
{
    public class SeatResponseDTO
    {
        public string SeatId { get; set; }
        public string RoomId { get; set; }
        public string SeatName { get; set; }
        public string SeatType { get; set; }
    }

    public class SeatAvailabilityResponseDTO : SeatResponseDTO
    {
        public bool IsAvailable { get; set; }
    }
}