using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Requests
{
    public class CreateFoodRequestDTO
    {
        [Required] public string Name { get; set; }
        public string? ImageUrl { get; set; }
        [Required] public decimal Price { get; set; }
    }

    public class UpdateFoodRequestDTO
    {
        public string? Name { get; set; }
        public string? ImageUrl { get; set; }
        public decimal? Price { get; set; }
    }
}