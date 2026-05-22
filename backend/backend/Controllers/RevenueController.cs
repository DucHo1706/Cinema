using backend.Interface.RevenueInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RevenueController : ControllerBase
    {
        private readonly IRevenueService _revenueService;

        public RevenueController(IRevenueService revenueService)
        {
            _revenueService = revenueService;
        }

        [HttpGet("GetRevenueByMovie")]
        [Authorize(Policy = "Director")]
        public async Task<IActionResult> GetRevenueByMovie([FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
        {
            var result = await _revenueService.GetRevenueByMovieAsync(fromDate, toDate);
            if (result.IsSuccess == false) return BadRequest(new { message = result.Message });
            return Ok(new { message = result.Message, data = result.Data });
        }

        [HttpGet("GetRevenueByCinema")]
        [Authorize(Policy = "Director")]
        public async Task<IActionResult> GetRevenueByCinema([FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
        {
            var result = await _revenueService.GetRevenueByCinemaAsync(fromDate, toDate);
            if (result.IsSuccess == false) return BadRequest(new { message = result.Message });
            return Ok(new { message = result.Message, data = result.Data });
        }
    }
}