using backend.Interface.VnpayInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VnpayController : ControllerBase
    {
        private readonly IVnpayService _vnpayService;

        public VnpayController(IVnpayService vnpayService)
        {
            _vnpayService = vnpayService;
        }

        [HttpGet("PaymentCallback")]
        [AllowAnonymous] // Callback từ VNPAY không có token JWT nên phải cho phép vô danh
        public async Task<IActionResult> PaymentCallback()
        {
            var result = await _vnpayService.PaymentCallbackAsync(Request.Query);
            if (result.IsSuccess == false)
            {
                return BadRequest(new { message = result.Message, orderId = result.Data });
            }
            return Ok(new { message = result.Message, orderId = result.Data });
        }
    }
}