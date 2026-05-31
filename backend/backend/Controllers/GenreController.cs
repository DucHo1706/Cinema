using backend.DTOs.Requests;
using backend.Interface.GenreInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GenreController : ControllerBase
    {
        private readonly IGenreService _genreService;

        public GenreController(IGenreService genreService)
        {
            _genreService = genreService;
        }

        [HttpGet]
        [AllowAnonymous] // Ai cũng có thể xem danh sách thể loại
        public async Task<IActionResult> GetAllGenres()
        {
            var result = await _genreService.GetAllGenresAsync();
            
            if (!result.IsSuccess)
                return BadRequest(new { status = "Error", message = result.Message });

            return Ok(new { status = "Success", message = result.Message, data = result.Data });
        }

        [HttpPost]
        [Authorize(Roles = RoleConstants.MovieManager)] // Phải là MovieManager hoặc Director mới được Thêm
        public async Task<IActionResult> CreateGenre([FromBody] CreateGenreRequestDTO request)
        {
            var result = await _genreService.CreateGenreAsync(request);
            if (!result.IsSuccess) return BadRequest(new { status = "Error", message = result.Message });
            
            return Ok(new { status = "Success", message = result.Message, data = result.Data });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = RoleConstants.MovieManager)]
        public async Task<IActionResult> DeleteGenre(string id)
        {
            var result = await _genreService.DeleteGenreAsync(id);
            if (!result.IsSuccess) return BadRequest(new { status = "Error", message = result.Message });
            
            return Ok(new { status = "Success", message = result.Message });
        }
    }
}