using backend.Interface.FoodInterface;
using backend.DTOs.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FoodController : ControllerBase
{
    private readonly IFoodService _foodService;

    public FoodController(IFoodService foodService)
    {
        _foodService = foodService;
    }

    [HttpGet("GetAllFoods")]
    public async Task<IActionResult> GetAllFoods()
    {
        var result = await _foodService.GetAllFoodsAsync();
        if (result.IsSuccess == false) return BadRequest(new { message = result.Message });
        return Ok(new { message = result.Message, data = result.Data });
    }

    [HttpPost("CreateFood")]
    [Authorize(Policy = "TheaterManager")]
    public async Task<IActionResult> CreateFood([FromBody] CreateFoodRequestDTO request)
    {
        var result = await _foodService.CreateFoodAsync(request);
        if (result.IsSuccess == false) return BadRequest(new { message = result.Message });
        return Ok(new { message = result.Message, data = result.Data });
    }

    [HttpPut("UpdateFood/{foodId}")]
    [Authorize(Policy = "TheaterManager")]
    public async Task<IActionResult> UpdateFood(string foodId, [FromBody] UpdateFoodRequestDTO request)
    {
        var result = await _foodService.UpdateFoodAsync(foodId, request);
        if (result.IsSuccess == false) return BadRequest(new { message = result.Message });
        return Ok(new { message = result.Message });
    }

    [HttpDelete("DeleteFood/{foodId}")]
    [Authorize(Policy = "TheaterManager")]
    public async Task<IActionResult> DeleteFood(string foodId)
    {
        var result = await _foodService.DeleteFoodAsync(foodId);
        if (result.IsSuccess == false)
        {
            return BadRequest(new { message = result.Message });
        }
        return Ok(new { message = result.Message });
    }
}