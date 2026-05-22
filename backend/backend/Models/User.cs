using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class User
    {
        [Key]
        public string UserId { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        [MaxLength(100)]
        public string Email { get; set; }
        
        [Required]
        [MaxLength(255)]
        public string PasswordHash { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string FullName { get; set; }
        
        [MaxLength(15)]
        public string? PhoneNumber { get; set; }
        
        public DateTime? DateOfBirth { get; set; }
        public string? CinemaId { get; set; } 
        
        [Required]
        public string RoleId { get; set; }
        public bool IsDeleted { get; set; } = false;

        [ForeignKey("RoleId")] public virtual Role Role { get; set; }
        [ForeignKey("CinemaId")] public virtual Cinema? Cinema { get; set; }
        public virtual ICollection<Order> Orders { get; set; }
    }
}