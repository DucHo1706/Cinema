using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class OrderFood
    {
        public string OrderId { get; set; }
        public string FoodId { get; set; }
        
        public int Quantity { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal PriceEach { get; set; }

        [ForeignKey("OrderId")] public virtual Order Order { get; set; }
        [ForeignKey("FoodId")] public virtual Food Food { get; set; }
    }
}