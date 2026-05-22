using backend.DTOs.Requests;
using backend.Interface.BookingInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpPost("CreateBooking")]
        [Authorize(Policy = "Customer")]
        public async Task<IActionResult> CreateBooking([FromBody] BookingRequestDTO request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "Người dùng không hợp lệ." });
            }

            var result = await _bookingService.CreateBookingAsync(userId, request, HttpContext);
            if (result.IsSuccess == false)
            {
                return BadRequest(new { message = result.Message, data = result.Data });
            }
            return Ok(new { message = result.Message, data = result.Data });
        }
    }
}
