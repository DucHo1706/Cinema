using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Order
    {
        [Key]
        public string OrderId { get; set; } = Guid.NewGuid().ToString();
        
        public string? UserId { get; set; } 
        [MaxLength(100)] public string? CustomerEmail { get; set; }
        [Column(TypeName = "decimal(18,2)")] public decimal TotalPrice { get; set; }
        [MaxLength(50)] public string? PaymentMethod { get; set; }
        [MaxLength(50)] public string PaymentStatus { get; set; } = "Pending";
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [ForeignKey("UserId")]
        public virtual User? User { get; set; }

        public virtual ICollection<Ticket> Tickets { get; set; }
        public virtual ICollection<OrderFood> OrderFoods { get; set; }
    }
}