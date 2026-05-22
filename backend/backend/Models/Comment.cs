using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Comment
    {
        [Key]
        public string CommentId { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string MovieId { get; set; }
        
        [Required]
        public string UserId { get; set; }
        
        [Required]
        [MaxLength(500)]
        public string Content { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [ForeignKey("MovieId")]
        public virtual Movie Movie { get; set; }
        
        [ForeignKey("UserId")]
        public virtual User User { get; set; }
    }
}