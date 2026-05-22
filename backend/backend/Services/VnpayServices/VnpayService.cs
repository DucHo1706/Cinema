using backend.Data;
using backend.Interface.VnpayInterface;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace backend.Services.VnpayServices
{
    public class VnpayService : IVnpayService
    {
        private readonly DataContext _context;

        public VnpayService(DataContext context)
        {
            _context = context;
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> PaymentCallbackAsync(IQueryCollection collections)
        {
            var vnp_ResponseCode = collections["vnp_ResponseCode"];
            var vnp_TxnRef = collections["vnp_TxnRef"]; // Đây chính là OrderId chúng ta truyền đi
            
            if (string.IsNullOrEmpty(vnp_TxnRef))
            {
                return (false, "Không tìm thấy mã đơn hàng trả về từ VNPAY", null);
            }

            var order = await _context.Orders.FirstOrDefaultAsync(o => o.OrderId == vnp_TxnRef.ToString());
            if (order == null)
            {
                return (false, "Đơn hàng không tồn tại trong hệ thống", null);
            }

            if (vnp_ResponseCode == "00")
            {
                order.PaymentStatus = "Success";
                _context.Orders.Update(order);
                await _context.SaveChangesAsync();
                
                return (true, "Thanh toán thành công", order.OrderId);
            }
            else
            {
                order.PaymentStatus = "Failed";
                _context.Orders.Update(order);
                await _context.SaveChangesAsync();
                
                return (false, "Thanh toán thất bại hoặc người dùng đã hủy giao dịch", order.OrderId);
            }
        }
    }
}