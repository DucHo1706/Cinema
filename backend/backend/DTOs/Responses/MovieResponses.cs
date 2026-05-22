using System;
using System.Collections.Generic;

namespace backend.DTOs.Responses
{
    public class MovieResponseDTO
    {
        public string MovieId { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public string? Director { get; set; }
        public string? Cast { get; set; }
        public int DurationMinutes { get; set; }
        public DateTime ReleaseDate { get; set; }
        public string? PosterUrl { get; set; }
        public string? TrailerUrl { get; set; }
        public string? Language { get; set; }
        public string? AgeRating { get; set; }
        public List<string> Genres { get; set; } = new List<string>();
    }

    public class PaginationResponseDTO<T>
    {
        public List<T> Items { get; set; } = new List<T>();
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int TotalCount { get; set; }
    }
}