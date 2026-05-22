using backend.DTOs.Requests;
using backend.Interface.CommentInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly ICommentService _commentService;

        public CommentController(ICommentService commentService)
        {
            _commentService = commentService;
        }

        [HttpGet("GetCommentsByMovie/{movieId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCommentsByMovie(string movieId)
        {
            var result = await _commentService.GetCommentsByMovieAsync(movieId);
            if (result.IsSuccess == false)
            {
                return BadRequest(new { message = result.Message });
            }
            return Ok(new { message = result.Message, data = result.Data });
        }

        [HttpPost("AddComment")]
        [Authorize]
        public async Task<IActionResult> AddComment([FromBody] CreateCommentRequestDTO request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "Người dùng không hợp lệ" });
            }

            var result = await _commentService.AddCommentAsync(userId, request);
            if (result.IsSuccess == false)
            {
                return BadRequest(new { message = result.Message });
            }
            return Ok(new { message = result.Message, data = result.Data });
        }

        [HttpPut("UpdateComment/{commentId}")]
        [Authorize]
        public async Task<IActionResult> UpdateComment(string commentId, [FromBody] UpdateCommentRequestDTO request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "Người dùng không hợp lệ" });
            }

            var result = await _commentService.UpdateCommentAsync(userId, commentId, request);
            if (result.IsSuccess == false)
            {
                return BadRequest(new { message = result.Message });
            }
            return Ok(new { message = result.Message });
        }

        [HttpDelete("DeleteComment/{commentId}")]
        [Authorize]
        public async Task<IActionResult> DeleteComment(string commentId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized(new { message = "Người dùng không hợp lệ" });

            var result = await _commentService.DeleteCommentAsync(userId, commentId);
            if (result.IsSuccess == false)
            {
                return BadRequest(new { message = result.Message });
            }
            return Ok(new { message = result.Message });
        }
    }
}