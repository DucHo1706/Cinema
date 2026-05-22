using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Requests
{
    public class LoginRequestDTO
    {
        [Required] public string Email { get; set; }
        [Required] public string Password { get; set; }
    }

    public class RegisterRequestDTO
    {
        [Required] [EmailAddress] public string Email { get; set; }
        [Required] public string Password { get; set; }
        [Required] public string FullName { get; set; }
        public string? PhoneNumber { get; set; }
    }
}