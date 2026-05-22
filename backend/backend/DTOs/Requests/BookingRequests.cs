using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Requests
{
    public class BookingRequestDTO
    {
        [Required]
        public string ShowtimeId { get; set; }

        [Required]
        [MinLength(1, ErrorMessage = "Phải chọn ít nhất 1 ghế.")]
        public List<string> SeatIds { get; set; }

        public List<FoodItemDTO> FoodItems { get; set; } = new List<FoodItemDTO>();

        [Required]
        public string PaymentMethod { get; set; } // "VNPAY", "AtCounter"
    }

    public class FoodItemDTO
    {
        [Required]
        public string FoodId { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Số lượng phải lớn hơn 0.")]
        public int Quantity { get; set; }
    }
}