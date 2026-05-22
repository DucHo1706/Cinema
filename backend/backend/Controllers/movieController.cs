using backend.Interface.MovieInterface;
using backend.DTOs.Requests;
using backend.DTOs.Responses;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class movieController : ControllerBase
    {
        private readonly IMovieService _movieService;

        public movieController(IMovieService movieService)
        {
            _movieService = movieService;
        }

        [HttpPost("createMovie")]
        [Authorize(Policy = "MovieManager")]
        public async Task<IActionResult> createMovie([FromForm] CreateMovieRequestDTO request) 
        {
            var result = await _movieService.CreateMovieAsync(request);
            if (result.IsSuccess == false)
            {
                return BadRequest(new { message = result.Message });
            }
            return Ok(new { message = result.Message, data = result.Data });
        }

        [HttpPatch("editMovie")]
        [Authorize(Policy = "MovieManager")]
        public async Task<IActionResult> editMovie([FromQuery] string movieID, [FromForm] UpdateMovieRequestDTO request)
        {
            var result = await _movieService.UpdateMovieAsync(movieID, request);
            if (result.IsSuccess == false)
            {
                return BadRequest(new { message = result.Message });
            }
            return Ok(new { message = result.Message });
        }

        [HttpGet("getMovieDetail/{movieID}")]
        public async Task<IActionResult> getMovieDetail(string movieID)
        {
            var result = await _movieService.GetMovieDetailAsync(movieID);
            if (result.IsSuccess == false)
            {
                return BadRequest(new { message = result.Message });
            }
            return Ok(new { message = result.Message, data = result.Data });
        }

        [HttpDelete("DeleteMovie/{Id}")]
        [Authorize(Policy = "MovieManager")]
        public async Task<IActionResult> deleteMovie(string Id)
        {
            var result = await _movieService.DeleteMovieAsync(Id);
            if (result.IsSuccess == false)
            {
                return BadRequest(new { message = result.Message });
            }
            return Ok(new { message = result.Message });
        }

        [HttpGet("getAllMoviesPagniation/{page}")]
        public async Task<IActionResult> getAllMoviesPagniation(int page)
        {
            if (page <= 0) return NotFound(new { message = "Sorry Page not found" });

            var result = await _movieService.GetMoviesPaginationAsync(page);
            return Ok(new { message = result.Message, data = result.Data });
        }
        
        [HttpGet("SearchAllMovie")]
        public async Task<IActionResult> SearchMoviePagination(string movieName, int page)
        {
            var result = await _movieService.SearchMoviesPaginationAsync(movieName, page);
            return Ok(new { message = result.Message, data = result.Data });
        }

        [HttpGet("GetInShowedMovie")]
        public async Task<IActionResult> GetInShowedMovie()
        {
            var result = await _movieService.GetShowingMoviesTake5Async();
            return Ok(new { message = result.Message, data = result.Data });
        }

        [HttpGet("GetUnShowedMovie")]
        public async Task<IActionResult> GetUnShowedMovie()
        {
            var result = await _movieService.GetUpcomingMoviesTake5Async();
            return Ok(new { message = result.Message, data = result.Data });
        }
    }
}
