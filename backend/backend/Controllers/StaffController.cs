using backend.DTOs.Requests;
using backend.Interface.StaffInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "Director")] // Chỉ Giám đốc/Admin mới có quyền quản lý nhân sự
    public class StaffController : ControllerBase
    {
        private readonly IStaffService _staffService;

        public StaffController(IStaffService staffService)
        {
            _staffService = staffService;
        }

        [HttpGet("GetAllStaffs")]
        public async Task<IActionResult> GetAllStaffs()
        {
            var result = await _staffService.GetAllStaffsAsync();
            if (result.IsSuccess == false) return BadRequest(new { message = result.Message });
            return Ok(new { message = result.Message, data = result.Data });
        }

        [HttpPost("CreateStaff")]
        public async Task<IActionResult> CreateStaff([FromBody] CreateStaffRequestDTO request)
        {
            var result = await _staffService.CreateStaffAsync(request);
            if (result.IsSuccess == false) return BadRequest(new { message = result.Message });
            return Ok(new { message = result.Message, data = result.Data });
        }

        [HttpPut("UpdateStaff/{userId}")]
        public async Task<IActionResult> UpdateStaff(string userId, [FromBody] UpdateStaffRequestDTO request)
        {
            var result = await _staffService.UpdateStaffAsync(userId, request);
            if (result.IsSuccess == false) return BadRequest(new { message = result.Message });
            return Ok(new { message = result.Message });
        }

        [HttpDelete("DeleteStaff/{userId}")]
        public async Task<IActionResult> DeleteStaff(string userId)
        {
            var result = await _staffService.DeleteStaffAsync(userId);
            if (result.IsSuccess == false) return BadRequest(new { message = result.Message });
            return Ok(new { message = result.Message });
        }
    }
}