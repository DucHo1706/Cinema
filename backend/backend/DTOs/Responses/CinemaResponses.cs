namespace backend.DTOs.Responses
{
    public class CinemaResponseDTO
    {
        public string CinemaId { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public string? Hotline { get; set; }
        public string? Description { get; set; }
    }

    public class CinemaBasicResponseDTO
    {
        public string CinemaId { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
    }
}