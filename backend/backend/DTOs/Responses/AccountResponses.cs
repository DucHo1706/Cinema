using System;

namespace backend.DTOs.Responses
{
    public class AccountProfileResponseDTO
    {
        public string UserId { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string RoleName { get; set; }
    }
}