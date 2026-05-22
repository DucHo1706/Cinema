using backend.Interface.CinemaInterface;
using backend.DTOs.Requests;
using backend.DTOs.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CinemaController : ControllerBase
{
    private readonly ICinemaService _cinemaService;

    public CinemaController(ICinemaService cinemaService)
    {
        _cinemaService = cinemaService;
    }

    [HttpGet("getCinemaInfoBookingService")]
    public async Task<IActionResult> GetCinemaInfoBookingService([FromQuery] string movieId, [FromQuery] string? visualFormat)
    {
        // Kiểm tra đầu vào cơ bản
        if (string.IsNullOrEmpty(movieId))
        {
            return BadRequest(new { message = "MovieID không được để trống." });
        }

        var result = await _cinemaService.GetCinemasForBookingAsync(movieId, visualFormat);
        
        if (result.IsSuccess == false)
        {
            return NotFound(new { message = result.Message });
        }
        return Ok(new { message = result.Message, data = result.Data });
    }

    // Thêm rạp chiếu phim mới
    [HttpPost("addCinema")]
    [Authorize(Policy = "FacilitiesManager")]
    public async Task<IActionResult> AddCinema([FromBody] CreateCinemaRequestDTO request)
    {
        if (request == null)
        {
            return BadRequest(new { message = "Dữ liệu rạp chiếu không được để trống." });
        }

        var result = await _cinemaService.AddCinemaAsync(request);

        if (result.IsSuccess == false)
        {
            return BadRequest(new { message = result.Message });
        }
        return Ok(new { message = result.Message, data = result.Data });
    }

    // Chỉnh sửa thông tin rạp chiếu phim
    [HttpPut("editCinema/{cinemaId}")]
    [Authorize(Policy = "FacilitiesManager")]
    public async Task<IActionResult> EditCinema(string cinemaId, [FromBody] UpdateCinemaRequestDTO request)
    {
        if (string.IsNullOrEmpty(cinemaId))
        {
            return BadRequest(new { message = "ID rạp không được để trống." });
        }
        if (request == null)
        {
            return BadRequest(new { message = "Dữ liệu rạp chiếu không được để trống." });
        }

        var result = await _cinemaService.EditCinemaAsync(cinemaId, request);

        if (result.IsSuccess == false)
        {
            return BadRequest(new { message = result.Message });
        }
        return Ok(new { message = result.Message });
    }

    // Xóa rạp chiếu phim (soft delete)
    [HttpDelete("deleteCinema/{cinemaId}")]
    [Authorize(Policy = "FacilitiesManager")]
    public async Task<IActionResult> DeleteCinema(string cinemaId)
    {
        if (string.IsNullOrEmpty(cinemaId))
        {
            return BadRequest(new { message = "ID rạp không được để trống." });
        }

        var result = await _cinemaService.DeleteCinemaAsync(cinemaId);

        if (result.IsSuccess == false)
        {
            return BadRequest(new { message = result.Message });
        }
        return Ok(new { message = result.Message });
    }
    
    // Lấy danh sách rạp chiếu phim
    [HttpGet("getCinemaList")]
    public async Task<IActionResult> GetCinemaList()
    {
        var result = await _cinemaService.GetCinemaListAsync();

        if (result.IsSuccess == false)
        {
            return BadRequest(new { message = result.Message });
        }
        return Ok(new { message = result.Message, data = result.Data });
    }

    // Lấy chi tiết rạp chiếu phim theo ID
    [HttpGet("getCinemaDetail/{cinemaId}")]
    public async Task<IActionResult> GetCinemaDetail(string cinemaId)
    {
        if (string.IsNullOrEmpty(cinemaId))
        {
            return BadRequest(new { message = "ID rạp không được để trống." });
        }

        var result = await _cinemaService.GetCinemaDetailAsync(cinemaId);

        if (result.IsSuccess == false)
        {
            return NotFound(new { message = result.Message }); 
        }
        return Ok(new { message = result.Message, data = result.Data });
    }
}