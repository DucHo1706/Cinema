using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Requests
{
    public class CreateMovieRequestDTO
    {
        [Required] public string Title { get; set; }
        public string? Description { get; set; }
        public string? Director { get; set; }
        public string? Cast { get; set; }
        [Required] public int DurationMinutes { get; set; }
        [Required] public DateTime ReleaseDate { get; set; }
        public string? TrailerUrl { get; set; }
        public string? Language { get; set; }
        public string? AgeRating { get; set; }
        public IFormFile? PosterFile { get; set; } // Dùng IFormFile để nhận ảnh từ Client
        public List<string> GenreIds { get; set; } = new List<string>();
    }

    public class UpdateMovieRequestDTO
    {
        // Không kế thừa CreateMovieRequestDTO để tránh lỗi Swagger trùng lặp thuộc tính (shadowing)
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Director { get; set; }
        public string? Cast { get; set; }
        public int? DurationMinutes { get; set; }
        public DateTime? ReleaseDate { get; set; }
        public string? TrailerUrl { get; set; }
        public string? Language { get; set; }
        public string? AgeRating { get; set; }
        public IFormFile? PosterFile { get; set; }
        public List<string> GenreIds { get; set; } = new List<string>();
        
        public bool RemoveExistingPoster { get; set; } = false;
    }
}