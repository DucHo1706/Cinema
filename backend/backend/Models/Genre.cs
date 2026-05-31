using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Genre
    {
        [Key]
        public string GenreId { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }
        public string? Description { get; set; }

        public virtual ICollection<MovieGenre> MovieGenres { get; set; }
    }
}