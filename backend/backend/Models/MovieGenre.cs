using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class MovieGenre
    {
        public string MovieId { get; set; }
        public string GenreId { get; set; }

        [ForeignKey("MovieId")] public virtual Movie Movie { get; set; }
        
        [ForeignKey("GenreId")] public virtual Genre Genre { get; set; }
    }
}