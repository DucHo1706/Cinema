namespace backend.DTOs.Responses
{
    public class BookingResponseDTO
    {
        public string OrderId { get; set; }
        public string? PaymentUrl { get; set; } // Null nếu thanh toán tại quầy
        public decimal TotalPrice { get; set; }
    }
}