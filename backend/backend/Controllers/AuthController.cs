using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.DTOs.Requests;
using System.Threading.Tasks;
using backend.Interface.Auth;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO request)
        {
            var result = await _authService.LoginAsync(request);
            if (result.IsSuccess == false)
            {
                return BadRequest(new { message = result.Message });
            }
            return Ok(new { message = result.Message, data = result.Data });
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDTO request)
        {
            var result = await _authService.RegisterAsync(request);
            if (result.IsSuccess == false)
            {
                return BadRequest(new { message = result.Message });
            }
            return Ok(new { message = result.Message, data = result.Data });
        }

        [HttpPost("VerifyEmailCode")]
        [AllowAnonymous]
        public async Task<IActionResult> VerifyEmailCode([FromQuery] string emailAddress, [FromQuery] string code)
        {
            var result = await _authService.VerifyEmailCodeAsync(emailAddress, code);
            if (result.IsSuccess == false)
            {
                return BadRequest(new { message = result.Message });
            }
            return Ok(new { message = result.Message });
        }
    }
}
