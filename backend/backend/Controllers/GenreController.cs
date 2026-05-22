using backend.DTOs.Requests;
using backend.Interface.GenreInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GenreController : ControllerBase
    {
        private readonly IGenreService _genreService;

        public GenreController(IGenreService genreService)
        {
            _genreService = genreService;
        }

        [HttpGet("GetAllGenres")]
        public async Task<IActionResult> GetAllGenres()
        {
            var result = await _genreService.GetAllGenresAsync();
            if (result.IsSuccess == false) return BadRequest(new { message = result.Message });
            return Ok(new { message = result.Message, data = result.Data });
        }

        [HttpPost("CreateGenre")]
        [Authorize(Policy = "MovieManager")]
        public async Task<IActionResult> CreateGenre([FromBody] CreateGenreRequestDTO request)
        {
            var result = await _genreService.CreateGenreAsync(request);
            if (result.IsSuccess == false) return BadRequest(new { message = result.Message });
            return Ok(new { message = result.Message, data = result.Data });
        }

        [HttpPut("UpdateGenre/{genreId}")]
        [Authorize(Policy = "MovieManager")]
        public async Task<IActionResult> UpdateGenre(string genreId, [FromBody] UpdateGenreRequestDTO request)
        {
            var result = await _genreService.UpdateGenreAsync(genreId, request);
            if (result.IsSuccess == false) return BadRequest(new { message = result.Message });
            return Ok(new { message = result.Message });
        }

        [HttpDelete("DeleteGenre/{genreId}")]
        [Authorize(Policy = "MovieManager")]
        public async Task<IActionResult> DeleteGenre(string genreId)
        {
            var result = await _genreService.DeleteGenreAsync(genreId);
            if (result.IsSuccess == false) return BadRequest(new { message = result.Message });
            return Ok(new { message = result.Message });
        }
    }
}