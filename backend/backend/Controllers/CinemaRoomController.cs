using backend.Interface.RoomInterface;
using backend.DTOs.Requests;
using backend.DTOs.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace backend.Controllers; 

[ApiController]
[Route("api/[controller]")] // URL cơ sở cho controller này sẽ là /api/CinemaRoom
public class CinemaRoomController : ControllerBase
{
    private readonly IRoomService _roomService;

    // Constructor injection: Cách hiện đại và được khuyến nghị trong .NET 6+
    public CinemaRoomController(IRoomService roomService)
    {
        _roomService = roomService;
    }

    // POST: api/CinemaRoom/CreateRoom
    [HttpPost("CreateRoom")]
    [Authorize(Policy = "FacilitiesManager")]
    public async Task<IActionResult> CreateRoom([FromBody] CreateRoomRequestDTO request)
    {
        if (request == null)
        {
            return BadRequest(new { message = "Dữ liệu không được để trống." });
        }

        var result = await _roomService.CreateRoomAsync(request);
        if (result.IsSuccess == false)
        {
            return BadRequest(new { message = result.Message });
        }
        return Ok(new { message = result.Message, data = result.Data });
    }


    // PUT: api/CinemaRoom/UpdateRoom/{RoomId}
    [HttpPut("UpdateRoom/{RoomId}")]
    [Authorize(Policy = "FacilitiesManager")]
    public async Task<IActionResult> UpdateRoom([FromRoute] string RoomId, [FromBody] UpdateRoomRequestDTO request)
    {
        if (request == null)
        {
            return BadRequest(new { message = "Dữ liệu không được để trống." });
        }

        var result = await _roomService.UpdateRoomAsync(RoomId, request);
        if (result.IsSuccess == false)
        {
            return BadRequest(new { message = result.Message });
        }
        return Ok(new { message = result.Message });
    }


    // DELETE: api/CinemaRoom/DeleteRoom/{RoomId}
    [HttpDelete("DeleteRoom/{RoomId}")]
    [Authorize(Policy = "FacilitiesManager")]
    public async Task<IActionResult> DeleteRoom([FromRoute] string RoomId)
    {
        var result = await _roomService.DeleteRoomAsync(RoomId);
        if (result.IsSuccess == false)
        {
            return BadRequest(new { message = result.Message });
        }
        return Ok(new { message = result.Message });
    }


    // GET: api/CinemaRoom/GetRoomList
    [HttpGet("GetRoomList")]
    public async Task<IActionResult> GetRoomList()
    {
        var result = await _roomService.GetRoomListAsync();
        if (result.IsSuccess == false)
        {
            return BadRequest(new { message = result.Message });
        }
        return Ok(new { message = result.Message, data = result.Data });
    }


    // GET: api/CinemaRoom/SearchRoomByCinemaId?CinemaId=...
    [HttpGet("SearchRoomByCinemaId")]
    public async Task<IActionResult> SearchRoomByCinemaId([FromQuery] string CinemaId)
    {
        var result = await _roomService.SearchRoomByCinemaIdAsync(CinemaId);
        if (result.IsSuccess == false)
        {
            return BadRequest(new { message = result.Message });
        }
        return Ok(new { message = result.Message, data = result.Data });
    }


    // GET: api/CinemaRoom/GetRoomDetail/{roomId}
    [HttpGet("GetRoomDetail/{roomId}")]
    public async Task<IActionResult> GetRoomDetail([FromRoute] string roomId)
    {
        var result = await _roomService.GetRoomDetailAsync(roomId);
        if (result.IsSuccess == false)
        {
            return NotFound(new { message = result.Message });
        }
        return Ok(new { message = result.Message, data = result.Data });
    }
}