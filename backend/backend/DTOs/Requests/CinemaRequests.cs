using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Requests
{
    public class CreateCinemaRequestDTO
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Location { get; set; }
        public string? Hotline { get; set; }
        public string? Description { get; set; }
    }

    public class UpdateCinemaRequestDTO
    {
        public string? Name { get; set; }
        public string? Location { get; set; }
        public string? Hotline { get; set; }
        public string? Description { get; set; }
    }
}