using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Seat
    {
        [Key]
        public string SeatId { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string RoomId { get; set; }
        
        [Required]
        [MaxLength(10)]
        public string SeatName { get; set; }
        [MaxLength(50)] public string SeatType { get; set; } = "Standard"; 
        public bool IsDeleted { get; set; } = false;

        [ForeignKey("RoomId")] public virtual Room Room { get; set; }
    }
}