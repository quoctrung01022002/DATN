using BackEnd_DATN.Entities;
using BackEnd_DATN.Helpers;
using BackEnd_DATN.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using VnPay.Demo.Services;

namespace BackEnd_DATN.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VnPaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly DatnTrung62132908Context _context;
        private readonly MailSetting _mailSettings;

        public VnPaymentController(IPaymentService paymentService, DatnTrung62132908Context context, IOptions<MailSetting> mailSettings)
        {
            _paymentService = paymentService;
            _context = context;
            _mailSettings = mailSettings.Value;
        }

        [HttpGet("CreateVNPayUrl")]
        public IActionResult CreateVNPayUrl([FromQuery] decimal selectedTotalPrice, string returnUrl, int vnp_TxnRef)
        {
            try
            {
                var result = _paymentService.CreateVNPayUrl(HttpContext, selectedTotalPrice, returnUrl, vnp_TxnRef);
                return Ok(result.Value);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error creating VNPay URL: {ex.Message}");
            }
        }

        [HttpGet("ExecuteVNPayPayment")]
        public async Task<IActionResult> ExecuteVNPayPayment()
        {
            var result = _paymentService.ExecuteVNPayPayment(HttpContext.Request.Query);

            if (result.IsSuccess)
            {
                var orderId = result.Value;
                var order = await _context.Orders
                    .Where(o => o.OrderId == orderId)
                    .Include(o => o.OrderDetails)
                    .FirstOrDefaultAsync();

                if (order != null)
                {
                    order.Status = 1;
                    await _context.SaveChangesAsync();

                    foreach (var orderDetail in order.OrderDetails)
                    {
                        var product = await _context.Products.FindAsync(orderDetail.ProductId);
                        if (product != null)
                        {
                            product.Quantity -= orderDetail.Quantity;
                            _context.Products.Update(product);
                        }
                    }

                    var cart = await _context.ShoppingCarts
                        .Include(c => c.ShoppingCartDetails)
                        .FirstOrDefaultAsync(c => c.UserId == order.UserId);

                    var listOfIds = order.OrderDetails.Select(o => o.ProductId).ToList();
                    _context.ShoppingCartDetails.RemoveRange(cart!.ShoppingCartDetails.Where(d => listOfIds.Contains(d.ProductId)));

                    await _context.SaveChangesAsync();

                    // Gửi hóa đơn qua email
                    await SendInvoiceEmailAsync(order.OrderId);

                    return Ok(new { Message = "Payment successfully executed. Cart cleared." });
                }

                return NotFound(new { Message = "Order not found." });
            }

            return BadRequest(new { Message = "Payment execution failed." });
        }

        // Helper method to send invoice email
        private async Task SendInvoiceEmailAsync(int orderId)
        {
            try
            {
                var order = await _context.Orders
                    .Include(o => o.User)
                    .Include(o => o.OrderDetails)
                        .ThenInclude(od => od.Product)
                    .FirstOrDefaultAsync(o => o.OrderId == orderId && o.Status == 1);

                if (order == null)
                {
                    Console.WriteLine("No paid order found for this orderId.");
                    return;
                }

                var orderDto = new OrderModel
                {
                    OrderId = order.OrderId,
                    UserId = order.UserId,
                    Name = order.Name,
                    PhoneNumber = order.PhoneNumber,
                    Address = order.Address,
                    Gender = order.Gender,
                    OrderDate = order.OrderDate,
                    PaymentMethod = order.PaymentMethod,
                    OrderDetails = await (from od in _context.OrderDetails
                                          join p in _context.Products on od.ProductId equals p.ProductId
                                          where od.OrderId == order.OrderId
                                          select new OrderDetailModel
                                          {
                                              ProductId = od.ProductId,
                                              ProductName = p.ProductName,
                                              Quantity = od.Quantity,
                                              Price = p.Price,
                                              DiscountValue = p.Discount == null ? 0.0 : (double)p.Discount.DiscountValue
                                          }).ToListAsync()
                };

                // Fetch shipping price
                var shippingPrice = await FetchShippingPriceAsync();

                // Create email content
                var body = $@"
        <style>
            body {{
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 20px;
                color: #333;
            }}
            .invoice-container {{
                max-width: 800px;
                margin: 20px auto;
                padding: 30px;
                background-color: #fff;
                border: 1px solid #ccc;
                border-radius: 8px;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            }}
            .invoice-header {{
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 1px solid #eee;
            }}
            .invoice-header h1 {{
                font-size: 32px;
                color: #333;
                margin: 0;
            }}
            .customer-info, .order-info {{
                margin-bottom: 20px;
                line-height: 1.6;
            }}
            .customer-info p, .order-info p {{
                margin: 5px 0;
            }}
            .order-details {{
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 30px;
            }}
            .order-details th, .order-details td {{
                border: 1px solid #ddd;
                padding: 10px;
                text-align: left;
            }}
            .order-details th {{
                background-color: #f9f9f9;
                font-weight: bold;
                color: #555;
            }}
            .order-details tr:nth-child(even) {{
                background-color: #f2f2f2;
            }}
            .total-price {{
                font-size: 20px;
                font-weight: bold;
                text-align: right;
                margin-top: 20px;
                color: #333;
            }}
            .discounted-price {{
                text-decoration: line-through;
                color: #b12704;
                margin-right: 10px;
            }}
            .footer {{
                text-align: center;
                margin-top: 40px;
                font-size: 12px;
                color: #777;
            }}
        </style>
        <div class='invoice-container'>
            <div class='invoice-header'>
                <h1>Hóa Đơn Mua Hàng</h1>
            </div>
            <div class='customer-info'>
                <p><strong>Mã đơn hàng:</strong> HD00{orderDto.OrderId}</p>
                <p><strong>Họ và tên khách hàng:</strong> {orderDto.Name}</p>
                <p><strong>Email:</strong> {order.User.Email}</p>
                <p><strong>Số điện thoại:</strong> {orderDto.PhoneNumber}</p>
                <p><strong>Địa chỉ:</strong> {orderDto.Address}</p>
                <p><strong>Giới tính:</strong> {((bool)orderDto.Gender ? "Nam" : "Nữ")}</p>
            </div>
            <div class='order-info'>
                <p><strong>Ngày tạo đơn hàng:</strong> {orderDto.OrderDate}</p>
                <p><strong>Phương thức thanh toán:</strong> {orderDto.PaymentMethod}</p>
            </div>
            <table class='order-details'>
                <thead>
                    <tr>
                        <th>Sản phẩm</th>
                        <th>Số lượng</th>
                        <th>Giá</th>
                    </tr>
                </thead>
                <tbody>";

                foreach (var orderDetail in orderDto.OrderDetails)
                {
                    var discountedPrice = CalculateDiscountedPrice(orderDetail.Price, orderDetail.DiscountValue);
                    var priceDisplay = orderDetail.DiscountValue == 0.00 ?
                        $"{discountedPrice}đ" :
                        $"<span class='discounted-price'>{orderDetail.Price}đ</span> {discountedPrice}đ";

                    body += $@"
                <tr>
                    <td>{orderDetail.ProductName}</td>
                    <td>{orderDetail.Quantity}</td>
                    <td>{priceDisplay}</td>
                </tr>";
                }

                var totalPrice = CalculateTotalPrice(orderDto) + (decimal)shippingPrice;
                body += $@"
                </tbody>
            </table>
            <p class='total-price'><strong>Phí vận chuyển:</strong> {shippingPrice}đ</p>
            <p class='total-price'><strong>Tổng tiền:</strong> {totalPrice}đ</p>
            <div class='footer'>
                <p>Cảm ơn bạn đã mua hàng!</p>
            </div>
        </div>";

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(_mailSettings.SenderEmail, _mailSettings.SenderName),
                    Subject = "Hoá đơn mua hàng của bạn",
                    Body = body,
                    IsBodyHtml = true
                };
                mailMessage.To.Add(order.User.Email);

                using (var client = new SmtpClient(_mailSettings.Server, _mailSettings.Port))
                {
                    client.EnableSsl = true;
                    client.Credentials = new NetworkCredential(_mailSettings.UserName, _mailSettings.Password);
                    await client.SendMailAsync(mailMessage);
                }

                Console.WriteLine("Invoice email sent successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send invoice email: {ex.Message}");
            }
        }


        private async Task<double> FetchShippingPriceAsync()
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    HttpResponseMessage response = await client.GetAsync("https://localhost:7138/api/Shipping");

                    if (response.IsSuccessStatusCode)
                    {
                        string jsonContent = await response.Content.ReadAsStringAsync();
                        var shippingData = JsonConvert.DeserializeObject<List<ShippingModel>>(jsonContent);

                        if (shippingData.Count > 0)
                        {
                            return (double)shippingData[0].ShippingUnitPrice;
                        }
                        else
                        {
                            Console.WriteLine("No shipping data found.");
                            return 0; // Or provide a default shipping price as per your requirement.
                        }
                    }
                    else
                    {
                        Console.WriteLine($"Failed to fetch shipping data. Status code: {response.StatusCode}");
                        return 0; // Or provide a default shipping price as per your requirement.
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching shipping: {ex.Message}");
                return 0; // Or provide a default shipping price as per your requirement.
            }
        }



        // Hàm tính tổng giá tiền của đơn hàng
        private decimal CalculateTotalPrice(OrderModel order)
        {
            decimal totalPrice = 0;
            foreach (var orderDetail in order.OrderDetails)
            {
                var discountedPrice = CalculateDiscountedPrice(orderDetail.Price, orderDetail.DiscountValue);
                totalPrice += orderDetail.Quantity * discountedPrice;
            }
            return totalPrice;
        }

        // Hàm tính giá sau khi giảm giá
        private decimal CalculateDiscountedPrice(decimal price, double discountValue)
        {
            if (discountValue > 0)
            {
                return price * (decimal)(1 - discountValue);
            }
            return price;
        }
    }
}
