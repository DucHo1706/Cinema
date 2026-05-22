namespace backend.DTOs.Responses
{
    public class FoodResponseDTO
    {
        public string FoodId { get; set; }
        public string Name { get; set; }
        public string? ImageUrl { get; set; }
        public decimal Price { get; set; }
    }
}