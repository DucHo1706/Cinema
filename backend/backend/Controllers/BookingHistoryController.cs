using backend.Interface.BookingInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingHistoryController : ControllerBase
    {
        private readonly IBookingHistoryService _bookingHistoryService;

        public BookingHistoryController(IBookingHistoryService bookingHistoryService)
        {
            _bookingHistoryService = bookingHistoryService;
        }

        [HttpGet("getBookingHistory/{userID}")]
        [Authorize(Policy = "Customer")]
        public async Task<IActionResult> getBookingHistoryLists(string userID)
         {
            var result = await _bookingHistoryService.GetBookingHistoryAsync(userID);
            if (result.IsSuccess == false)
            {
                return BadRequest(new { message = result.Message });
            }
            return Ok(new { message = result.Message, data = result.Data });
        }

        [HttpGet("getBookingHistoryDetail/{orderID}")]
        [Authorize(Policy = "Customer")]
        public async Task<IActionResult> getBookingHistoryDetail(string orderID)
        {
            var result = await _bookingHistoryService.GetBookingHistoryDetailAsync(orderID);
            if (result.IsSuccess == false)
            {
                return NotFound(new { message = result.Message });
            }
            return Ok(new { message = result.Message, data = result.Data });
        }
    }
}
