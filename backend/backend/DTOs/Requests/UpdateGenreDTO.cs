using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Requests
{
    public class UpdateGenreDTO
    {
        [Required(ErrorMessage = "Tên thể loại không được để trống")]
        public string Name { get; set; } = null!;

        public string? Description { get; set; }
    }
}