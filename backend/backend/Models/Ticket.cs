using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Ticket
    {
        [Key]
        public string TicketId { get; set; } = Guid.NewGuid().ToString();
        
        [Required] public string OrderId { get; set; }
        [Required] public string ShowtimeId { get; set; }
        [Required] public string SeatId { get; set; }
        
        [Column(TypeName = "decimal(18,2)")] public decimal Price { get; set; }

        [ForeignKey("OrderId")] public virtual Order Order { get; set; }
        [ForeignKey("ShowtimeId")] public virtual Showtime Showtime { get; set; }
        [ForeignKey("SeatId")] public virtual Seat Seat { get; set; }
    }
}