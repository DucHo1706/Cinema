using System;
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Requests
{
    public class ChangePasswordRequestDTO
    {
        [Required] public string OldPassword { get; set; }
        [Required] public string NewPassword { get; set; }
        [Required] public string ConfirmPassword { get; set; }
    }

    public class UpdateProfileRequestDTO
    {
        [Required] public string FullName { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
    }

    public class ResetPasswordRequestDTO
    {
        [Required] public string ResetToken { get; set; }
        [Required] public string NewPassword { get; set; }
        [Required] public string ReNewPassword { get; set; }
    }
}