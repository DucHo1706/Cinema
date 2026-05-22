using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Food
    {
        [Key]
        public string FoodId { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }
        
        [MaxLength(500)]
        public string? ImageUrl { get; set; }
        [Column(TypeName = "decimal(18,2)")] public decimal Price { get; set; }
        public bool IsDeleted { get; set; } = false;
    }
}