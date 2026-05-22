namespace backend.DTOs.Responses
{
    public class StaffResponseDTO
    {
        public string UserId { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string? PhoneNumber { get; set; }
        public string RoleName { get; set; }
        public string? CinemaId { get; set; }
        public string? CinemaName { get; set; }
        public bool IsDeleted { get; set; }
    }
}