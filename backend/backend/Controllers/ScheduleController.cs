using backend.Interface.Schedule;
using backend.DTOs.Requests;
using backend.DTOs.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScheduleController : ControllerBase
    {
        private readonly IScheduleServices _scheduleServices;
        
        public ScheduleController(IScheduleServices scheduleServices)
        {
            _scheduleServices = scheduleServices;
        }

        [HttpPost("addSchedule")]
        [Authorize(Policy = "TheaterManager")]
        public async Task<IActionResult> AddSchedule([FromBody] CreateShowtimeDTO request)
        {
            var result = await _scheduleServices.AddShowtimeAsync(request);
            if (result.IsSuccess == false)
            {
                return BadRequest(new { message = result.Message });
            }
            return Ok(new { message = result.Message, data = result.Data });
        }

        [HttpPatch("editSchedule/{id}")]
        [Authorize(Policy = "TheaterManager")]
        public async Task<IActionResult> EditSchedule(string id, [FromBody] EditShowtimeDTO request)
        {
            var result = await _scheduleServices.EditShowtimeAsync(id, request);
            if (result.IsSuccess == false)
            {
                return BadRequest(new { message = result.Message });
            }
            return Ok(new { message = result.Message });
        }

        [HttpDelete("removeSchedule/{id}")]
        [Authorize(Policy = "TheaterManager")]
        public async Task<IActionResult> RemoveSchedule(string id)
        {
            var result = await _scheduleServices.DeleteShowtimeAsync(id);
            if (result.IsSuccess == false) 
            {
                return BadRequest(new { message = result.Message });
            }
            return Ok(new { message = result.Message });
        }

        [HttpGet("getScheduleByName")]
        public async Task<IActionResult> GetScheduleByName([FromQuery] string name)
        {
            var result = await _scheduleServices.GetShowtimesByMovieNameAsync(name);
            if (result.IsSuccess == false)
            {
                return BadRequest(new { message = result.Message });
            }
            return Ok(new { message = result.Message, data = result.Data });
        }

        [HttpGet("getMovieScheduleId")]
        public async Task<IActionResult> GetMovieScheduleId(string roomId, DateTime startTime, string movieId)
        {
            var result = await _scheduleServices.GetShowtimeIdAsync(roomId, startTime, movieId);
            if (result.IsSuccess == true)
            {
                return Ok(new { message = result.Message, data = result.Data });
            }
            return NotFound(new { message = result.Message });
        }
    }
}
