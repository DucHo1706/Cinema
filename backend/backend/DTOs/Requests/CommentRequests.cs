using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Requests
{
    public class CreateCommentRequestDTO
    {
        [Required]
        public string MovieId { get; set; }
        
        [Required]
        public string Content { get; set; }
    }

    public class UpdateCommentRequestDTO
    {
        [Required]
        public string Content { get; set; }
    }
}