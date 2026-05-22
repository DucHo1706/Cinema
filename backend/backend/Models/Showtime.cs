using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Showtime
    {
        [Key]
        public string ShowtimeId { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string MovieId { get; set; }
        
        [Required]
        public string RoomId { get; set; }
        
        public DateTime StartTime { get; set; } 
        public DateTime EndTime { get; set; }
        [Required] [MaxLength(50)] public string VisualFormat { get; set; } 
        [Column(TypeName = "decimal(18,2)")] public decimal BaseTicketPrice { get; set; }
        public bool IsDeleted { get; set; } = false;

        [ForeignKey("MovieId")] public virtual Movie Movie { get; set; }
        [ForeignKey("RoomId")] public virtual Room Room { get; set; }
        public virtual ICollection<Ticket> Tickets { get; set; }
    }
}