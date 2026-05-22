namespace backend.DTOs.Responses
{
    public class LoginResponseDTO
    {
        public string Token { get; set; }
        public string UserId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string RoleName { get; set; }
    }
}