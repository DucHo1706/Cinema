using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Requests
{
    public class CreateGenreRequestDTO
    {
        [Required]
        public string Name { get; set; }
    }

    public class UpdateGenreRequestDTO
    {
        [Required]
        public string Name { get; set; }
    }
}