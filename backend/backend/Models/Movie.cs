using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Movie
    {
        [Key]
        public string MovieId { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; }
        
        public string? Description { get; set; }
        [MaxLength(100)] public string? Director { get; set; }
        [MaxLength(500)] public string? Cast { get; set; }
        public int DurationMinutes { get; set; }
        public DateTime ReleaseDate { get; set; }
        [MaxLength(500)] public string? PosterUrl { get; set; }
        [MaxLength(500)] public string? TrailerUrl { get; set; }
        [MaxLength(50)] public string? Language { get; set; }
        [MaxLength(10)] public string? AgeRating { get; set; } 
        public bool IsDeleted { get; set; } = false;

        public virtual ICollection<MovieGenre> MovieGenres { get; set; }
        public virtual ICollection<Showtime> Showtimes { get; set; }
    }
}