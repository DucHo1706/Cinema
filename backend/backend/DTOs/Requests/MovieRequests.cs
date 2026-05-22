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

    public class UpdateMovieRequestDTO : CreateMovieRequestDTO
    {
        // Kế thừa các thuộc tính từ Create, nhưng bỏ yêu cầu [Required] vì có thể chỉ cập nhật 1 số trường
        public new string? Title { get; set; }
        public new int? DurationMinutes { get; set; }
        public new DateTime? ReleaseDate { get; set; }
        
        // Cờ đánh dấu nếu client muốn xóa ảnh cũ mà không upload ảnh mới (nếu cần)
        public bool RemoveExistingPoster { get; set; } = false;
    }
}