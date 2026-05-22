using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Cinema
    {
        [Key]
        public string CinemaId { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }
        
        [Required]
        [MaxLength(255)]
        public string Location { get; set; }
        [MaxLength(15)] public string? Hotline { get; set; }
        public string? Description { get; set; }
        public bool IsDeleted { get; set; } = false;
        public virtual ICollection<Room> Rooms { get; set; }
        public virtual ICollection<User> Staffs { get; set; }
    }
}