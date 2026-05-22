namespace backend.DTOs.Responses
{
    public class RevenueByMovieResponseDTO
    {
        public string MovieId { get; set; }
        public string MovieTitle { get; set; }
        public decimal TotalRevenue { get; set; }
        public int TotalTicketsSold { get; set; }
    }

    public class RevenueByCinemaResponseDTO
    {
        public string CinemaId { get; set; }
        public string CinemaName { get; set; }
        public decimal TotalRevenue { get; set; }
        public int TotalTicketsSold { get; set; }
    }
}