using System;

namespace backend.DTOs.Responses
{
    public class CommentResponseDTO
    {
        public string CommentId { get; set; }
        public string MovieId { get; set; }
        public string UserId { get; set; }
        public string FullName { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}