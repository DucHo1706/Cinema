using backend.DTOs.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using backend.Interface.Account;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly IAccountService _accountService;

    public AccountController(IAccountService accountService)
    {
        _accountService = accountService;
    }

    [HttpGet("getAccountInfo")]
    [Authorize]
    public async Task<IActionResult> GetAccountInfo([FromQuery] string userID)
    {
        var result = await _accountService.GetAccountInfoAsync(userID);
        if (result.IsSuccess == false)
        {
            return BadRequest(new { message = result.Message });
        }
        return Ok(new { message = result.Message, data = result.Data });
    }

    [HttpPost("changePassword")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromQuery] string userID, [FromBody] ChangePasswordRequestDTO request)
    {
        var result = await _accountService.ChangePasswordAsync(userID, request);
        if (result.IsSuccess == false)
        {
            return BadRequest(new { message = result.Message });
        }
        return Ok(new { message = result.Message });
    }

    [HttpPost("ChangeAccountInformation")]
    [Authorize]
    public async Task<IActionResult> ChangeAccountInfo([FromQuery] string Userid, [FromBody] UpdateProfileRequestDTO request)
    {
        var result = await _accountService.UpdateProfileAsync(Userid, request);
        if (result.IsSuccess == false)
        {
            return BadRequest(new { message = result.Message });
        }
        return Ok(new { message = result.Message });
    }

    [HttpPost("ResetPassword")]
    [AllowAnonymous]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequestDTO request)
    {
        var result = await _accountService.ResetPasswordAsync(request);
        if (result.IsSuccess == false)
        {
            return BadRequest(new { message = result.Message });
        }
        return Ok(new { message = result.Message });
    }
}
