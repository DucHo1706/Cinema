using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Room
    {
        [Key]
        public string RoomId { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string CinemaId { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string RoomName { get; set; }
        
        public bool IsDeleted { get; set; } = false;
        [ForeignKey("CinemaId")] public virtual Cinema Cinema { get; set; }
        public virtual ICollection<Seat> Seats { get; set; }
        public virtual ICollection<Showtime> Showtimes { get; set; }
    }
}